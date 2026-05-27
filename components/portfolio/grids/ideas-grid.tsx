'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GridBottomSheet } from '../grid-bottom-sheet'
import emailjs from '@emailjs/browser'

// EmailJS config:
const EMAILJS_SERVICE_ID  = 'service_2zdm5wh'
const EMAILJS_TEMPLATE_ID = 'template_8kb81vf' 
const EMAILJS_PUBLIC_KEY  = 'QowKEERwmPMyZvWQD'   
interface Idea {
  id: string
  title: string
  description: string
  caption: string
  accentColor: string
  bgColor: string
  tags: string[]
  stage: 'concept' | 'prototype' | 'building'
  longDescription: string
  problems: string[]
  gif: string
}

const ideas: Idea[] = [
  {
    id: '1',
    title: 'LLM-powered Code Review',
    description: 'An intelligent code review assistant that understands context, tests, and team conventions.',
    caption: 'A bento-style developer tool that is infinitely customizable.',
    accentColor: 'var(--accent)',
    bgColor: 'var(--bg-elevated)',
    tags: ['LangChain', 'GitHub API', 'Next.js'],
    stage: 'prototype',
    longDescription: 'Most code review tools flag style issues and obvious bugs but miss deeper problems — incorrect business logic, subtle race conditions, violations of team conventions. This tool would ingest your codebase context and PR history to give review comments that actually reflect how your team thinks.',
    problems: [
      'Context window management for large diffs',
      'Team convention learning via fine-tuning',
      'Integration with GitHub, GitLab, and Bitbucket',
      'Explainability of each suggestion',
    ],
    gif: 'idea-1.gif',
  },
  {
    id: '2',
    title: 'ML Model Marketplace',
    description: 'A platform for researchers to monetize and share trained models with proper attribution.',
    caption: 'Widget customizer to change size, shape & configuration.',
    accentColor: '#5EA3C0',
    bgColor: 'var(--bg-elevated)',
    tags: ['HuggingFace', 'Stripe', 'Docker'],
    stage: 'concept',
    longDescription: 'Researchers spend months training models but monetization is an afterthought. This marketplace would let researchers list models with standardized benchmarks, versioning, and usage-based pricing — while buyers get reproducible environments and proper attribution.',
    problems: [
      'Standardized model packaging and versioning',
      'Usage metering and fair billing',
      'Model watermarking for attribution',
      'Community trust and review system',
    ],
    gif: 'idea-2.gif',
  },
  {
    id: '3',
    title: 'Real-time Feature Store',
    description: 'Zero-config streaming pipelines for ML feature engineering at scale.',
    caption: 'Visual pipeline builder with live data preview.',
    accentColor: '#5EA3C0',
    bgColor: 'var(--bg-elevated)',
    tags: ['Kafka', 'Redis', 'Python'],
    stage: 'building',
    longDescription: 'Feature stores exist but they are complex to operate. This would be a batteries-included feature store with automatic online/offline consistency, built-in drift detection, and a visual pipeline editor — deployable in one command on any cloud.',
    problems: [
      'Online/offline feature consistency guarantees',
      'Automatic backfill for new features',
      'Low-latency serving under 5ms p99',
      'Point-in-time correct training data generation',
    ],
    gif: 'idea-3.gif',
  },
  {
    id: '4',
    title: 'AI Ethics Auditor',
    description: 'Open-source toolkit for evaluating and mitigating bias in ML models.',
    caption: 'Automated audit reports with bias scoring.',
    accentColor: '#B9D9DC',
    bgColor: 'var(--bg-elevated)',
    tags: ['Python', 'Fairlearn', 'SHAP'],
    stage: 'concept',
    longDescription: 'A practical, opinionated toolkit that makes fairness auditing a first-class part of the ML development cycle. Generates structured audit reports across demographic slices, integrates with existing CI/CD pipelines, and suggests mitigation strategies with impact estimates.',
    problems: [
      'Defining the right fairness metrics per use case',
      'Automated demographic slice detection',
      'Mitigation without sacrificing accuracy',
      'Audit trail and regulatory reporting output',
    ],
    gif: 'idea-4.gif',
  },
]

const stageConfig = {
  concept: { label: 'Concept', color: '#888', bg: 'rgba(122,154,176,0.12)' },
  prototype: { label: 'Prototype', color: '#5EA3C0', bg: 'rgba(94,163,192,0.12)' },
  building: { label: 'Building', color: 'var(--accent)', bg: 'rgba(3,109,164,0.12)' },
}

// ─── Collaborate Form ─────────────────────────────────────────────────────────

type FormState = 'idle' | 'sending' | 'success' | 'error'

interface AttachedFile {
  name: string
  size: number
  base64: string
  type: string
}

function CollaborateForm() {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [ideaRef, setIdeaRef] = useState('')
  const [message, setMessage] = useState('')
  const [files,   setFiles]   = useState<AttachedFile[]>([])
  const [status,  setStatus]  = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const MAX_FILES = 3
  const MAX_MB    = 5

  const handleFiles = (picked: FileList | null) => {
    if (!picked) return
    const remaining = MAX_FILES - files.length
    const toAdd = Array.from(picked).slice(0, remaining)

    toAdd.forEach(file => {
      if (file.size > MAX_MB * 1024 * 1024) {
        setErrorMsg(`"${file.name}" exceeds ${MAX_MB}MB limit.`)
        return
      }
      const reader = new FileReader()
      reader.onload = e => {
        const base64 = (e.target?.result as string).split(',')[1]
        setFiles(prev => [...prev, { name: file.name, size: file.size, base64, type: file.type }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx))

  const fmtSize = (bytes: number) =>
    bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)}KB` : `${(bytes / (1024 * 1024)).toFixed(1)}MB`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return
    setStatus('sending')
    setErrorMsg('')

    try {
      const attachmentNames = files.map(f => f.name).join(', ') || 'None'

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:       name.trim(),
          from_email:      email.trim(),
          idea_title:      ideaRef.trim() || 'General inquiry',
          message:         message.trim(),
          attachment_name: attachmentNames,
        },
        EMAILJS_PUBLIC_KEY,
      )

      setStatus('success')
      setName(''); setEmail(''); setIdeaRef(''); setMessage(''); setFiles([])
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try emailing directly.')
    }
  }

  // ── Shared input style (CSS-var-aware for dark/light) ──
  const inputCls = [
    'w-full px-3 py-2 rounded-lg text-[12px] outline-none transition-all',
    'border focus:border-[var(--accent)]',
    'bg-[var(--collab-input-bg)] border-[var(--collab-input-border)]',
    'text-[var(--collab-input-text)] placeholder:text-[var(--collab-placeholder)]',
  ].join(' ')

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-2 p-5 rounded-xl border text-center"
        style={{ background: 'var(--bg-elevated)', borderColor: 'rgba(3,109,164,0.25)' }}
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ background: 'rgba(3,109,164,0.12)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-[13px] font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Message sent!</p>
        <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
          I&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-[11px] underline underline-offset-2"
          style={{ color: 'var(--accent)' }}
        >
          Send another
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="mt-2 rounded-xl overflow-hidden relative"
      style={{ border: '1px solid rgba(3,109,164,0.10)' }}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0" style={{ zIndex: 0 }} aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.35 }}>
          <defs>
            <pattern id="collab-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--accent)" strokeWidth="0.4" />
            </pattern>
            <radialGradient id="collab-fade" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="collab-mask">
              <rect width="100%" height="100%" fill="url(#collab-fade)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#collab-grid)" mask="url(#collab-mask)" />
        </svg>
        <motion.div
          animate={{ x: [0, 70, 0, -70, 0], y: [0, 30, 60, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '10%', left: '10%',
            width: 120, height: 120, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(3,109,164,0.15) 0%, transparent 70%)',
            filter: 'blur(14px)',
          }}
        />
        <motion.div
          animate={{ x: [0, -50, 0, 50, 0], y: [0, -40, 0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: '10%', right: '10%',
            width: 90, height: 90, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(3,109,164,0.10) 0%, transparent 70%)',
            filter: 'blur(10px)',
          }}
        />
        {/* Readability overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'var(--collab-bg)', opacity: 0.85 }} />
      </div>

      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: 'var(--collab-border)', position: 'relative', zIndex: 1 }}>
        <h4 className="text-[13px] font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
          Want to collaborate?
        </h4>
        <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Always open to discussing ideas and building interesting things together.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-3" style={{ position: 'relative', zIndex: 1 }}>
        {/* Name + Email row */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-medium mb-1 uppercase tracking-wide"
              style={{ color: 'var(--text-secondary)' }}>Name *</label>
            <input
              className={inputCls}
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium mb-1 uppercase tracking-wide"
              style={{ color: 'var(--text-secondary)' }}>Email *</label>
            <input
              type="email"
              className={inputCls}
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Idea reference */}
        <div>
          <label className="block text-[10px] font-medium mb-1 uppercase tracking-wide"
            style={{ color: 'var(--text-secondary)' }}>Idea / Project</label>
          <input
            className={inputCls}
            placeholder="Which idea caught your eye? (optional)"
            value={ideaRef}
            onChange={e => setIdeaRef(e.target.value)}
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-[10px] font-medium mb-1 uppercase tracking-wide"
            style={{ color: 'var(--text-secondary)' }}>Message *</label>
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            placeholder="Tell me what you have in mind..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
        </div>

        {/* File attachment */}
        <div>
          <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wide"
            style={{ color: 'var(--text-secondary)' }}>
            Attachments <span style={{ color: 'var(--collab-placeholder)' }}>— up to {MAX_FILES} files, {MAX_MB}MB each</span>
          </label>

          {/* Attached file pills */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-1.5 mb-2"
              >
                {files.map((f, i) => (
                  <motion.div
                    key={f.name + i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px]"
                    style={{ background: 'rgba(3,109,164,0.09)', border: '1px solid rgba(3,109,164,0.19)' }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                    <span style={{ color: 'var(--accent)' }}>{f.name}</span>
                    <span style={{ color: 'rgba(3,109,164,0.50)' }}>({fmtSize(f.size)})</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="ml-0.5 hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--accent)' }}
                    >
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Drop zone */}
          {files.length < MAX_FILES && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full py-2.5 rounded-lg border border-dashed text-[11px] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
              style={{
                borderColor: 'var(--collab-input-border)',
                color: 'var(--collab-placeholder)',
                background: 'var(--collab-dropzone-bg)',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" className="inline mr-1.5 -mt-0.5">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
              Click to attach files
            </button>
          )}

          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt,.zip,.mp4,.mov"
            className="hidden"
            onChange={e => { handleFiles(e.target.files); e.target.value = '' }}
          />
        </div>

        {/* Error */}
        <AnimatePresence>
          {(status === 'error' || errorMsg) && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[11px] px-2 py-1.5 rounded-lg"
              style={{ background: '#ff444415', color: '#ff4444', border: '1px solid #ff444430' }}
            >
              {errorMsg || 'Something went wrong. Please try again.'}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'sending' || !name || !email || !message}
          className="w-full py-2.5 rounded-lg text-[12px] font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'var(--accent)', color: '#ffffff' }}
        >
          {status === 'sending' ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Sending…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Say Hello
            </span>
          )}
        </button>
      </form>
    </motion.div>
  )
}

// ─── CSS variables to add to your global stylesheet ──────────────────────────
// (Add these inside your existing :root / [data-theme="dark"] / [data-theme="light"] blocks)
//
// Dark mode (already your default):
//   --collab-bg:             var(--bg-elevated);
//   --collab-border:         rgba(3,109,164,0.17);
//   --collab-input-bg:       var(--bg-card);
//   --collab-input-border:   rgba(3,109,164,0.19);
//   --collab-input-text:     #e8f5f0;
//   --collab-placeholder:    #4a6b5c;
//   --collab-dropzone-bg:    #0a180f;
//
// Light mode ([data-theme="light"] or .light):
//   --collab-bg:             #f0faf5;
//   --collab-border:         rgba(3,109,164,0.25);
//   --collab-input-bg:       #ffffff;
//   --collab-input-border:   #d0e8dc;
//   --collab-input-text:     var(--bg-elevated);
//   --collab-placeholder:    #8aada0;
//   --collab-dropzone-bg:    #f8fdfb;
// ─────────────────────────────────────────────────────────────────────────────

interface IdeasGridProps { isMobile?: boolean }

export function IdeasGrid({ isMobile }: IdeasGridProps) {
  const [selected, setSelected] = useState<Idea | null>(null)

  const cls = isMobile
    ? 'w-full rounded-2xl border overflow-hidden flex flex-col'
    : 'grid-card-desktop flex-shrink-0 w-[clamp(360px,28vw,500px)] h-[calc(100vh-88px)] rounded-2xl border overflow-hidden flex flex-col'

  const currentIndex = selected ? ideas.findIndex(i => i.id === selected.id) : -1

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.24 }}
      className={cls}
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
        <span className="grid-label">Ideas I&apos;m Exploring</span>
      </div>

      {/* Panel container */}
      <div className="flex-1 relative" style={{ overflow: 'clip' }}>

        {/* ── Ideas list — always visible ── */}
        <div
          className="absolute inset-0 no-scrollbar p-4"
          data-grid-scroll
          style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
        >
          <div className="space-y-3">
            {ideas.map((idea, index) => (
              <motion.button
                key={idea.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.07 }}
                onClick={() => setSelected(idea)}
                className="w-full text-left group"
              >
                <div
                  className="rounded-xl border overflow-hidden transition-all hover:border-[var(--border-hover)]"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {/* Preview image */}
                  <div className="relative h-[200px] overflow-hidden" style={{ background: idea.bgColor }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/gif/${idea.gif}`}
                      alt={idea.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ opacity: 0.92 }}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 h-10"
                      style={{ background: `linear-gradient(to bottom, transparent, ${idea.bgColor}cc)` }}
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide"
                        style={{ background: stageConfig[idea.stage].bg, color: stageConfig[idea.stage].color }}
                      >
                        {stageConfig[idea.stage].label}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: idea.accentColor }}>
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </div>

                  <div className="p-4 border-t" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                    <h3
                      className="text-[13px] font-medium mb-1.5 group-hover:text-[var(--accent)] transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {idea.title}
                    </h3>
                    <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {idea.caption}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}

            {/* Collaborate Form */}
            <CollaborateForm />
          </div>
        </div>

        {/* ── Bottom sheet detail overlay ── */}
        <GridBottomSheet
          open={!!selected}
          onClose={() => setSelected(null)}
          accentColor={selected?.accentColor ?? 'var(--border-hover)'}
        >
          {selected && (
            <>
              {/* Scrollable sheet content */}
              <div
                className="flex-1 no-scrollbar px-5 pb-4"
                data-grid-scroll
                style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
              >
                <div className="mb-5">
                  <span
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{ background: stageConfig[selected.stage].bg, color: stageConfig[selected.stage].color }}
                  >
                    {stageConfig[selected.stage].label}
                  </span>
                </div>

                <h2 className="text-[21px] font-semibold leading-tight mb-3" style={{ color: 'var(--sheet-text)' }}>
                  {selected.title}
                </h2>
                <p className="text-[13px] leading-relaxed mb-7" style={{ color: 'var(--sheet-text-secondary)' }}>
                  {selected.longDescription}
                </p>

                <div className="border-t pt-5 mb-7" style={{ borderColor: 'var(--sheet-row-border)' }}>
                  <span className="grid-label block mb-4">Key Problems to Solve</span>
                  <ul className="space-y-3">
                    {selected.problems.map((p, i) => (
                      <li key={i} className="flex items-start gap-3 text-[13px] font-medium" style={{ color: 'var(--sheet-text)' }}>
                        <span className="w-1.5 h-1.5 rounded-full mt-[5px] flex-shrink-0" style={{ background: selected.accentColor }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-5" style={{ borderColor: 'var(--sheet-row-border)' }}>
                  <span className="grid-label block mb-3">Potential Stack</span>
                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map(t => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium"
                        style={{ background: 'var(--accent-dim)', color: selected.accentColor }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Capsule nav */}
              <div
                className="flex-shrink-0 px-5 py-4 border-t flex items-center justify-center"
                style={{ borderColor: 'var(--sheet-row-border)' }}
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => currentIndex > 0 && setSelected(ideas[currentIndex - 1])}
                    disabled={currentIndex === 0}
                    className="btn-capsule-icon"
                    aria-label="Previous"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                  </button>
                  <button onClick={() => setSelected(null)} className="btn-capsule">Close</button>
                  <button
                    onClick={() => currentIndex < ideas.length - 1 && setSelected(ideas[currentIndex + 1])}
                    disabled={currentIndex === ideas.length - 1}
                    className="btn-capsule-icon"
                    aria-label="Next"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </GridBottomSheet>
      </div>
    </motion.div>
  )
}