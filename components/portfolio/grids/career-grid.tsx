'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { GridBottomSheet } from '../grid-bottom-sheet'

// ─────────────────────────────────────────────────────────────────────────────
// Animated gradient grid background for job cards
// Light mode: subtle warm grid lines with an accent-coloured gradient wash
// Dark mode:  deeper lines with a slightly brighter wash
// ─────────────────────────────────────────────────────────────────────────────

function CardGridBackground({ color }: { color: string }) {
  const patternId = `card-grid-${color.replace('#', '')}`
  return (
    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none" aria-hidden>
      {/* Animated gradient wash */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 120% 80% at 10% 50%, ${color}18 0%, transparent 70%)`,
          animation: 'card-glow 4s ease-in-out infinite alternate',
        }}
      />
      {/* Grid SVG — light mode lines */}
      <svg className="absolute inset-0 w-full h-full dark:opacity-0 transition-opacity duration-300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`${patternId}-light`} width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M 18 0 L 0 0 0 18" fill="none" stroke="rgba(0,0,0,0.055)" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId}-light)`} />
      </svg>
      {/* Grid SVG — dark mode lines */}
      <svg className="absolute inset-0 w-full h-full opacity-0 dark:opacity-100 transition-opacity duration-300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`${patternId}-dark`} width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M 18 0 L 0 0 0 18" fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId}-dark)`} />
      </svg>
      {/* Edge fade so grid doesn't look harsh at borders */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, transparent 40%, var(--bg-elevated) 100%)',
          opacity: 0.55,
        }}
      />
      <style>{`
        @keyframes card-glow {
          0%   { opacity: 0.6; transform: scale(1); }
          100% { opacity: 1;   transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface JobProject {
  id: string
  title: string
  description: string
  company: string
  context: string
  year: string
  contribution: string
  tools: string[]
  color: string
}

interface Job {
  id: string
  title: string
  company: string
  type: string
  startDate: string
  endDate: string
  startYear: number
  endYear: number
  color: string
  iconBg: string
  iconText: string
  iconLetter: string
  iconImage?: string           // e.g. '/icons/icon-1.png'
  description: string
  achievements: string[]
  learned: string[]
  projects: JobProject[]
  isEducation?: boolean        // true → renders as a graduation marker
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const jobs: Job[] = [
  {
    id: '1',
    title: 'Senior ML Engineer',
    company: 'OpenAI',
    type: 'FULL-TIME',
    startDate: 'JAN 24',
    endDate: 'PRESENT',
    startYear: 2024,
    endYear: 2026,
    color: '#036DA4',
    iconBg: 'var(--bg-elevated)',
    iconText: 'var(--accent)',
    iconLetter: 'O',
    iconImage: '/icons/icon-1.png',
    description: 'Leading development of large language models and responsible AI systems across production services serving millions of users. A fast-paced, high-autonomy environment pushing the frontier of AI safety and capability.',
    achievements: [
      'Architected GPT-based systems serving millions of daily active users',
      'Reduced model inference latency by 40% through kernel-level optimization',
      'Led a team of 5 engineers on multimodal AI research projects',
      'Designed evaluation frameworks for model safety and alignment',
    ],
    learned: [
      'Scale changes everything — what works at 1M users breaks at 100M',
      'Safety and capability are complementary, not competing',
      'Evaluation is as important as training',
    ],
    projects: [
      {
        id: 'p1',
        title: 'GPT Safety Eval Framework',
        description: 'Built a comprehensive evaluation suite for measuring model safety, alignment, and capability across diverse prompt distributions. Became the internal standard for all model releases.',
        company: 'OpenAI',
        context: 'Internal Tool',
        year: '2024',
        contribution: 'Architecture & Lead',
        tools: ['Python', 'PyTorch', 'Redis', 'FastAPI'],
        color: '#036DA4',
      },
      {
        id: 'p2',
        title: 'Inference Optimization Engine',
        description: 'Kernel-level CUDA optimizations and speculative decoding implementation that cut p99 latency by 40% and saved millions in compute costs annually.',
        company: 'OpenAI',
        context: 'Production',
        year: '2025',
        contribution: 'Full Ownership',
        tools: ['CUDA', 'C++', 'Python', 'Triton'],
        color: '#036DA4',
      },
    ],
  },
  {
    id: '2',
    title: 'ML Engineer',
    company: 'Google DeepMind',
    type: 'FULL-TIME',
    startDate: 'JUN 22',
    endDate: 'DEC 23',
    startYear: 2022,
    endYear: 2023,
    color: '#4285f4',
    iconBg: 'var(--bg-elevated)',
    iconText: '#4285f4',
    iconLetter: 'G',
    iconImage: '/icons/icon-2.png',
    description: 'Worked on reinforcement learning and neural architecture search for robotics and scientific applications. Collaborated with world-class researchers and shipped work that appeared in top-tier venues.',
    achievements: [
      'Developed novel RL algorithms deployed in robotics pipelines',
      'Published 3 papers at NeurIPS and ICML',
      'Contributed to AlphaFold protein structure prediction systems',
      'Implemented distributed training across 512 TPUs',
    ],
    learned: [
      'Research quality comes from rigorous iteration, not intuition alone',
      'Distributed systems thinking is essential for modern ML',
      'Writing clearly forces clearer thinking',
    ],
    projects: [
      {
        id: 'p3',
        title: 'AlphaFold Protein Folding',
        description: 'Contributed to improvements in the structure prediction pipeline, specifically optimizing the multiple sequence alignment preprocessing to handle longer sequences and improve throughput 3x.',
        company: 'Google DeepMind',
        context: 'Research',
        year: '2023',
        contribution: 'Pipeline & Optimization',
        tools: ['Python', 'JAX', 'Haiku', 'TPUs'],
        color: '#4285f4',
      },
      {
        id: 'p4',
        title: 'RL Robotics Framework',
        description: 'Novel RL algorithms for manipulation tasks, combining model-based planning with learned value functions. Deployed in simulation and physical robot arms in the London lab.',
        company: 'Google DeepMind',
        context: 'Research Project',
        year: '2022',
        contribution: 'Algorithm Design',
        tools: ['Python', 'TensorFlow', 'ROS', 'MuJoCo'],
        color: '#4285f4',
      },
    ],
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'Meta AI',
    type: 'FULL-TIME',
    startDate: 'AUG 20',
    endDate: 'MAY 22',
    startYear: 2020,
    endYear: 2022,
    color: '#0668e1',
    iconBg: 'var(--bg-elevated)',
    iconText: '#0668e1',
    iconLetter: 'M',
    iconImage: '/icons/icon-3.png',
    description: 'Built recommendation systems and content understanding models for core feed products. Operated at massive scale, where even 0.1% metric lifts impacted hundreds of millions of people daily.',
    achievements: [
      'Improved content recommendation accuracy by 25%',
      'Built real-time anomaly detection system for platform integrity',
      'Scaled ML pipelines to process petabytes of interaction data daily',
      'Mentored 3 junior data scientists',
    ],
    learned: [
      'Petabyte-scale ML teaches you to question every assumption',
      'Product instinct is a learnable skill, not a personality trait',
      'Mentoring makes you a better engineer',
    ],
    projects: [
      {
        id: 'p5',
        title: 'Feed Recommendation Engine',
        description: 'Two-tower neural retrieval model that replaced the legacy matrix factorization approach. +8% engagement lift across 500M users in A/B test, shipped to production within one quarter.',
        company: 'Meta AI',
        context: 'Core Product',
        year: '2022',
        contribution: 'ML Architecture',
        tools: ['Python', 'PyTorch', 'Presto', 'Spark', 'Kafka'],
        color: '#0668e1',
      },
    ],
  },
  {
    id: '4',
    title: 'ML Research Intern',
    company: 'NVIDIA',
    type: 'INTERNSHIP',
    startDate: 'MAY 19',
    endDate: 'AUG 19',
    startYear: 2019,
    endYear: 2019,
    color: '#76b900',
    iconBg: 'var(--bg-elevated)',
    iconText: '#76b900',
    iconLetter: 'N',
    iconImage: '/icons/icon-4.png',
    description: 'Research on GPU-accelerated deep learning and computer vision for autonomous systems. First taste of production-grade ML infrastructure and the craft of shipping fast.',
    achievements: [
      'Optimized CUDA kernels achieving 2x training speedup',
      'Developed real-time object detection for autonomous vehicles',
      'Co-authored patent on efficient neural network inference',
    ],
    learned: [
      'Hardware constraints make better software engineers',
      'Shipping a patent in 3 months is possible — barely',
      'Ask dumb questions early, they save smart time later',
    ],
    projects: [
      {
        id: 'p6',
        title: 'CUDA Kernel Optimizer',
        description: 'Custom CUDA kernels for fused attention operations that achieved 2x speedup over cuBLAS baselines. Later contributed to the NVIDIA deep learning SDK.',
        company: 'NVIDIA',
        context: 'Research',
        year: '2019',
        contribution: 'CUDA Development',
        tools: ['CUDA', 'C++', 'Python', 'TensorRT'],
        color: '#76b900',
      },
    ],
  },
  // Education marker
  {
    id: 'edu-hs',
    title: 'High School Graduation',
    company: 'High School',
    type: 'EDUCATION',
    startDate: 'MAY 18',
    endDate: 'MAY 18',
    startYear: 2018,
    endYear: 2018,
    color: '#5EA3C0',
    iconBg: 'var(--bg-elevated)',
    iconText: 'var(--accent-light)',
    iconLetter: 'H',
    iconImage: '/icons/school.png',
    isEducation: true,
    description: 'Graduated from High School with distinction. Built the foundation for a career in computer science and machine learning.',
    achievements: [],
    learned: [],
    projects: [],
  },
]

const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015]
const YEAR_H = 64

type PanelView =
  | { type: 'timeline' }
  | { type: 'job'; job: Job }
  | { type: 'project'; project: JobProject; job: Job }

interface CareerGridProps { isMobile?: boolean }

// ─────────────────────────────────────────────────────────────────────────────
// Company icon — image with letter fallback
// ─────────────────────────────────────────────────────────────────────────────

function CompanyIcon({
  job,
  size = 'md',
}: {
  job: Job
  size?: 'sm' | 'md' | 'lg'
}) {
  const dim = size === 'sm' ? 28 : size === 'lg' ? 48 : 36
  const textSize = size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-lg' : 'text-xs'
  const rounded = size === 'lg' ? 'rounded-xl' : 'rounded-lg'

  if (job.iconImage) {
    return (
      <div
        className={`flex-shrink-0 overflow-hidden ${rounded} border`}
        style={{
          width: dim,
          height: dim,
          background: 'var(--bg-elevated)',
          borderColor: 'var(--border)',
        }}
      >
        <Image
          src={job.iconImage}
          alt={job.company}
          width={dim}
          height={dim}
          className="w-full h-full object-contain p-1"
        />
      </div>
    )
  }

  return (
    <div
      className={`flex-shrink-0 flex items-center justify-center font-bold ${rounded} ${textSize}`}
      style={{ width: dim, height: dim, background: job.iconBg, color: job.iconText }}
    >
      {job.iconLetter}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Education graduation marker
// ─────────────────────────────────────────────────────────────────────────────

function GraduationMarker({ job, onClick }: { job: Job; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute left-0 right-0 text-left group"
      style={{ top: (YEARS[0] - job.endYear) * YEAR_H + YEAR_H / 2 - 18, height: 36 }}
    >
      <div
        className="w-full h-full flex items-center gap-2.5 px-3 rounded-xl border transition-all hover:border-[var(--border-hover)] overflow-hidden relative"
        style={{ background: `${job.color}10`, borderColor: `${job.color}40`, borderStyle: 'dashed' }}
      >
        <CardGridBackground color={job.color} />
        <div className="relative z-10 flex items-center gap-2.5 w-full">
          {/* 👇 Changed from 🎓 to CompanyIcon */}
          <CompanyIcon job={job} size="sm" />
          
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold leading-none" style={{ color: job.color }}>
              {job.title}
            </p>
            <p className="text-[9px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {job.startDate}
            </p>
          </div>
          <span
            className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md"
            style={{ background: `${job.color}20`, color: job.color }}
          >
            Edu
          </span>
        </div>
      </div>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function CareerGrid({ isMobile }: CareerGridProps) {
  const [panel, setPanel] = useState<PanelView>({ type: 'timeline' })

  const cls = isMobile
    ? 'w-full rounded-2xl border overflow-hidden flex flex-col'
    : 'grid-card-desktop flex-shrink-0 w-[clamp(360px,28vw,500px)] h-[calc(100vh-88px)] rounded-2xl border overflow-hidden flex flex-col'

  // Split jobs from education markers
  const regularJobs = jobs.filter(j => !j.isEducation)
  const eduMarkers = jobs.filter(j => j.isEducation)

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.09 }}
      className={cls}
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
        <span className="grid-label">Career Journey</span>
      </div>

      {/* Panel container */}
      <div className="flex-1 relative" style={{ overflow: 'clip' }}>

        {/* ── Always-visible timeline ── */}
        <div
          className="absolute inset-0 no-scrollbar"
          data-grid-scroll
          style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
        >
          {isMobile ? (
            /* ── Mobile: stacked cards ── */
            <div className="p-4 space-y-3">
              {/* Education first (chronologically last, show at top for highlight) */}
                {eduMarkers.map(edu => (
                  <button key={edu.id} onClick={() => setPanel({ type: 'job', job: edu })} className="w-full text-left">
                    <div
                      className="rounded-xl p-3.5 border relative overflow-hidden transition-all hover:border-[var(--border-hover)]"
                      style={{ background: `${edu.color}0d`, borderColor: `${edu.color}40`, borderStyle: 'dashed' }}
                    >
                      <CardGridBackground color={edu.color} />
                      <div className="relative z-10 flex items-center gap-3">
                        {/* 👇 Changed from 🎓 to CompanyIcon */}
                        <CompanyIcon job={edu} size="md" />
                        
                        <div>
                          <p className="text-sm font-semibold" style={{ color: edu.color }}>{edu.title}</p>
                          <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {edu.startDate} · Education
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

              {/* Regular job cards */}
              {regularJobs.map((job) => (
                <button key={job.id} onClick={() => setPanel({ type: 'job', job })} className="w-full text-left group">
                  <div
                    className="rounded-xl p-4 border hover:border-[var(--border-hover)] transition-all relative overflow-hidden"
                    style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
                  >
                    <CardGridBackground color={job.color} />
                    <div className="relative z-10 flex items-center gap-3">
                      <CompanyIcon job={job} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {job.title} · {job.company}
                        </p>
                        <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {job.startDate} — {job.endDate}
                        </p>
                      </div>
                      <svg className="flex-shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)' }}>
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* ── Desktop: year-axis timeline ── */
            <div className="flex pt-4 pb-4 pl-4 pr-3" style={{ minHeight: '100%' }}>

              {/* Year labels */}
              <div className="flex-shrink-0 w-9 select-none">
                {YEARS.map((y) => (
                  <div
                    key={y}
                    className="flex items-start justify-end pr-2 text-[10px] font-mono"
                    style={{ height: YEAR_H, color: 'var(--text-muted)', paddingTop: 3 }}
                  >
                    {y}
                  </div>
                ))}
              </div>

              {/* Hatched accent bar */}
              <div
                className="flex-shrink-0 rounded-sm overflow-hidden relative"
                style={{ width: 14, height: YEARS.length * YEAR_H }}
              >
                <div className="absolute inset-0" style={{ background: 'var(--accent)', opacity: 0.18 }} />
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.55 }}>
                  <defs>
                    <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                      <line x1="0" y1="0" x2="0" y2="5" stroke="var(--accent)" strokeWidth="1.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#hatch)" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center" style={{ top: YEAR_H * 2 }}>
                  <span
                    className="text-[7px] font-bold tracking-[0.25em] uppercase select-none"
                    style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      color: '#036DA4',
                      opacity: 0.9,
                      lineHeight: 1,
                    }}
                  >
                    Freelance &amp; Side Projects
                  </span>
                </div>
              </div>

              {/* Job cards + education markers — year-positioned */}
              <div className="relative flex-1 ml-2" style={{ height: YEARS.length * YEAR_H }}>

                {/* Education markers */}
                {eduMarkers.map(edu => (
                  <GraduationMarker key={edu.id} job={edu} onClick={() => setPanel({ type: 'job', job: edu })} />
                ))}

                {/* Regular job cards */}
                {regularJobs.map((job) => {
                  const top = (YEARS[0] - job.endYear) * YEAR_H + 4
                  const rawH = (job.endYear - job.startYear) * YEAR_H
                  const height = Math.max(rawH - 8, YEAR_H * 0.65)
                  const isShort = height < YEAR_H * 1.1

                  return (
                    <button
                      key={job.id}
                      onClick={() => setPanel({ type: 'job', job })}
                      className="absolute left-0 right-0 text-left group"
                      style={{ top, height }}
                    >
                      <div
                        className="w-full h-full rounded-xl border transition-all hover:border-[var(--border-hover)] overflow-hidden relative"
                        style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
                      >
                        {/* Animated grid background */}
                        <CardGridBackground color={job.color} />

                        {/* Left accent bar */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-[2px] rounded-l-xl z-10"
                          style={{ background: job.color, opacity: 0.6 }}
                        />

                        {/* Content */}
                        <div className={`relative z-10 flex items-start gap-2.5 ${isShort ? 'p-2' : 'p-3'}`}>
                          <CompanyIcon job={job} size={isShort ? 'sm' : 'sm'} />
                          {!isShort && (
                            <div className="min-w-0 pt-0.5">
                              <p className="text-[11px] font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                                {job.title}
                                <span className="font-normal" style={{ color: 'var(--text-secondary)' }}> · {job.company}</span>
                              </p>
                              <p className="text-[10px] font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
                                {job.startDate} — {job.endDate}
                              </p>
                            </div>
                          )}
                          {isShort && (
                            <div className="min-w-0 flex items-center" style={{ height: 28 }}>
                              <p className="text-[10px] font-semibold truncate leading-none" style={{ color: 'var(--text-primary)' }}>
                                {job.title}
                                <span className="font-normal" style={{ color: 'var(--text-secondary)' }}> · {job.company}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Bottom sheet — job / project detail ── */}
        <GridBottomSheet
          open={panel.type !== 'timeline'}
          onClose={() => {
            if (panel.type === 'project') setPanel({ type: 'job', job: panel.job })
            else setPanel({ type: 'timeline' })
          }}
          accentColor={
            panel.type === 'job' ? panel.job.color
            : panel.type === 'project' ? panel.project.color
            : 'var(--border-hover)'
          }
        >
          <AnimatePresence mode="wait" initial={false}>

            {/* ── Job Detail ── */}
            {panel.type === 'job' && (
              <motion.div
                key={`job-${panel.job.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <div
                  className="flex-1 no-scrollbar px-5 pb-4"
                  data-grid-scroll
                  style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
                >
                  {/* Icon */}
                  <div className="mb-5">
                    <CompanyIcon job={panel.job} size="lg" />
                  </div>

                  <h2 className="text-[21px] font-semibold leading-tight mb-1" style={{ color: 'var(--sheet-text)' }}>
                    {panel.job.title}
                    {!panel.job.isEducation && ` - ${panel.job.company}`}
                  </h2>
                  <p className="text-[11px] font-mono mb-6" style={{ color: 'var(--text-muted)' }}>
                    {panel.job.type} · {panel.job.startDate}
                    {panel.job.startDate !== panel.job.endDate && ` — ${panel.job.endDate}`}
                  </p>

                  <p className="text-[13px] leading-relaxed mb-7" style={{ color: 'var(--sheet-text-secondary)' }}>
                    {panel.job.description}
                  </p>

                  {/* Achievements */}
                  {panel.job.achievements.length > 0 && (
                    <div className="border-t pt-5 mb-6" style={{ borderColor: 'var(--sheet-row-border)' }}>
                      <span className="grid-label block mb-4">Stuff I Worked On</span>
                      <ul className="space-y-3">
                        {panel.job.achievements.map((a, i) => (
                          <li key={i} className="flex items-start gap-3 text-[13px] font-medium" style={{ color: 'var(--sheet-text)' }}>
                            <span className="w-1.5 h-1.5 rounded-full mt-[5px] flex-shrink-0" style={{ background: panel.job.color }} />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Learnings */}
                  {panel.job.learned.length > 0 && (
                    <div className="border-t pt-5 mb-6" style={{ borderColor: 'var(--sheet-row-border)' }}>
                      <span className="grid-label block mb-4">Things I Learned</span>
                      <ul className="space-y-3">
                        {panel.job.learned.map((l, i) => (
                          <li key={i} className="flex items-start gap-3 text-[13px] font-medium" style={{ color: 'var(--sheet-text)' }}>
                            <span className="w-1.5 h-1.5 rounded-full mt-[5px] flex-shrink-0" style={{ background: panel.job.color, opacity: 0.6 }} />
                            {l}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Projects */}
                  {panel.job.projects.length > 0 && (
                    <div className="border-t pt-5" style={{ borderColor: 'var(--sheet-row-border)' }}>
                      <span className="grid-label block mb-4">Projects</span>
                      <div className="space-y-2">
                        {panel.job.projects.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => setPanel({ type: 'project', project, job: panel.job })}
                            className="w-full text-left group"
                          >
                            <div
                              className="flex items-center gap-3 p-3.5 rounded-xl border transition-all hover:border-[var(--border-hover)]"
                              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                                style={{ background: panel.job.iconBg, color: panel.job.color, border: `1px solid ${panel.job.color}30` }}
                              >
                                {project.title.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium truncate group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                                  {project.title}
                                </p>
                                <p className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                                  {project.context} · {project.year}
                                </p>
                              </div>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--text-muted)' }}>
                                <path d="M9 18l6-6-6-6" />
                              </svg>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Nav */}
                <div
                  className="flex-shrink-0 px-5 py-4 border-t flex items-center justify-center"
                  style={{ borderColor: 'var(--sheet-row-border)' }}
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const i = jobs.findIndex(j => j.id === panel.job.id)
                        if (i > 0) setPanel({ type: 'job', job: jobs[i - 1] })
                      }}
                      disabled={jobs.findIndex(j => j.id === panel.job.id) === 0}
                      className="btn-capsule-icon"
                      aria-label="Previous"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button onClick={() => setPanel({ type: 'timeline' })} className="btn-capsule">Close</button>
                    <button
                      onClick={() => {
                        const i = jobs.findIndex(j => j.id === panel.job.id)
                        if (i < jobs.length - 1) setPanel({ type: 'job', job: jobs[i + 1] })
                      }}
                      disabled={jobs.findIndex(j => j.id === panel.job.id) === jobs.length - 1}
                      className="btn-capsule-icon"
                      aria-label="Next"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Project Detail ── */}
            {panel.type === 'project' && (
              <motion.div
                key={`project-${panel.project.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <div
                  className="flex-1 no-scrollbar px-5 pb-4"
                  data-grid-scroll
                  style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold mb-5"
                    style={{ background: panel.job.iconBg, color: panel.project.color, border: `1px solid ${panel.project.color}30` }}
                  >
                    {panel.project.title.charAt(0)}
                  </div>

                  <h2 className="text-[21px] font-semibold leading-tight mb-1" style={{ color: 'var(--sheet-text)' }}>
                    {panel.project.title}
                  </h2>
                  <p className="text-[11px] font-mono mb-6" style={{ color: 'var(--text-muted)' }}>
                    {panel.project.company} · {panel.project.context} · {panel.project.year}
                  </p>

                  <p className="text-[13px] leading-relaxed mb-7" style={{ color: 'var(--sheet-text-secondary)' }}>
                    {panel.project.description}
                  </p>

                  <div className="border-t" style={{ borderColor: 'var(--sheet-row-border)' }}>
                    {[
                      { label: 'Company', value: panel.project.company },
                      { label: 'Context', value: panel.project.context },
                      { label: 'Year', value: panel.project.year },
                      { label: 'Contribution', value: panel.project.contribution },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between py-3 border-b"
                        style={{ borderColor: 'var(--sheet-row-border)' }}
                      >
                        <span className="grid-label">{label}</span>
                        <span className="text-[12px] font-medium" style={{ color: 'var(--sheet-text)' }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-5">
                    <span className="grid-label block mb-3">Tools</span>
                    <div className="flex flex-wrap gap-2">
                      {panel.project.tools.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium"
                          style={{ background: `${panel.project.color}18`, color: panel.project.color }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Nav */}
                <div
                  className="flex-shrink-0 px-5 py-4 border-t flex items-center justify-center"
                  style={{ borderColor: 'var(--sheet-row-border)' }}
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const idx = panel.job.projects.findIndex(p => p.id === panel.project.id)
                        if (idx > 0) setPanel({ type: 'project', project: panel.job.projects[idx - 1], job: panel.job })
                      }}
                      disabled={panel.job.projects.findIndex(p => p.id === panel.project.id) === 0}
                      className="btn-capsule-icon"
                      aria-label="Previous project"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button onClick={() => setPanel({ type: 'job', job: panel.job })} className="btn-capsule">
                      Close Project
                    </button>
                    <button
                      onClick={() => {
                        const idx = panel.job.projects.findIndex(p => p.id === panel.project.id)
                        if (idx < panel.job.projects.length - 1)
                          setPanel({ type: 'project', project: panel.job.projects[idx + 1], job: panel.job })
                      }}
                      disabled={panel.job.projects.findIndex(p => p.id === panel.project.id) === panel.job.projects.length - 1}
                      className="btn-capsule-icon"
                      aria-label="Next project"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GridBottomSheet>
      </div>
    </motion.div>
  )
}