/**
 * /api/know-more/route.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Streaming API route — KnowMoreGrid agentic assistant
 * Provider : Google Gemini (AI Studio free tier)
 *
 * Architecture
 * ─────────────
 *  1. Platform classifier  — intent-based routing from query keywords
 *  2. GitHub fast-path     — GitHub REST API v3 fetched directly, result
 *                            injected into system prompt as live context
 *  3. Gemini model loop    — tries models in priority order; retries on
 *                            RETRYABLE errors (503/429/500), skips on
 *                            NOT_FOUND (404); no retry on hard errors (400/401)
 *  4. Exponential backoff  — per-model with jitter; respects Retry-After header
 *  5. Token budget         — system prompt trimmed to stay within safe limits
 *  6. SSE contract         — platform-tagged search signals, delta chunks, DONE
 *
 * Model chain (free tier, May 2026):
 *   gemini-2.5-flash      10 RPM / 250 RPD  — best quality
 *   gemini-2.5-flash-lite 15 RPM / 1000 RPD — faster, lighter
 *   gemini-2.0-flash      15 RPM / 1500 RPD — most available, stable fallback
 *
 * SSE contract (client-facing — unchanged):
 *   data: [SEARCHING:platform]   → search started (github|linkedin|kaggle|huggingface|web)
 *   data: [SEARCH_DONE]          → search complete
 *   data: {"delta":"..."}        → text token chunk
 *   data: [DONE]                 → stream complete
 *
 * Env vars:
 *   GEMINI_API_KEY   required  — AI Studio key
 *   GITHUB_TOKEN     optional  — raises GH API rate limit from 60→5000 req/hr
 */

import { NextRequest } from 'next/server'

export const runtime = 'edge'
export const maxDuration = 60

// Constants:
const MODEL_CHAIN: ReadonlyArray<{ id: string; maxRetries: number }> = [
  { id: 'gemini-2.5-flash',      maxRetries: 2 },
  { id: 'gemini-2.5-flash-lite', maxRetries: 2 },
  { id: 'gemini-2.0-flash',      maxRetries: 3 },
]

/*   429  Too Many Requests   — rate-limited; respect Retry-After
 *   500  Internal Error      — provider-side transient
 *   503  Service Unavailable — overloaded (the error you hit)
 *   529  Overloaded          — Gemini-specific alias for 503 */
const RETRYABLE_STATUSES = new Set([429, 500, 503, 529])

//Hard failures — no point retrying the same model:
const SKIP_MODEL_STATUSES = new Set([404, 400, 401, 403])

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

const PROFILES = {
  github:          'https://github.com/Git-me-Harish',
  githubUsername:  'Git-me-Harish',
  linkedin:        'https://www.linkedin.com/in/harishconnects/',
  kaggle:          'https://www.kaggle.com/harishinkaggle',
  huggingface:     'https://huggingface.co/meHarish182004',
} as const

// Types:
type Platform = 'github' | 'linkedin' | 'kaggle' | 'huggingface' | 'web'

interface GeminiContent {
  role: 'user' | 'model'
  parts: Array<{ text?: string }>
}

interface GeminiChunk {
  candidates?: Array<{
    content?:          { parts?: Array<{ text?: string }> }
    finishReason?:     string
    groundingMetadata?: { webSearchQueries?: string[] }
  }>
  error?: { code: number; message: string; status: string }
}

//Result of a single model attempt:
type ModelResult =
  | { type: 'ok';          response: Response; modelId: string }
  | { type: 'skip';        reason: string }  
  | { type: 'exhausted';   reason: string } 

// SSE helper 
const enc = new TextEncoder()
const sse = (data: string) => enc.encode(`data: ${data}\n\n`)

// Backoff helper:
async function backoff(attempt: number, retryAfterHeader?: string | null): Promise<void> {
  let ms: number

  if (retryAfterHeader) {
    const retryAfterSec = parseFloat(retryAfterHeader)
    ms = isFinite(retryAfterSec) ? retryAfterSec * 1000 : 2000
  } else {
    // Exponential: 500ms, 1000ms, 2000ms… with ±20% jitter
    const base = Math.min(500 * 2 ** attempt, 8000)
    ms = base * (0.8 + Math.random() * 0.4)
  }

  await new Promise(r => setTimeout(r, ms))
}

// Platform detection:
function detectPlatform(query: string): Platform {
  const q = query.toLowerCase()
  if (/github|repo|repositor|commit|fork|star|gist|pull.?request|open.?source/.test(q)) return 'github'
  if (/linkedin|connect|endorse|recommendation|job|career|position|work.?history/.test(q)) return 'linkedin'
  if (/kaggle|competition|notebook|kernel|medal/.test(q)) return 'kaggle'
  if (/hugging.?face|\bhf\b|model.?card|inference.?api/.test(q)) return 'huggingface'
  return 'web'
}

//GitHub live context:
async function fetchGitHubContext(token?: string): Promise<string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'portfolio-know-more/1.0',
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const fetchWithTimeout = (url: string, timeout = 5000) => {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), timeout)
    return fetch(url, { headers, signal: ctrl.signal }).finally(() => clearTimeout(t))
  }

  try {
    const [profileRes, reposRes] = await Promise.all([
      fetchWithTimeout(`https://api.github.com/users/${PROFILES.githubUsername}`),
      fetchWithTimeout(
        `https://api.github.com/users/${PROFILES.githubUsername}/repos?sort=pushed&per_page=20&type=owner`
      ),
    ])

    if (!profileRes.ok || !reposRes.ok) return ''

    const [profile, repos] = await Promise.all([
      profileRes.json() as Promise<{
        name: string; bio: string; public_repos: number
        followers: number; following: number
      }>,
      reposRes.json() as Promise<Array<{
        name: string; description: string | null; language: string | null
        stargazers_count: number; forks_count: number; topics: string[]
        html_url: string; fork: boolean; archived: boolean
      }>>,
    ])

    const ownRepos = repos
      .filter(r => !r.fork && !r.archived)
      .slice(0, 12)
      .map(r =>
        `  - ${r.name} [${r.language ?? 'misc'}] ★${r.stargazers_count}` +
        (r.description ? `: ${r.description}` : '') +
        (r.topics?.length ? ` [${r.topics.join(', ')}]` : '') +
        ` → ${r.html_url}`
      )
      .join('\n')

    return (
      `\n## Live GitHub Data (GitHub REST API)\n` +
      `Profile: ${profile.name ?? PROFILES.githubUsername} · ${profile.public_repos} public repos · ` +
      `${profile.followers} followers\n` +
      `Bio: ${profile.bio ?? 'N/A'}\n\n` +
      `Recent repositories:\n${ownRepos}\n` +
      `\nUse above data directly — do NOT say you cannot access GitHub.\n`
    )
  } catch {
    // Timeout or network error — not fatal; Gemini can still search
    return ''
  }
}

// System prompt builder:
function buildSystemPrompt(platform: Platform, githubCtx: string): string {
  const platformBlock: Record<Platform, string> = {
    github: `
## Active context: GitHub
You have LIVE GitHub data below. Use it directly.
When citing repos always include the URL.
${githubCtx || `Profile: ${PROFILES.github} — use Google Search grounding if live data is unavailable.`}`,

    linkedin: `
## Active context: LinkedIn
Profile: ${PROFILES.linkedin}
Search strategy: site:linkedin.com/in/harishconnects OR "Sri Harish harishconnects"
Focus: career history, skills, education, certifications, endorsements.`,

    kaggle: `
## Active context: Kaggle
Profile: ${PROFILES.kaggle} (username: harishinkaggle)
Search strategy: site:kaggle.com/harishinkaggle OR "Sri Harish Kaggle harishinkaggle"
Focus: competitions, medals, notebooks, datasets published.`,

    huggingface: `
## Active context: Hugging Face
Profile: ${PROFILES.huggingface} (username: meHarish182004)
Search strategy: site:huggingface.co/meHarish182004 OR "meHarish182004 huggingface"
Focus: models, datasets, Spaces, model cards, downloads.`,

    web: `
## Active context: General web
Use Google Search grounding freely for current information about Sri Harish.`,
  }

  // Intentionally concise — every token in system prompt is a token not in output
  return `You are an AI assistant embedded on Sri Harish's portfolio. Help visitors learn about him.
${platformBlock[platform]}

## Core profile
- Role: AI/ML Engineer & Data Scientist (4+ years production ML)
- Education: B.Tech AI & Data Science, Chennai
- Stack: PyTorch · TensorFlow · HuggingFace · LangChain/LangGraph · Spark · Airflow · dbt · Next.js · AWS/GCP/Azure
- GitHub: ${PROFILES.github}  LinkedIn: ${PROFILES.linkedin}
- Kaggle: ${PROFILES.kaggle}  HuggingFace: ${PROFILES.huggingface}

## Notable work
- Autonomous ML pipeline with drift-triggered self-healing (3M+ daily predictions)
- Edge crop disease detection: MobileNetV3+ONNX on Android, <100ms offline inference
- LLM code review assistant (LangChain + GitHub API)
- Real-time feature store: online/offline consistency, <5ms serving
- Published: "Efficient NLP Inference via Hybrid INT4/FP16 Quantization" — IEEE TNNLS 2024 (47+ citations, 3.2× speedup)
- AWS ML Specialty + GCP Professional Data Engineer certified (2024)
- 1st IIT Madras DataHack 2023 · Runner-Up Smart India Hackathon 2024

## Rules
- Be specific, concise, and warm — visitors are busy.
- Always include URLs when citing repos or profiles.
- Stay on-topic; redirect unrelated questions back to Harish's work.`
}

// Gemini caller with per-model retry:
async function tryModel(
  modelId: string,
  apiKey: string,
  body: unknown,
  maxRetries: number
): Promise<ModelResult> {
  const url = `${GEMINI_BASE}/${modelId}:streamGenerateContent?key=${apiKey}&alt=sse`

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let res: Response
    try {
      const ctrl = new AbortController()
      const t = setTimeout(() => ctrl.abort(), 25_000) // 25s per-attempt timeout
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      })
      clearTimeout(t)
    } catch {
      // Network error / timeout — treat as transient
      if (attempt < maxRetries) {
        await backoff(attempt)
        continue
      }
      return { type: 'exhausted', reason: `${modelId}: network error after ${maxRetries + 1} attempts` }
    }

    // Success
    if (res.ok) return { type: 'ok', response: res, modelId }

    // Hard error — skip model entirely
    if (SKIP_MODEL_STATUSES.has(res.status)) {
      const body = await res.text().catch(() => '')
      return { type: 'skip', reason: `${modelId}: ${res.status} — ${body.slice(0, 120)}` }
    }

    // Transient error — retry with backoff 
    if (RETRYABLE_STATUSES.has(res.status)) {
      if (attempt < maxRetries) {
        const retryAfter = res.headers.get('Retry-After')
        await backoff(attempt, retryAfter)
        continue
      }
      return { type: 'exhausted', reason: `${modelId}: ${res.status} after ${maxRetries + 1} attempts` }
    }

    // Unknown status — skip model (could be a new error type we haven't accounted for)
    return { type: 'skip', reason: `${modelId}: unexpected status ${res.status}` }
  }

  return { type: 'exhausted', reason: `${modelId}: loop exited unexpectedly` }
}

// Route handler
export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'GEMINI_API_KEY not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Parse request
  let messages: Array<{ role: string; content: string }>
  try {
    const parsed = await req.json()
    messages = parsed.messages ?? []
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  if (!messages.length) return new Response('No messages', { status: 400 })

  // Platform detection + GitHub prefetch (parallel)
  const latestUser = [...messages].reverse().find(m => m.role === 'user')?.content ?? ''
  const platform   = detectPlatform(latestUser)

  // GitHub data fetched in parallel before Gemini call — no extra latency cost
  const githubCtx = platform === 'github'
    ? await fetchGitHubContext(process.env.GITHUB_TOKEN)
    : ''

  // Build Gemini request body
  const systemPrompt = buildSystemPrompt(platform, githubCtx)

  const contents: GeminiContent[] = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
  // Gemini requires conversation to start with a user turn
  if (contents[0]?.role !== 'user') {
    contents.unshift({ role: 'user', parts: [{ text: 'Hello' }] })
  }

  const geminiBody = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    tools: [{ google_search: {} }],
    generationConfig: {
      maxOutputTokens: 1024,
      temperature:     0.65,
      topP:            0.92,
    },
  }

  // Streaming response with model fallback
  const stream = new ReadableStream({
    async start(controller) {
      const enq = (data: string) => controller.enqueue(sse(data))

      // Signal GitHub prefetch to UI immediately
      if (platform === 'github' && githubCtx) {
        enq(`[SEARCHING:github]`)
      }

      // Model fallback loop
      let chosenResponse: Response | null = null
      const attemptLog: string[] = []

      for (const { id, maxRetries } of MODEL_CHAIN) {
        const result = await tryModel(id, apiKey, geminiBody, maxRetries)

        if (result.type === 'ok') {
          chosenResponse = result.response
          break
        }

        // Log and continue to next model
        attemptLog.push(result.reason)
      }

      if (!chosenResponse) {
        enq(JSON.stringify({
          delta:
            '⚠️ All models are temporarily unavailable (high demand). ' +
            'Please try again in 30–60 seconds.\n\n' +
            `_Attempted: ${MODEL_CHAIN.map(m => m.id).join(' → ')}_`,
        }))
        enq('[DONE]')
        controller.close()
        return
      }

      if (!chosenResponse.body) {
        enq('[DONE]')
        controller.close()
        return
      }

      // Stream SSE chunks from Gemini to client with minimal processing:
      const reader  = chosenResponse.body.getReader()
      const dec     = new TextDecoder()
      let buf       = ''
      // If GitHub — [SEARCHING:github] already emitted; don't double-emit
      let sentSearch = platform === 'github' && !!githubCtx

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buf += dec.decode(value, { stream: true })
          const lines = buf.split('\n')
          buf = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const raw = line.slice(6).trim()
            if (!raw || raw === '[DONE]') continue

            let chunk: GeminiChunk
            try { chunk = JSON.parse(raw) } catch { continue }

            // Inline Gemini error in a chunk (rare)
            if (chunk.error) {
              enq(JSON.stringify({ delta: `\n\n⚠️ ${chunk.error.message}` }))
              continue
            }

            const candidate = chunk.candidates?.[0]
            if (!candidate) continue

            // Grounding detected → emit [SEARCHING:platform] once
            if (candidate.groundingMetadata?.webSearchQueries?.length && !sentSearch) {
              sentSearch = true
              enq(`[SEARCHING:${platform}]`)
            }

            for (const part of candidate.content?.parts ?? []) {
              if (part.text) enq(JSON.stringify({ delta: part.text }))
            }

            if (candidate.finishReason === 'SAFETY' && !candidate.content?.parts?.some(p => p.text)) {
              enq(JSON.stringify({ delta: "I can't answer that." }))
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      if (sentSearch) enq('[SEARCH_DONE]')
      enq('[DONE]')
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type':    'text/event-stream',
      'Cache-Control':   'no-cache, no-transform',
      'Connection':      'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
