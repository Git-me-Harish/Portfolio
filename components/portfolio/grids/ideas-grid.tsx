'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GridBottomSheet } from '../grid-bottom-sheet'

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
    accentColor: '#00cc88',
    bgColor: '#0d1f18',
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
    accentColor: '#a55eea',
    bgColor: '#18101f',
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
    accentColor: '#f7b731',
    bgColor: '#1c1800',
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
    accentColor: '#4ecdc4',
    bgColor: '#0d1c1c',
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
  concept: { label: 'Concept', color: '#888', bg: '#88888820' },
  prototype: { label: 'Prototype', color: '#f7b731', bg: '#f7b73120' },
  building: { label: 'Building', color: '#00cc88', bg: '#00cc8820' },
}

interface IdeasGridProps { isMobile?: boolean }

export function IdeasGrid({ isMobile }: IdeasGridProps) {
  const [selected, setSelected] = useState<Idea | null>(null)

  const cls = isMobile
    ? 'w-full rounded-2xl border overflow-hidden flex flex-col'
    : 'grid-card-desktop flex-shrink-0 w-[480px] h-[calc(100vh-88px)] rounded-2xl border overflow-hidden flex flex-col'

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

            {/* Collaborate CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="mt-2 p-4 rounded-xl border"
              style={{ background: '#0d1f18', borderColor: '#00cc8828' }}
            >
              <h4 className="text-[13px] font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                Want to collaborate?
              </h4>
              <p className="text-[12px] leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                Always open to discussing ideas and building interesting things together.
              </p>
              <a
                href="mailto:your.email@example.com"
                className="btn-capsule inline-flex gap-1.5"
                style={{ background: '#00cc88', borderColor: '#00cc88', color: '#000', fontWeight: 700 }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Say Hello
              </a>
            </motion.div>
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
                        style={{ background: `${selected.accentColor}18`, color: selected.accentColor }}
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