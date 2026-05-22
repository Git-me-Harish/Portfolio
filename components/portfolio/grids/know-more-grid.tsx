'use client'

import {
  useState, useRef, useEffect, useCallback,
  forwardRef, useId,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// INLINED: AnimatedBeam (kept for compatibility / unused path)
// ─────────────────────────────────────────────────────────────────────────────

interface AnimatedBeamProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  fromRef: React.RefObject<HTMLDivElement | null>
  toRef: React.RefObject<HTMLDivElement | null>
  curvature?: number
  duration?: number
  delay?: number
  reverse?: boolean
  color?: string
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
}

function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  duration = 3,
  delay = 0,
  reverse = false,
  color,
  pathColor = 'rgba(0,0,0,0.1)',
  pathWidth = 1.5,
  pathOpacity = 0.25,
  gradientStartColor = '#ff6b00',
  gradientStopColor = '#ff9d4d',
}: AnimatedBeamProps) {
  const id = useId()
  const [pathD, setPathD] = useState('')
  const [svgDims, setSvgDims] = useState({ w: 0, h: 0 })
  const animPathRef = useRef<SVGPathElement>(null)
  const gradId = `grad-${id.replace(/:/g, '')}`

  const calc = useCallback(() => {
    const container = containerRef.current
    const from = fromRef.current
    const to = toRef.current
    if (!container || !from || !to) return
    const cRect = container.getBoundingClientRect()
    const fRect = from.getBoundingClientRect()
    const tRect = to.getBoundingClientRect()
    setSvgDims({ w: cRect.width, h: cRect.height })
    const sx = fRect.left - cRect.left + fRect.width / 2
    const sy = fRect.top - cRect.top + fRect.height / 2
    const ex = tRect.left - cRect.left + tRect.width / 2
    const ey = tRect.top - cRect.top + tRect.height / 2
    const mx = (sx + ex) / 2
    const my = (sy + ey) / 2
    setPathD(`M ${sx},${sy} Q ${mx + curvature},${my} ${ex},${ey}`)
  }, [containerRef, fromRef, toRef, curvature])

  useEffect(() => {
    calc()
    const ro = new ResizeObserver(calc)
    if (containerRef.current) ro.observe(containerRef.current)
    window.addEventListener('resize', calc)
    return () => { ro.disconnect(); window.removeEventListener('resize', calc) }
  }, [calc])

  useEffect(() => {
    if (!pathD || !animPathRef.current) return
    const pathEl = animPathRef.current
    const len = pathEl.getTotalLength?.() ?? 200
    pathEl.style.strokeDasharray = `${len * 0.25} ${len}`
    pathEl.style.strokeDashoffset = reverse ? `-${len}` : `${len}`
  }, [pathD, reverse])

  const beamColor = color ?? gradientStartColor

  return (
    <svg fill="none" width={svgDims.w} height={svgDims.h} xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute left-0 top-0" style={{ zIndex: 1, overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="40%" stopColor={gradientStartColor} stopOpacity="1" />
          <stop offset="60%" stopColor={gradientStopColor} stopOpacity="1" />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={pathD} stroke={pathColor} strokeWidth={pathWidth} strokeOpacity={pathOpacity} fill="none" />
      <path ref={animPathRef} d={pathD} stroke={`url(#${gradId})`} strokeWidth={pathWidth + 1} fill="none"
        strokeLinecap="round"
        style={{
          animation: `beam-travel-${reverse ? 'rev' : 'fwd'} ${duration}s linear ${delay}s infinite`,
          filter: `drop-shadow(0 0 3px ${beamColor})`,
        }} />
      <style>{`
        @keyframes beam-travel-fwd {
          0%   { stroke-dashoffset: var(--beam-len, 400); opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { stroke-dashoffset: calc(var(--beam-len, 400) * -1); opacity: 0; }
        }
        @keyframes beam-travel-rev {
          0%   { stroke-dashoffset: calc(var(--beam-len, 400) * -1); opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { stroke-dashoffset: var(--beam-len, 400); opacity: 0; }
        }
      `}</style>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// INLINED: TravelingBeam — animateMotion orb along SVG path
// ─────────────────────────────────────────────────────────────────────────────

interface TravelingBeamProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  fromRef: React.RefObject<HTMLDivElement | null>
  toRef: React.RefObject<HTMLDivElement | null>
  curvature?: number
  duration?: number
  delay?: number
  color?: string
  pathColor?: string
}

function TravelingBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  duration = 2.5,
  delay = 0,
  color = '#4285F4',
  pathColor,
}: TravelingBeamProps) {
  const id = useId()
  const uid = id.replace(/:/g, '')
  const [pathD, setPathD] = useState('')
  const [svgDims, setSvgDims] = useState({ w: 0, h: 0 })
  const trackColor = pathColor ?? 'var(--border)'

  const calc = useCallback(() => {
    const container = containerRef.current
    const from = fromRef.current
    const to = toRef.current
    if (!container || !from || !to) return
    const cRect = container.getBoundingClientRect()
    const fRect = from.getBoundingClientRect()
    const tRect = to.getBoundingClientRect()
    setSvgDims({ w: cRect.width, h: cRect.height })
    const sx = fRect.left - cRect.left + fRect.width / 2
    const sy = fRect.top - cRect.top + fRect.height / 2
    const ex = tRect.left - cRect.left + tRect.width / 2
    const ey = tRect.top - cRect.top + tRect.height / 2
    const mx = (sx + ex) / 2
    const my = (sy + ey) / 2
    setPathD(`M ${sx},${sy} Q ${mx + curvature},${my} ${ex},${ey}`)
  }, [containerRef, fromRef, toRef, curvature])

  useEffect(() => {
    calc()
    const ro = new ResizeObserver(calc)
    if (containerRef.current) ro.observe(containerRef.current)
    window.addEventListener('resize', calc)
    return () => { ro.disconnect(); window.removeEventListener('resize', calc) }
  }, [calc])

  if (!pathD) return null

  return (
    <svg fill="none" width={svgDims.w} height={svgDims.h} xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute left-0 top-0" style={{ zIndex: 2, overflow: 'visible' }}>
      <defs>
        <path id={`track-${uid}`} d={pathD} />
        <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <use href={`#track-${uid}`} stroke={trackColor} strokeWidth="1.5" strokeOpacity="0.3" fill="none" />
      <circle r="4" fill={`url(#glow-${uid})`} style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
        <animateMotion dur={`${duration}s`} begin={`${delay}s`} repeatCount="indefinite"
          calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.6 1">
          <mpath href={`#track-${uid}`} />
        </animateMotion>
      </circle>
      <circle r="2" fill={color} opacity="0.9">
        <animateMotion dur={`${duration}s`} begin={`${delay}s`} repeatCount="indefinite"
          calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.6 1">
          <mpath href={`#track-${uid}`} />
        </animateMotion>
      </circle>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// INLINED: InteractiveGridPattern
// ─────────────────────────────────────────────────────────────────────────────

function InteractiveGridPattern({
  width = 32, height = 32,
  squares = [20, 18] as [number, number],
  className,
}: { width?: number; height?: number; squares?: [number, number]; className?: string }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [cols, rows] = squares
  return (
    <svg className={cn('absolute inset-0 h-full w-full', className)} xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: cols * rows }).map((_, i) => (
        <rect key={i} x={(i % cols) * width} y={Math.floor(i / cols) * height}
          width={width - 1} height={height - 1} rx={2}
          fill={hovered === i ? 'var(--accent-dim)' : 'transparent'}
          stroke="currentColor" strokeOpacity={0.06} strokeWidth={0.5}
          className="transition-colors duration-300 cursor-crosshair"
          onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />
      ))}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Chat background gradient — light and dark mode aware
// Matches the soft colour-graded style in the reference screenshot.
// ─────────────────────────────────────────────────────────────────────────────

function ChatBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {/* Light mode: soft blue-purple-peach gradient */}
      <div className="absolute inset-0 dark:opacity-0 transition-opacity duration-300"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(147,197,253,0.35) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 0%,  rgba(196,181,253,0.28) 0%, transparent 55%),
            radial-gradient(ellipse 70% 60% at 50% 90%, rgba(253,186,116,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 90% 80% at 10% 80%, rgba(167,243,208,0.15) 0%, transparent 60%)
          `,
        }}
      />
      {/* Dark mode: deeper tinted blobs */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-300"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(59,130,246,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 0%,  rgba(139,92,246,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 70% 60% at 50% 90%, rgba(249,115,22,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 90% 80% at 10% 80%, rgba(34,197,94,0.06)  0%, transparent 60%)
          `,
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type SearchPlatform = 'github' | 'linkedin' | 'kaggle' | 'huggingface' | 'web' | null

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
  searched?: boolean
  searchPlatform?: SearchPlatform
}

interface KnowMoreGridProps {
  isMobile?: boolean
}

const SUGGESTED_PROMPTS = [
  "What repos are on Harish's GitHub?",
  "What models has he published on HuggingFace?",
  "What's his ML/AI stack?",
  "Any Kaggle competitions or medals?",
  "Any published research or papers?",
  "What certifications does he hold?",
  "What kind of roles is he open to?",
  "Tell me about his experience with LLMs",
]

// ─────────────────────────────────────────────────────────────────────────────
// Markdown renderer
// ─────────────────────────────────────────────────────────────────────────────

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  const nodes: React.ReactNode[] = []
  lines.forEach((line, idx) => {
    if (line.match(/^[-*•]\s/)) {
      const content = line.replace(/^[-*•]\s/, '')
      nodes.push(
        <div key={idx} className="flex items-start gap-2 my-0.5">
          <span className="mt-[5px] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
          <span>{parseInline(content)}</span>
        </div>
      )
      return
    }
    const numMatch = line.match(/^(\d+)\.\s(.+)/)
    if (numMatch) {
      nodes.push(
        <div key={idx} className="flex items-start gap-2 my-0.5">
          <span className="text-[10px] font-semibold flex-shrink-0 mt-0.5"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', minWidth: 16 }}>
            {numMatch[1]}.
          </span>
          <span>{parseInline(numMatch[2])}</span>
        </div>
      )
      return
    }
    if (line.trim() === '') { nodes.push(<div key={idx} className="h-1.5" />); return }
    nodes.push(<span key={idx}>{parseInline(line)}<br /></span>)
  })
  return nodes
}

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const regex = /(\*\*(.+?)\*\*|`([^`]+)`)/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    if (match[2]) {
      parts.push(<strong key={match.index} style={{ color: 'var(--text-primary)' }}>{match[2]}</strong>)
    } else if (match[3]) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded text-[11px]"
          style={{ background: 'var(--bg-elevated)', color: 'var(--accent)', fontFamily: 'var(--font-mono)', border: '1px solid var(--border)' }}>
          {match[3]}
        </code>
      )
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}

// ─────────────────────────────────────────────────────────────────────────────
// Avatar icons for chat bubbles
// ─────────────────────────────────────────────────────────────────────────────

function UserAvatar() {
  return (
    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
      style={{ background: 'var(--accent)', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  )
}

function AssistantAvatar() {
  return (
    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border"
      style={{
        background: 'var(--bg-card)',
        borderColor: '#4285F4',
        boxShadow: '0 0 0 2px rgba(66,133,244,0.15)',
      }}>
      {/* Gemini star mark — mini version */}
      <svg width="13" height="13" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 4 C14 4 14.5 9.5 18 14 C14.5 18.5 14 24 14 24 C14 24 13.5 18.5 10 14 C13.5 9.5 14 4 14 4Z"
          fill="url(#av-gem-v)" />
        <path d="M4 14 C4 14 9.5 13.5 14 10 C18.5 13.5 24 14 24 14 C24 14 18.5 14.5 14 18 C9.5 14.5 4 14 4 14Z"
          fill="url(#av-gem-h)" />
        <defs>
          <linearGradient id="av-gem-v" x1="14" y1="4" x2="14" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4285F4"/>
            <stop offset="50%" stopColor="#9C27B0"/>
            <stop offset="100%" stopColor="#EA4335"/>
          </linearGradient>
          <linearGradient id="av-gem-h" x1="4" y1="14" x2="24" y2="14" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34A853"/>
            <stop offset="50%" stopColor="#FBBC05"/>
            <stop offset="100%" stopColor="#EA4335"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// UI pieces
// ─────────────────────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2.5">
      {[0, 1, 2].map(i => (
        <motion.span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }} />
      ))}
    </div>
  )
}

// Platform brand config for search indicator
const PLATFORM_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  github: {
    label: 'Searching GitHub…',
    color: '#e6edf3',
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  linkedin: {
    label: 'Searching LinkedIn…',
    color: '#0A66C2',
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  kaggle: {
    label: 'Searching Kaggle…',
    color: '#20BEFF',
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.334z" />
      </svg>
    ),
  },
  huggingface: {
    label: 'Searching HuggingFace…',
    color: '#FFD21E',
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="11" r="9" />
        <circle cx="9" cy="10" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="15" cy="10" r="1.2" fill="currentColor" stroke="none" />
        <path d="M8.5 14.5 Q12 17.5 15.5 14.5" strokeLinecap="round" />
      </svg>
    ),
  },
  web: {
    label: 'Searching the web…',
    color: 'var(--accent)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
}

function SearchIndicator({ platform }: { platform?: SearchPlatform }) {
  const key = platform ?? 'web'
  const meta = PLATFORM_META[key] ?? PLATFORM_META.web
  const isDark = key !== 'web' // for non-web platforms show a colored dot

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg mb-1 w-fit ml-8"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
    >
      {/* Spinning platform icon */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        style={{ color: meta.color }}
      >
        {meta.icon}
      </motion.div>
      <span className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>
        {meta.label}
      </span>
      {/* Pulsing brand dot */}
      <motion.div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: meta.color }}
        animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
        transition={{ duration: 0.9, repeat: Infinity }}
      />
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MessageBubble — now with avatars on each side
// ─────────────────────────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}
    >
      {/* Avatar */}
      {isUser ? <UserAvatar /> : <AssistantAvatar />}

      {/* Bubble + web-search badge */}
      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Search badge (assistant only) */}
        {!isUser && message.searched && !message.streaming && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            {(() => {
              const key = message.searchPlatform ?? 'web'
              const meta = PLATFORM_META[key] ?? PLATFORM_META.web
              return (
                <>
                  <span style={{ color: meta.color, display: 'flex' }}>{meta.icon}</span>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    Searched {key === 'web' ? 'the web' : key === 'huggingface' ? 'HuggingFace' : key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </>
              )
            })()}
          </div>
        )}

        {/* Bubble */}
        <div
          className="rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed"
          style={isUser
            ? {
                background: 'var(--accent)',
                color: '#000',
                fontWeight: 500,
                borderBottomRightRadius: 4,
                // slight glass shimmer on user bubble
                boxShadow: '0 2px 12px rgba(66,133,244,0.25)',
              }
            : {
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderBottomLeftRadius: 4,
                boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
              }
          }
        >
          {isUser
            ? message.content
            : message.streaming && message.content === ''
              ? <TypingIndicator />
              : (
                <div className="space-y-0.5">
                  {renderMarkdown(message.content)}
                  {message.streaming && (
                    <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-0.5 h-3.5 ml-0.5 align-middle rounded-sm" style={{ background: 'var(--accent)' }} />
                  )}
                </div>
              )
          }
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BeamNode
// ─────────────────────────────────────────────────────────────────────────────

const BeamNode = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; size?: 'sm' | 'md' | 'lg'; style?: React.CSSProperties }
>(({ className, children, size = 'md', style }, ref) => {
  const sizeClass = size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11'
  return (
    <div ref={ref}
      className={cn(
        'relative z-10 flex items-center justify-center rounded-full border transition-all duration-300 group cursor-pointer',
        'hover:bg-[var(--accent-dim)] hover:border-[var(--accent)] hover:scale-105',
        sizeClass, className
      )}
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        ...style,
      }}>
      {children}
    </div>
  )
})
BeamNode.displayName = 'BeamNode'

// ─────────────────────────────────────────────────────────────────────────────
// VerticalAnimatedBeam
// ─────────────────────────────────────────────────────────────────────────────

function VerticalAnimatedBeam() {
  const containerRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const claudeRef = useRef<HTMLDivElement>(null)
  const githubRef = useRef<HTMLDivElement>(null)
  const linkedinRef = useRef<HTMLDivElement>(null)
  const kaggleRef = useRef<HTMLDivElement>(null)
  const hfRef = useRef<HTMLDivElement>(null)
  const webRef = useRef<HTMLDivElement>(null)

  const platformRefs = [githubRef, linkedinRef, kaggleRef, hfRef, webRef]
  const delays = [0.3, 0.55, 0.8, 1.05, 1.3]
  const curvatures = [-70, -35, 0, 35, 70]

  const platforms = [
    {
      label: 'GitHub',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--text-primary)]">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: 'Kaggle',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#20BEFF">
          <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.334z" />
        </svg>
      ),
    },
    {
      label: 'HF',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFD21E" strokeWidth="1.8">
          <circle cx="12" cy="11" r="9" />
          <circle cx="9" cy="10" r="1.2" fill="#FFD21E" stroke="none" />
          <circle cx="15" cy="10" r="1.2" fill="#FFD21E" stroke="none" />
          <path d="M8.5 14.5 Q12 17.5 15.5 14.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'Web',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--accent)' }}>
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
      ),
    },
  ]

  return (
    <div ref={containerRef} className="relative w-full flex flex-col items-center" style={{ minHeight: 320 }}>
      <p className="relative z-10 text-[9px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--text-muted)' }}>
        You Ask
      </p>
      <BeamNode ref={userRef} size="md">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-primary)' }}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </BeamNode>

      <div className="h-10" />

      <p className="relative z-10 text-[9px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--text-muted)' }}>
        Gemini Processes
      </p>
      <BeamNode ref={claudeRef} size="lg"
        style={{
          background: 'var(--bg-card)',
          borderColor: '#4285F4',
          borderWidth: 2,
          boxShadow: '0 0 0 4px rgba(66,133,244,0.12), 0 2px 16px rgba(66,133,244,0.15)',
        }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 4 C14 4 14.5 9.5 18 14 C14.5 18.5 14 24 14 24 C14 24 13.5 18.5 10 14 C13.5 9.5 14 4 14 4Z" fill="url(#gem-grad-v2)" />
          <path d="M4 14 C4 14 9.5 13.5 14 10 C18.5 13.5 24 14 24 14 C24 14 18.5 14.5 14 18 C9.5 14.5 4 14 4 14Z" fill="url(#gem-grad-h2)" />
          <defs>
            <linearGradient id="gem-grad-v2" x1="14" y1="4" x2="14" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4285F4"/>
              <stop offset="50%" stopColor="#9C27B0"/>
              <stop offset="100%" stopColor="#EA4335"/>
            </linearGradient>
            <linearGradient id="gem-grad-h2" x1="4" y1="14" x2="24" y2="14" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34A853"/>
              <stop offset="50%" stopColor="#FBBC05"/>
              <stop offset="100%" stopColor="#EA4335"/>
            </linearGradient>
          </defs>
        </svg>
      </BeamNode>

      <div className="h-10" />

      <p className="relative z-10 text-[9px] font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--text-muted)' }}>
        Checks Everywhere
      </p>
      <div className="relative z-10 flex items-center gap-3">
        {platforms.map((p, i) => (
          <div key={p.label} className="flex flex-col items-center gap-1.5">
            <BeamNode ref={platformRefs[i]} size="sm">{p.icon}</BeamNode>
            <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{p.label}</span>
          </div>
        ))}
      </div>

      <TravelingBeam containerRef={containerRef} fromRef={userRef} toRef={claudeRef} duration={2.2} delay={0} color="#4285F4" />
      {platformRefs.map((ref, i) => (
        <TravelingBeam key={i} containerRef={containerRef} fromRef={claudeRef} toRef={ref}
          duration={2.0} delay={delays[i]} curvature={curvatures[i]} color="#4285F4" />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Collapsible suggested prompts
// ─────────────────────────────────────────────────────────────────────────────

function SuggestedPrompts({ onSelect }: { onSelect: (p: string) => void }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="flex-shrink-0 border-t" style={{ borderColor: 'var(--border)' }}>
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full px-4 py-2.5 transition-opacity hover:opacity-70">
        <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: 'var(--text-muted)' }}>
          Ask me anything
        </p>
        <motion.div animate={{ rotate: open ? 0 : 180 }} transition={{ duration: 0.2 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--text-muted)' }}>
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}>
            <div className="flex flex-wrap gap-1.5 px-4 pb-3">
              {SUGGESTED_PROMPTS.map(prompt => (
                <button key={prompt} onClick={() => onSelect(prompt)}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all hover:opacity-80"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main KnowMoreGrid
// ─────────────────────────────────────────────────────────────────────────────

export function KnowMoreGrid({ isMobile }: KnowMoreGridProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [activePlatform, setActivePlatform] = useState<SearchPlatform>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const cls = isMobile
    ? 'w-full rounded-2xl border overflow-hidden flex flex-col'
    : 'grid-card-desktop flex-shrink-0 w-[520px] h-[calc(100vh-88px)] rounded-2xl border overflow-hidden flex flex-col'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return
      setInput('')
      const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: trimmed }
      const assistantMsgId = `a-${Date.now()}`
      const assistantMsg: Message = { id: assistantMsgId, role: 'assistant', content: '', streaming: true }
      setMessages(prev => [...prev, userMsg, assistantMsg])
      setIsLoading(true)
      setIsSearching(false)
      setActivePlatform(null)
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
      try {
        abortRef.current = new AbortController()
        const res = await fetch('/api/know-more', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
          signal: abortRef.current.signal,
        })
        if (!res.ok || !res.body) throw new Error(`API error ${res.status}`)
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let accumulated = ''
        let didSearch = false
        let searchPlatform: SearchPlatform = null
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            // Platform-tagged search: [SEARCHING:github], [SEARCHING:kaggle], etc.
            const searchMatch = data.match(/^\[SEARCHING:(\w+)\]$/)
            if (searchMatch) {
              didSearch = true
              searchPlatform = searchMatch[1] as SearchPlatform
              setIsSearching(true)
              setActivePlatform(searchPlatform)
              setMessages(prev => prev.map(m =>
                m.id === assistantMsgId
                  ? { ...m, searched: true, searchPlatform }
                  : m
              ))
              continue
            }
            // Legacy fallback (no platform tag)
            if (data === '[SEARCHING]') {
              didSearch = true
              searchPlatform = 'web'
              setIsSearching(true)
              setActivePlatform('web')
              setMessages(prev => prev.map(m =>
                m.id === assistantMsgId
                  ? { ...m, searched: true, searchPlatform: 'web' }
                  : m
              ))
              continue
            }
            if (data === '[SEARCH_DONE]') { setIsSearching(false); continue }
            try {
              const parsed = JSON.parse(data)
              if (parsed.delta) {
                accumulated += parsed.delta
                setMessages(prev => prev.map(m =>
                  m.id === assistantMsgId
                    ? { ...m, content: accumulated, streaming: true, searched: didSearch, searchPlatform }
                    : m
                ))
              }
            } catch { /* ignore */ }
          }
        }
        setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, streaming: false } : m))
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        setMessages(prev => prev.map(m =>
          m.id === assistantMsgId ? { ...m, content: "Sorry, I hit an error. Try again in a moment.", streaming: false } : m
        ))
      } finally {
        setIsLoading(false)
        setIsSearching(false)
        setActivePlatform(null)
        abortRef.current = null
      }
    },
    [isLoading, messages]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  const resetChat = () => {
    abortRef.current?.abort()
    setMessages([]); setInput(''); setIsLoading(false); setIsSearching(false); setActivePlatform(null)
  }

  const hasMessages = messages.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.28 }}
      className={cls}
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-4 border-b flex-shrink-0 flex items-center justify-between"
        style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <span className="grid-label">Know More</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: 'rgba(66,133,244,0.12)' }}>
            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: '#4285F4' }}
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
            <span className="text-[10px] font-medium" style={{ color: '#4285F4' }}>Agentic</span>
          </div>
        </div>
        {hasMessages && (
          <button onClick={resetChat} className="btn-capsule-icon" aria-label="Clear chat">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Chat area ── */}
      <div className="flex-1 no-scrollbar relative" data-grid-scroll
        style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}>

        {/* ── EMPTY STATE background: interactive grid ── */}
        {!hasMessages && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <InteractiveGridPattern width={32} height={32} squares={[20, 18]}
              className="[mask-image:radial-gradient(360px_circle_at_50%_40%,white,transparent)]" />
          </div>
        )}

        {/* ── CHAT STATE background: colour-grade gradient ── */}
        {hasMessages && <ChatBackground />}

        {/* ── Empty state content ── */}
        {!hasMessages && (
          <div className="relative z-10 px-5 pt-5 pb-4">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-[14px] font-bold"
                style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>H</div>
              <div>
                <p className="text-[13px] font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Ask me anything about Harish
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  I&apos;m an AI assistant with deep context about Sri Harish — his projects, research, skills, and career.
                  I can crawl his <strong style={{ color: 'var(--text-primary)' }}>GitHub</strong> repos live,{' '}
                  search his <strong style={{ color: '#20BEFF' }}>Kaggle</strong> &amp;{' '}
                  <strong style={{ color: '#FFD21E' }}>HuggingFace</strong> profiles,{' '}
                  and his <strong style={{ color: '#0A66C2' }}>LinkedIn</strong> in real time.
                </p>
              </div>
            </div>
            <VerticalAnimatedBeam />
          </div>
        )}

        {/* ── Messages ── */}
        {hasMessages && (
          <div className="relative z-10 px-4 pt-5 pb-2 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <div key={msg.id}>
                  {msg.role === 'assistant' && msg.streaming && msg.content === '' && isSearching && <SearchIndicator platform={activePlatform} />}
                  <MessageBubble message={msg} />
                </div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Collapsible suggested prompts ── */}
      <SuggestedPrompts onSelect={p => sendMessage(p)} />

      {/* ── Input ── */}
      <div className="flex-shrink-0 px-4 py-3.5" style={{ background: 'var(--bg-card)' }}>
        <div className="flex items-center gap-2 rounded-2xl px-3.5 py-2.5"
          style={{ background: 'var(--bg-elevated)', border: '1.5px solid var(--border)' }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Harish…"
            disabled={isLoading}
            className="flex-1 bg-transparent text-[13px] outline-none placeholder:opacity-40 disabled:opacity-50"
            style={{ color: 'var(--text-primary)' }}
          />
          {isLoading ? (
            <button onClick={() => abortRef.current?.abort()}
              className="flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center hover:opacity-70"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} aria-label="Stop">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--text-secondary)' }}>
                <rect x="4" y="4" width="16" height="16" rx="2" />
              </svg>
            </button>
          ) : (
            <button onClick={() => sendMessage(input)} disabled={!input.trim()}
              className="flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
              style={{ background: input.trim() ? 'var(--accent)' : 'var(--bg-card)', border: '1px solid var(--border)' }}
              aria-label="Send">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke={input.trim() ? '#000' : 'var(--text-secondary)'} strokeWidth="2.5">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-[10px] text-center mt-2" style={{ color: 'var(--text-muted)' }}>
          Gemini-powered · crawls GitHub live · searches Kaggle, HuggingFace &amp; LinkedIn
        </p>
      </div>
    </motion.div>
  )
}