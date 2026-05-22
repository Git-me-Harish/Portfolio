'use client'

/**
 * AchievementsGrid — v3
 * ─────────────────────
 * Fixes from v2:
 *  1. GridBottomSheet moved OUTSIDE the scrollable div (was getting clipped)
 *  2. CertCarousel rewritten — clean framer-motion slide, no stale-closure
 *     issues, proper single-visible-tile with back/forth infinite loop
 *  3. Carousel auto-advance uses useRef for current index to avoid stale closure
 *  4. 'tall' prop removed from BentoTile (was declared but never consumed)
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { GridBottomSheet } from '../grid-bottom-sheet'

// ── Types ──────────────────────────────────────────────────────────────────────

type AchievementCategory = 'award' | 'certification' | 'publication' | 'milestone'

interface Achievement {
  id: string
  title: string
  issuer: string
  date: string
  category: AchievementCategory
  accentColor: string
  description: string
  impact: string
  tags: string[]
  credentialUrl?: string
}

// ── SVG Icons — bare, no box wrapper ─────────────────────────────────────────

const TrophyIcon = ({ color }: { color: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M14 18c-4 0-7-3.134-7-7V5h14v6c0 3.866-3 7-7 7z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill={color} fillOpacity="0.08" />
    <path d="M7 8H4a1 1 0 0 0-1 1v1.5C3 12.433 4.567 14 6.5 14H7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M21 8h3a1 1 0 0 1 1 1v1.5C25 12.433 23.433 14 21.5 14H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 18v4M10 22h8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="14" cy="10" r="2" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1" />
  </svg>
)

const PaperIcon = ({ color }: { color: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect x="5" y="3" width="13" height="18" rx="2" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.06" />
    <rect x="9" y="3" width="9" height="17" rx="2" fill={color} fillOpacity="0.05" />
    <path d="M9 9h8M9 12h8M9 15h5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="20" cy="21" r="4" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.4" />
    <path d="M20 19v2.5l1.5 1" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ShieldIcon = ({ color }: { color: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M14 3L5 7v7c0 5 3.9 9.7 9 10.9C19.1 23.7 23 19 23 14V7L14 3z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill={color} fillOpacity="0.08" />
    <path d="M10 14l2.5 2.5L18 11" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const BoltIcon = ({ color }: { color: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M16 3L7 16h8l-3 9 10-13h-8l3-9z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill={color} fillOpacity="0.1" />
  </svg>
)

const CloudIcon = ({ color }: { color: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M8 19a5 5 0 0 1 0-10 5.5 5.5 0 0 1 10.9-1A4 4 0 1 1 20 19H8z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill={color} fillOpacity="0.08" />
    <path d="M11 22l3 3 3-3M14 19v5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const MedalIcon = ({ color }: { color: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="14" cy="17" r="7" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.08" />
    <path d="M10 4l4 5 4-5M10 4H7l3.5 4.5M18 4h3l-3.5 4.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 13v2.5l2 1.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ICON_MAP: Record<string, React.FC<{ color: string }>> = {
  '1': TrophyIcon,
  '2': ShieldIcon,
  '3': PaperIcon,
  '4': BoltIcon,
  '5': CloudIcon,
  '6': MedalIcon,
}

// ── Data ───────────────────────────────────────────────────────────────────────

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'Best AI Innovation Award',
    issuer: 'National Tech Symposium',
    date: 'Dec 2024',
    category: 'award',
    accentColor: '#f7b731',
    description:
      'Awarded for designing and deploying an end-to-end autonomous ML pipeline that ingests raw sensor data, performs real-time feature engineering, and self-heals on drift detection — eliminating 80% of manual intervention across a production fleet.',
    impact: 'System serving 3M+ daily predictions with zero-downtime retraining cycles.',
    tags: ['MLOps', 'AutoML', 'Airflow', 'Python'],
    credentialUrl: '#',
  },
  {
    id: '2',
    title: 'AWS ML Specialty',
    issuer: 'Amazon Web Services',
    date: 'Sep 2024',
    category: 'certification',
    accentColor: '#ff9900',
    description:
      'Passed the AWS Certified Machine Learning – Specialty exam covering data engineering, EDA, modeling, and ML implementation & operations on AWS.',
    impact: 'Architected SageMaker pipeline cutting model iteration time from 3 days to 4 hours.',
    tags: ['SageMaker', 'AWS', 'MLOps'],
    credentialUrl: '#',
  },
  {
    id: '3',
    title: 'Efficient NLP Inference — IEEE',
    issuer: 'IEEE Transactions on Neural Networks',
    date: 'Jun 2024',
    category: 'publication',
    accentColor: '#4ecdc4',
    description:
      'Co-authored paper on post-training quantization for transformers. Hybrid INT4/FP16 scheme preserves attention head precision while aggressively quantizing FFN layers.',
    impact: '3.2x inference speedup on A100. <0.8% accuracy drop on GLUE. 47+ citations in 6 months.',
    tags: ['NLP', 'Quantization', 'PyTorch', 'Transformers'],
    credentialUrl: '#',
  },
  {
    id: '4',
    title: 'Smart India Hackathon',
    issuer: 'Government of India — Runner Up',
    date: 'Mar 2024',
    category: 'award',
    accentColor: '#00cc88',
    description:
      'Built an offline-capable crop disease detection app with MobileNetV3 + ONNX Runtime. Federated learning pipeline for continuous improvement without data centralisation.',
    impact: 'Pilot in 2 states. 10K+ scans/day. Model <8MB, sub-100ms inference on mid-range phones.',
    tags: ['Edge AI', 'MobileNet', 'ONNX', 'Federated Learning'],
  },
  {
    id: '5',
    title: 'GCP Professional Data Engineer',
    issuer: 'Google Cloud',
    date: 'Jan 2024',
    category: 'certification',
    accentColor: '#4285f4',
    description:
      'Certified in BigQuery, Dataflow, Pub/Sub, Dataproc, and Cloud Composer — covering pipeline design, streaming/batch trade-offs, governance.',
    impact: 'Migrated legacy Hadoop ETL to Dataproc + Airflow on GCP, reducing infra cost by 60%.',
    tags: ['BigQuery', 'Dataflow', 'GCP', 'Airflow'],
    credentialUrl: '#',
  },
  {
    id: '6',
    title: 'IIT Madras DataHack — 1st',
    issuer: 'IIT Madras',
    date: 'Oct 2023',
    category: 'award',
    accentColor: '#a55eea',
    description:
      'Led a 3-person team to build a gradient-boosted fraud detection model with graph embedding features using XGBoost + Node2Vec.',
    impact: 'Ranked #1 of 400+ teams. Precision@0.01 recall: 0.91 vs baseline of 0.73.',
    tags: ['XGBoost', 'Graph ML', 'Node2Vec'],
  },
]

// Certificate images — place PNGs at public/certificates/cert-{1..N}.png
const CERT_COUNT = 10
const CERT_IMAGES = Array.from({ length: CERT_COUNT }, (_, i) => `/certificates/cert-${i + 1}.png`)

// ── BentoTile ─────────────────────────────────────────────────────────────────

interface BentoTileProps {
  item: Achievement
  hero?: boolean
  onClick: () => void
  delay: number
}

function BentoTile({ item, hero, onClick, delay }: BentoTileProps) {
  const Icon = ICON_MAP[item.id] ?? TrophyIcon

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      onClick={onClick}
      className="group text-left w-full h-full relative overflow-hidden"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: hero ? '16px 18px 40px' : '14px 14px 36px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.15s, background 0.15s',
        cursor: 'pointer',
        minHeight: hero ? 108 : 90,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = item.accentColor + '55'
        el.style.background = 'var(--bg-hover)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--border)'
        el.style.background = 'var(--bg-elevated)'
      }}
      aria-label={`View ${item.title}`}
    >
      {/* Corner glow */}
      <div
        className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 100% 0%, ${item.accentColor}18 0%, transparent 70%)`,
        }}
      />

      {/* Icon */}
      <div className="mb-2 flex-shrink-0">
        <Icon color={item.accentColor} />
      </div>

      {/* Title */}
      <p
        className="text-[12px] font-semibold leading-snug mb-1 group-hover:opacity-85 transition-opacity"
        style={{ color: 'var(--text-primary)' }}
      >
        {item.title}
      </p>

      {/* Issuer */}
      <p className="text-[10.5px] leading-tight" style={{ color: 'var(--text-secondary)' }}>
        {item.issuer}
      </p>

      {/* Hero tags */}
      {hero && (
        <div className="flex flex-wrap gap-1 mt-2.5">
          {item.tags.slice(0, 3).map(t => (
            <span
              key={t}
              className="px-1.5 py-0.5 rounded text-[9.5px] font-medium"
              style={{ background: `${item.accentColor}15`, color: item.accentColor }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Date — absolute bottom-right */}
      <span
        className="absolute bottom-2.5 right-3 text-[9.5px]"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        {item.date}
      </span>
    </motion.button>
  )
}

// ── CertCarousel ──────────────────────────────────────────────────────────────
// One cert fully visible at a time. Framer-motion AnimatePresence handles
// enter/exit. Auto-advances 3.5s. Pauses on hover. No stale closures.

const SLIDE_TRANSITION = { duration: 0.38, ease: [0.32, 0, 0.67, 0] as [number, number, number, number] }

function CertCarousel() {
  const [current, setCurrent] = useState(0)
  const [dir, setDir]         = useState<1 | -1>(1)
  const autoRef               = useRef<ReturnType<typeof setInterval> | null>(null)
  const total                 = CERT_IMAGES.length

  const navigate = useCallback((direction: 1 | -1) => {
    setDir(direction)
    setCurrent(c => (c + direction + total) % total)
  }, [total])

  const stopAuto = useCallback(() => {
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null }
  }, [])

  const startAuto = useCallback(() => {
    stopAuto()
    autoRef.current = setInterval(() => navigate(1), 3500)
  }, [navigate, stopAuto])

  useEffect(() => { startAuto(); return stopAuto }, [startAuto, stopAuto])

  return (
    <div className="w-full">
      {/* Label + counter */}
      <div className="px-5 pt-1 pb-3 flex items-center justify-between">
        <span className="grid-label">Certifications</span>
        <span className="text-[10px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {current + 1} / {total}
        </span>
      </div>

      {/* Viewport */}
      <div
        className="relative mx-4 rounded-2xl overflow-hidden"
        style={{ height: 200, border: '1px solid var(--border)', background: 'var(--bg-elevated)' }}
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
      >
        <AnimatePresence initial={false} custom={dir} mode="sync">
          <motion.div
            key={current}
            custom={dir}
            initial={{ x: dir === 1 ? '100%' : '-100%', opacity: 0 }}
            animate={{ x: '0%', opacity: 1 }}
            exit={{ x: dir === 1 ? '-100%' : '100%', opacity: 0 }}
            transition={SLIDE_TRANSITION}
            className="absolute inset-0"
          >
            {/* Fallback placeholder — visible while image loads */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 9h6M9 12h6M9 15h4" />
              </svg>
              <span style={{ fontSize: 10 }}>cert-{current + 1}.png</span>
            </div>

            {/* Actual certificate image */}
            <Image
              src={CERT_IMAGES[current]}
              alt={`Certificate ${current + 1}`}
              fill
              className="object-contain"
              style={{ padding: '16px 20px' }}
              sizes="(max-width: 768px) 100vw, 440px"
              priority={current === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Prev */}
        <button
          onClick={() => { stopAuto(); navigate(-1); startAuto() }}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full flex items-center justify-center opacity-40 hover:opacity-90 transition-opacity"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          aria-label="Previous certificate"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Next */}
        <button
          onClick={() => { stopAuto(); navigate(1); startAuto() }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full flex items-center justify-center opacity-40 hover:opacity-90 transition-opacity"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          aria-label="Next certificate"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Pill dots */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {CERT_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setDir(idx > current ? 1 : -1); setCurrent(idx); stopAuto(); startAuto() }}
              className="rounded-full transition-all duration-200"
              style={{
                width: idx === current ? 18 : 5,
                height: 5,
                background: idx === current ? 'var(--accent)' : 'var(--border-hover)',
              }}
              aria-label={`Go to certificate ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="h-4" />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface AchievementsGridProps {
  isMobile?: boolean
}

export function AchievementsGrid({ isMobile }: AchievementsGridProps) {
  const [selected, setSelected] = useState<Achievement | null>(null)

  const cls = isMobile
    ? 'w-full rounded-2xl border overflow-hidden flex flex-col'
    : 'grid-card-desktop flex-shrink-0 w-[480px] h-[calc(100vh-88px)] rounded-2xl border overflow-hidden flex flex-col'

  const currentIndex = selected ? achievements.findIndex(a => a.id === selected.id) : -1

  return (
    // position:relative required — GridBottomSheet (absolute) is a sibling of
    // the scroll container, so it positions against THIS element, not the window.
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.20 }}
      className={cls}
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', position: 'relative' }}
    >
      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
        <span className="grid-label">Achievements</span>
      </div>

      {/* ── Scrollable body ── */}
      <div
        className="flex-1 no-scrollbar"
        data-grid-scroll
        style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
      >
        {/* ─── BENTO GRID ─────────────────────────────────────────────────── */}
        <div className="p-3.5 pb-2">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gridTemplateRows: 'minmax(108px, auto) minmax(90px, auto)',
              gap: 7,
            }}
          >
            {/* Hero — cols 1-2, row 1 */}
            <div style={{ gridColumn: '1 / 3', gridRow: '1 / 2' }}>
              <BentoTile item={achievements[0]} hero onClick={() => setSelected(achievements[0])} delay={0.04} />
            </div>

            {/* Tall right — col 3, rows 1-2 */}
            <div style={{ gridColumn: '3 / 4', gridRow: '1 / 3' }}>
              <BentoTile item={achievements[2]} onClick={() => setSelected(achievements[2])} delay={0.08} />
            </div>

            {/* Small A — col 1, row 2 */}
            <div style={{ gridColumn: '1 / 2', gridRow: '2 / 3' }}>
              <BentoTile item={achievements[1]} onClick={() => setSelected(achievements[1])} delay={0.11} />
            </div>

            {/* Small B — col 2, row 2 */}
            <div style={{ gridColumn: '2 / 3', gridRow: '2 / 3' }}>
              <BentoTile item={achievements[3]} onClick={() => setSelected(achievements[3])} delay={0.14} />
            </div>
          </div>

          {/* Overflow achievements — compact list */}
          {achievements.length > 4 && (
            <div className="mt-2.5 space-y-1.5">
              {achievements.slice(4).map((item, idx) => {
                const Icon = ICON_MAP[item.id] ?? TrophyIcon
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, delay: 0.18 + idx * 0.05 }}
                    onClick={() => setSelected(item)}
                    className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{
                      border: '1px solid var(--border)',
                      background: 'var(--bg-elevated)',
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = item.accentColor + '44'
                      el.style.background = 'var(--bg-hover)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = 'var(--border)'
                      el.style.background = 'var(--bg-elevated)'
                    }}
                  >
                    <Icon color={item.accentColor} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {item.title}
                      </p>
                      <p className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
                        {item.issuer}
                      </p>
                    </div>
                    <span
                      className="text-[10px] flex-shrink-0"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                    >
                      {item.date}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mx-4 my-3 border-t" style={{ borderColor: 'var(--border)' }} />

        {/* ─── CERTIFICATE CAROUSEL ────────────────────────────────────────── */}
        <CertCarousel />
      </div>

      {/* ── GridBottomSheet — sibling of scroll div, not inside it ── */}
      {/* This is the critical fix: absolute positioning escapes overflow:auto  */}
      <GridBottomSheet
        open={!!selected}
        onClose={() => setSelected(null)}
        accentColor={selected?.accentColor ?? 'var(--border-hover)'}
      >
        {selected && (
          <>
            <div
              className="flex-1 no-scrollbar px-5 pb-4"
              data-grid-scroll
              style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
            >
              {/* Icon + category */}
              <div className="mb-4 flex items-center gap-2.5">
                {(() => { const Icon = ICON_MAP[selected.id] ?? TrophyIcon; return <Icon color={selected.accentColor} /> })()}
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: selected.accentColor }}>
                  {selected.category}
                </span>
              </div>

              <h2 className="text-[20px] font-semibold leading-tight mb-1.5" style={{ color: 'var(--text-primary)' }}>
                {selected.title}
              </h2>
              <p className="text-[12px] mb-0.5 font-medium" style={{ color: selected.accentColor }}>
                {selected.issuer}
              </p>
              <p className="text-[11.5px] mb-6" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {selected.date}
              </p>
              <p className="text-[13px] leading-relaxed mb-7" style={{ color: 'var(--text-secondary)' }}>
                {selected.description}
              </p>

              {/* Impact */}
              <div className="border-t pt-5 mb-7" style={{ borderColor: 'var(--border)' }}>
                <span className="grid-label block mb-3">Impact</span>
                <div
                  className="rounded-xl p-4"
                  style={{ background: `${selected.accentColor}0d`, border: `1px solid ${selected.accentColor}28` }}
                >
                  <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    {selected.impact}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="border-t pt-5" style={{ borderColor: 'var(--border)' }}>
                <span className="grid-label block mb-3">Stack / Domain</span>
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map(t => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium"
                      style={{ background: `${selected.accentColor}18`, color: selected.accentColor }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Credential link */}
              {selected.credentialUrl && (
                <div className="border-t pt-5 mt-6" style={{ borderColor: 'var(--border)' }}>
                  <a
                    href={selected.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-capsule inline-flex gap-1.5"
                    style={{ background: selected.accentColor, borderColor: selected.accentColor, color: '#000', fontWeight: 700 }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    View Credential
                  </a>
                </div>
              )}
            </div>

            {/* Capsule nav */}
            <div
              className="flex-shrink-0 px-5 py-4 border-t flex items-center justify-center"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => currentIndex > 0 && setSelected(achievements[currentIndex - 1])}
                  disabled={currentIndex === 0}
                  className="btn-capsule-icon"
                  aria-label="Previous"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button onClick={() => setSelected(null)} className="btn-capsule">Close</button>
                <button
                  onClick={() => currentIndex < achievements.length - 1 && setSelected(achievements[currentIndex + 1])}
                  disabled={currentIndex === achievements.length - 1}
                  className="btn-capsule-icon"
                  aria-label="Next"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </GridBottomSheet>
    </motion.div>
  )
}