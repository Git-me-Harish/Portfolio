/**
 * /api/github-contrib/route.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Returns per-day contribution data for any year via GitHub GraphQL API.
 *
 * Uses contributionCalendar query — gives EXACT contribution counts (commits,
 * PRs, issues, reviews) unlike the events REST API which only covers 90 days
 * and only counts public push events.
 *
 * Query params:
 *   user  — GitHub username
 *   year  — 4-digit year (defaults to current year)
 *
 * Response: { weeks: Week[], totalContributions: number, year: number }
 *   Week: { days: Day[] }
 *   Day:  { date: string; count: number; level: 0|1|2|3|4 }
 *
 * Auth:
 *   GITHUB_TOKEN required for GraphQL — set in .env.local
 *   Without token: falls back to public events REST API (current year only, ~90 days)
 *
 * Cache: 4h CDN + 12h stale-while-revalidate
 */

import { NextRequest } from 'next/server'

export const runtime = 'edge'

interface Day  { date: string; count: number; level: 0|1|2|3|4 }
interface Week { days: Day[] }

function countToLevel(count: number): 0|1|2|3|4 {
  if (count === 0) return 0
  if (count <= 2)  return 1
  if (count <= 5)  return 2
  if (count <= 9)  return 3
  return 4
}

// ── GitHub GraphQL contributionCalendar ───────────────────────────────────────

const GQL_QUERY = `
query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
`

interface GQLDay  { date: string; contributionCount: number }
interface GQLWeek { contributionDays: GQLDay[] }
interface GQLResp {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number
          weeks: GQLWeek[]
        }
      }
    }
  }
  errors?: Array<{ message: string }>
}

async function fetchViaGraphQL(
  username: string,
  year: number,
  token: string
): Promise<{ weeks: Week[]; totalContributions: number } | null> {
  const from = `${year}-01-01T00:00:00Z`
  const to   = `${year}-12-31T23:59:59Z`

  try {
    const ctrl = new AbortController()
    const t    = setTimeout(() => ctrl.abort(), 8000)
    const res  = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type':    'application/json',
        Authorization:     `Bearer ${token}`,
        'User-Agent':      'portfolio-know-more/1.0',
      },
      body: JSON.stringify({ query: GQL_QUERY, variables: { login: username, from, to } }),
      signal: ctrl.signal,
    })
    clearTimeout(t)

    if (!res.ok) return null
    const json: GQLResp = await res.json()
    if (json.errors?.length) return null

    const cal = json.data?.user?.contributionsCollection?.contributionCalendar
    if (!cal) return null

    const weeks: Week[] = cal.weeks.map(w => ({
      days: w.contributionDays.map(d => ({
        date:  d.date,
        count: d.contributionCount,
        level: countToLevel(d.contributionCount),
      })),
    }))

    return { weeks, totalContributions: cal.totalContributions }
  } catch {
    return null
  }
}

// ── Fallback: REST events API (current year, ~90 days only) ──────────────────

async function fetchViaEvents(
  username: string,
  year: number,
  token?: string
): Promise<{ weeks: Week[]; totalContributions: number }> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'portfolio-know-more/1.0',
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const counts = new Map<string, number>()

  await Promise.all([1, 2, 3].map(async page => {
    const ctrl = new AbortController()
    const t    = setTimeout(() => ctrl.abort(), 6000)
    try {
      const res = await fetch(
        `https://api.github.com/users/${username}/events/public?per_page=100&page=${page}`,
        { headers, signal: ctrl.signal }
      )
      clearTimeout(t)
      if (!res.ok) return
      const events: Array<{ type: string; created_at: string; payload?: { commits?: unknown[] } }> =
        await res.json()
      for (const ev of events) {
        const date = ev.created_at?.slice(0, 10)
        if (!date?.startsWith(String(year))) continue
        if (ev.type === 'PushEvent') {
          const bonus = (ev.payload?.commits as unknown[])?.length ?? 1
          counts.set(date, (counts.get(date) ?? 0) + Math.min(bonus, 10))
        } else if (['CreateEvent','IssuesEvent','PullRequestEvent','IssueCommentEvent','ReleaseEvent'].includes(ev.type)) {
          counts.set(date, (counts.get(date) ?? 0) + 1)
        }
      }
    } catch { clearTimeout(t) }
  }))

  return buildWeeksForYear(counts, year)
}

// ── Build full 53-week grid for a given year ──────────────────────────────────

function buildWeeksForYear(
  counts: Map<string, number>,
  year: number
): { weeks: Week[]; totalContributions: number } {
  const weeks: Week[] = []
  let total = 0

  // Start from Jan 1 of the year, roll back to Sunday
  const start = new Date(`${year}-01-01T00:00:00Z`)
  start.setUTCDate(start.getUTCDate() - start.getUTCDay()) // back to Sunday

  const end = new Date(`${year}-12-31T23:59:59Z`)

  const cursor = new Date(start)
  while (cursor <= end) {
    const week: Week = { days: [] }
    for (let d = 0; d < 7; d++) {
      const dateStr = cursor.toISOString().slice(0, 10)
      const inYear  = dateStr.startsWith(String(year))
      const count   = inYear ? (counts.get(dateStr) ?? 0) : 0
      total += count
      week.days.push({ date: dateStr, count, level: countToLevel(count) })
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    }
    weeks.push(week)
    if (cursor.getUTCFullYear() > year) break
  }

  return { weeks, totalContributions: total }
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const user = req.nextUrl.searchParams.get('user')
  if (!user || !/^[a-zA-Z0-9_-]{1,39}$/.test(user)) {
    return new Response('Invalid user', { status: 400 })
  }

  const currentYear = new Date().getFullYear()
  const rawYear     = req.nextUrl.searchParams.get('year')
  const year        = rawYear ? Math.max(2008, Math.min(currentYear, parseInt(rawYear, 10))) : currentYear

  const token = process.env.GITHUB_TOKEN

  // GraphQL path — accurate for any year, requires token
  if (token) {
    const gql = await fetchViaGraphQL(user, year, token)
    if (gql) {
      return new Response(JSON.stringify({ ...gql, year }), {
        headers: {
          'Content-Type':  'application/json',
          'Cache-Control': `public, s-maxage=${year < currentYear ? 86400 : 14400}, stale-while-revalidate=43200`,
          'Access-Control-Allow-Origin': '*',
        },
      })
    }
  }

  // REST fallback — only works well for current year / recent events
  const rest = await fetchViaEvents(user, year, token)
  return new Response(JSON.stringify({ ...rest, year }), {
    headers: {
      'Content-Type':  'application/json',
      'Cache-Control': 'public, s-maxage=14400, stale-while-revalidate=43200',
      'Access-Control-Allow-Origin': '*',
    },
  })
}