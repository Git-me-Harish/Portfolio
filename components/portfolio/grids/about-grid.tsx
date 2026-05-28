'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface AboutGridProps { isMobile?: boolean }

const metaRows = [
  { label: 'Role', value: 'AI/ML Engineer & Data Scientist. I own everything from model to deployment.' },
  { label: 'Focus', value: 'Deep learning, NLP, and scalable data pipelines — but I also build full-stack products.' },
  { label: 'Stack', value: 'Python, PyTorch, TensorFlow, Next.js, TypeScript, Spark, Airflow, and more.' },
  { label: 'Experience', value: '4+ years building and shipping ML systems for production at scale.' },
  { label: 'Research', value: 'Published work in NLP and computer vision. Open-source contributor.' },
  { label: 'Superpower', value: 'I can zoom out for the architecture and zoom in to tune the details.' },
  { label: 'Location', value: 'Your City' },
  { label: 'Age', value: '' }, // rendered dynamically
]

const slideVariant = {
  enter: { x: '100%', opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
}

// Precise Age Counter : Calculates exact age in years with decimal precision, updating every 50ms
const DOB = new Date(2002, 0, 15, 0, 0, 0)

function usePreciseAge() {
  const [age, setAge] = useState('')
  useEffect(() => {
    const tick = () => {
      const now = Date.now()
      const diffMs = now - DOB.getTime()
      const msPerYear = 365.25 * 24 * 60 * 60 * 1000
      const years = diffMs / msPerYear
      setAge(years.toFixed(10))
    }
    tick()
    const id = setInterval(tick, 50)
    return () => clearInterval(id)
  }, [])
  return age
}

// Animated Highlighter:
interface Highlight {
  text: string
  color?: string
}

function HighlightedText({
  children,
  highlights,
}: {
  children: string
  highlights: Highlight[]
}) {
  // Build segments: split string into plain + highlighted parts
  type Segment = { text: string; highlight?: Highlight }
  const segments: Segment[] = []

  let remaining = children
  const sorted = [...highlights].sort(
    (a, b) => remaining.indexOf(a.text) - remaining.indexOf(b.text)
  )

  sorted.forEach((h) => {
    const idx = remaining.indexOf(h.text)
    if (idx === -1) return
    if (idx > 0) segments.push({ text: remaining.slice(0, idx) })
    segments.push({ text: h.text, highlight: h })
    remaining = remaining.slice(idx + h.text.length)
  })
  if (remaining) segments.push({ text: remaining })

  return (
    <>
      {segments.map((seg, i) =>
        seg.highlight ? (
          <AnimatedHighlight key={i} color={seg.highlight.color}>
            {seg.text}
          </AnimatedHighlight>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </>
  )
}

function AnimatedHighlight({
  children,
  color = 'var(--accent)',
}: {
  children: string
  color?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <span ref={ref} className="relative inline-block">
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-[3px] -mx-0.5 px-0.5"
        style={{
          background: color,
          opacity: 0.25,
          transformOrigin: 'left center',
        }}
        initial={{ scaleX: 0 }}
        animate={visible ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} />
      <motion.span
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
        style={{ background: color, opacity: 0.7 }}
        initial={{ scaleX: 0 }}
        animate={visible ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.35 }} />
      <span className="relative z-10">{children}</span>
    </span>
  )
}

// Social Icons:
const socials = [
  {
    href: 'https://github.com/Git-me-Harish',
    label: 'GitHub',
    hoverBg: 'var(--bg-elevated)',
    hoverColor: '#ffffff',
    icon: (
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    ),
  },
  {
    href: 'https://www.linkedin.com/in/harishconnects/',
    label: 'LinkedIn',
    hoverBg: '#0A66C2',
    hoverColor: '#ffffff',
    icon: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
  },
  {
    href: 'https://leetcode.com/', // ← update with your LeetCode username
    label: 'LeetCode',
    hoverBg: '#FFA116',
    hoverColor: '#000000',
    // LeetCode logo path
    icon: (
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    ),
  },
  {
    href: 'https://www.kaggle.com/', // ← update with your Kaggle username
    label: 'Kaggle',
    hoverBg: '#20BEFF',
    hoverColor: '#ffffff',
    // Kaggle "K" mark
    icon: (
      <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.334z" />
    ),
  },
  {
    href: 'https://huggingface.co/', // ← update with your HuggingFace profile
    label: 'HuggingFace',
    hoverBg: '#FFD21E',
    hoverColor: '#000000',
    icon: (
      <>
        <circle cx="12" cy="11" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="9" cy="10" r="1.2" />
        <circle cx="15" cy="10" r="1.2" />
        <path d="M8.5 14.5 Q12 17.5 15.5 14.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        {/* ears */}
        <path d="M3.5 8.5 Q2 11 3.5 13.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20.5 8.5 Q22 11 20.5 13.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    svgFill: false,
  },
]

function SocialButton({
  href,
  label,
  icon,
  hoverBg,
  hoverColor,
  svgFill = true,
}: {
  href: string
  label: string
  icon: React.ReactNode
  hoverBg: string
  hoverColor: string
  svgFill?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="btn-capsule-icon relative transition-all duration-200"
      style={{
        background: hovered ? hoverBg : undefined,
        color: hovered ? hoverColor : undefined,
        borderColor: hovered ? hoverBg : undefined,
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
      }}
      title={label}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={svgFill ? 'currentColor' : 'none'}
        stroke={svgFill ? undefined : 'currentColor'}
        strokeWidth={svgFill ? undefined : 1.8}
      >
        {icon}
      </svg>
    </a>
  )
}

// Main Component: AboutGrid:
export function AboutGrid({ isMobile }: AboutGridProps) {
  const [view, setView] = useState<'main' | 'detail'>('main')
  const [emailCopied, setEmailCopied] = useState(false)
  const preciseAge = usePreciseAge()

  const copyEmail = () => {
    navigator.clipboard.writeText('sriharishbiology@gmail.com')
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  // Inject live age into metaRows
  const resolvedMetaRows = metaRows.map((row) =>
    row.label === 'Age' ? { ...row, value: `${preciseAge} years old` } : row
  )
  const bioHighlights: Highlight[] = [
    { text: 'deep learning, NLP', color: '#036DA4' },
    { text: 'production ML pipelines', color: '#5EA3C0' },
    { text: 'full-stack engineering', color: '#024e78' },
  ]
  const cls = isMobile
    ? 'w-full rounded-2xl border overflow-hidden flex flex-col'
    : 'grid-card-desktop flex-shrink-0 w-[clamp(360px,28vw,500px)] h-[calc(100vh-88px)] rounded-2xl border overflow-hidden flex flex-col'

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.04 }}
      className={cls}
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <div className="px-5 pt-5 pb-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
        <span className="grid-label">About Me</span>
      </div>
      <div className="flex-1 relative" style={{ overflow: 'clip' }}>
        <AnimatePresence mode="wait" initial={false}>
          {view === 'main' ? (
            <motion.div
              key="main"
              variants={slideVariant}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.32, 0, 0.67, 0] }}
              className="absolute inset-0 no-scrollbar"
              data-grid-scroll
              style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
            >
              <div className="p-5">
                <div
                  className="w-full rounded-xl overflow-hidden mb-5 relative border"
                  style={{ height: 220, borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
                  <Image src="/photo.jpg" alt="Sri Harish" fill className="object-cover" priority />
                  <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="dp" width="4" height="4" patternUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="2" height="2" fill="var(--accent)" />
                        <rect x="2" y="2" width="2" height="2" fill="var(--accent)" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dp)" />
                  </svg>
                  <motion.div
                    className="absolute inset-0"
                    style={{ backgroundImage: 'linear-gradient(to bottom, transparent 40%, rgba(3,109,164,0.06) 50%, transparent 60%)' }}
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} />
                </div>
                <h2 className="text-[16px] font-semibold leading-snug mb-3" style={{ color: 'var(--text-primary)' }}>
                  {"Hey, I'm [Sri Harish]. I build intelligent systems and extract insights from data."}
                </h2>
                <p className="text-[13px] leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
                  <HighlightedText highlights={bioHighlights}>
                    {"AI/ML Engineer and Data Scientist focused on deep learning, NLP, and production ML pipelines. Currently building at the intersection of AI and full-stack engineering."}
                  </HighlightedText>
                </p>
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                  {socials.map(({ href, label, icon, hoverBg, hoverColor, svgFill }) => (
                    <SocialButton
                      key={label}
                      href={href}
                      label={label}
                      icon={icon}
                      hoverBg={hoverBg}
                      hoverColor={hoverColor}
                      svgFill={svgFill ?? true}
                    />
                  ))}
                  <button onClick={copyEmail} className="btn-capsule gap-1.5">
                    {emailCopied ? (
                      <>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy email
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-0">
                  {resolvedMetaRows.slice(0, 3).map(({ label, value }) => (
                    <div key={label} className="border-t py-3.5" style={{ borderColor: 'var(--border)' }}>
                      <span className="grid-label block mb-1">{label}</span>
                      <p className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
                    </div>
                  ))}
                  <button
                    onClick={() => setView('detail')}
                    className="w-full border-t py-3.5 text-left group"
                    style={{ borderColor: 'var(--border)' }}>
                    <span className="grid-label block mb-1" style={{ color: 'var(--accent)' }}>More info</span>
                    <p className="text-[13px] flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                      Experience, teaching, superpower, location
                      <svg className="group-hover:translate-x-1 transition-transform" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </p>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              variants={slideVariant}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.32, 0, 0.67, 0] }}
              className="absolute inset-0 flex flex-col">
              <div
                className="flex-1 no-scrollbar p-5"
                data-grid-scroll
                style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}>
                <div className="space-y-0">
                  {resolvedMetaRows.map(({ label, value }) => (
                    <div key={label} className="border-t py-4" style={{ borderColor: 'var(--border)' }}>
                      <span className="grid-label block mb-1">{label}</span>
                      <p
                        className="text-[13px] font-medium"
                        style={{
                          color: 'var(--text-primary)',
                          fontFamily: label === 'Age' ? 'var(--font-mono)' : undefined,
                        }}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 px-5 py-4 border-t flex items-center justify-center" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <button disabled className="btn-capsule-icon" aria-label="Previous">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button onClick={() => setView('main')} className="btn-capsule">Close</button>
                  <button disabled className="btn-capsule-icon" aria-label="Next">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}