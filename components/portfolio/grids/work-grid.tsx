'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GridBottomSheet } from '../grid-bottom-sheet'

interface WorkProject {
  id: string
  title: string
  company: string
  context: string
  year: string
  contribution: string
  tools: string[]
  link?: string
  description: string
  selectedWork: string
  color: string
  accentColor: string
  iconBg: string
  iconText: string
  iconLetter: string
  mainImage: string
  galleryImages: string[]
}

const projects: WorkProject[] = [
  {
    id: '1',
    title: 'Neural Language Model',
    company: 'OpenAI',
    context: 'Research Project',
    year: '2024',
    contribution: 'Architecture Design & Training',
    tools: ['PyTorch', 'CUDA', 'Transformers', 'Ray', 'Python'],
    link: 'openai.com',
    description:
      'Built a state-of-the-art transformer-based language model capable of understanding and generating human-like text across multiple domains. Focused on efficient training and inference for production deployment.',
    selectedWork:
      'Designed the attention mechanism variant that reduced memory footprint by 35% while maintaining model quality. Led the RLHF training pipeline that improved user satisfaction scores by 22%.',
    color: '#036DA4',
    accentColor: 'var(--accent)',
    iconBg: 'var(--bg-elevated)',
    iconText: 'var(--accent)',
    iconLetter: 'O',
    mainImage: '/work/nlm-main.jpg',
    galleryImages: ['/work/nlm-1.jpg', '/work/nlm-2.jpg', '/work/nlm-3.jpg', '/work/nlm-4.jpg'],
  },
  {
    id: '2',
    title: 'Computer Vision Pipeline',
    company: 'Google DeepMind',
    context: 'Production System',
    year: '2023',
    contribution: 'Full Stack ML',
    tools: ['TensorFlow', 'OpenCV', 'C++', 'Kubernetes', 'GCP'],
    link: 'deepmind.google',
    description:
      'End-to-end computer vision system for real-time object detection and tracking in autonomous vehicle scenarios. Processed 60fps video streams with sub-20ms latency at scale.',
    selectedWork:
      'Engineered a novel multi-scale feature pyramid network that improved small object detection by 18%. Deployed across a fleet of 200+ test vehicles with 99.99% uptime.',
    color: '#4285f4',
    accentColor: '#4285f4',
    iconBg: 'var(--bg-elevated)',
    iconText: '#4285f4',
    iconLetter: 'G',
    mainImage: '/work/cv-main.jpg',
    galleryImages: ['/work/cv-1.jpg', '/work/cv-2.jpg', '/work/cv-3.jpg', '/work/cv-4.jpg'],
  },
  {
    id: '3',
    title: 'Recommendation Engine',
    company: 'Meta AI',
    context: 'Core Product',
    year: '2022',
    contribution: 'ML Architecture',
    tools: ['Python', 'Spark', 'PyTorch', 'Presto', 'Kafka'],
    description:
      'Large-scale collaborative filtering system processing billions of interactions daily to personalize content delivery across the feed surface.',
    selectedWork:
      'Introduced a two-tower neural retrieval model replacing legacy matrix factorization. Achieved +8% engagement lift in A/B test across 500M users.',
    color: '#0668e1',
    accentColor: '#0668e1',
    iconBg: 'var(--bg-elevated)',
    iconText: '#0668e1',
    iconLetter: 'M',
    mainImage: '/work/rec-main.jpg',
    galleryImages: ['/work/rec-1.jpg', '/work/rec-2.jpg', '/work/rec-3.jpg', '/work/rec-4.jpg'],
  },
  {
    id: '4',
    title: 'Fraud Detection System',
    company: 'Stripe',
    context: 'Security Platform',
    year: '2021',
    contribution: 'Model Development',
    tools: ['Python', 'XGBoost', 'Kafka', 'PostgreSQL', 'Redis'],
    description:
      'Real-time anomaly detection using ensemble deep learning to identify fraudulent transactions at sub-5ms p99 latency.',
    selectedWork:
      'Built a graph neural network layer that captured transaction relationship patterns, lifting fraud recall by 14% without increasing false positive rate.',
    color: '#635bff',
    accentColor: '#635bff',
    iconBg: 'var(--bg-elevated)',
    iconText: '#635bff',
    iconLetter: 'S',
    mainImage: '/work/fraud-main.jpg',
    galleryImages: ['/work/fraud-1.jpg', '/work/fraud-2.jpg', '/work/fraud-3.jpg', '/work/fraud-4.jpg'],
  },
]

// Image placeholder
function ImgPlaceholder({ color, label }: { color: string; label?: string }) {
  return (
    <div
      className="absolute inset-0 flex items-end p-2"
      style={{ background: `linear-gradient(135deg, ${color}22 0%, ${color}08 100%)` }}
    >
      {label && (
        <span className="text-[9px] font-mono truncate max-w-full" style={{ color: `${color}55` }}>
          {label}
        </span>
      )}
    </div>
  )
}

// Lightbox
function Lightbox({
  images,
  startIndex,
  color,
  onClose,
}: {
  images: string[]
  startIndex: number
  color: string
  onClose: () => void
}) {
  const [idx, setIdx] = useState(startIndex)

  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setIdx(i => Math.max(0, i - 1)) }
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setIdx(i => Math.min(images.length - 1, i + 1)) }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.9)' }}
      onClick={onClose}
    >
      {/* Main image */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative rounded-2xl overflow-hidden border w-full"
        style={{
          maxWidth: 880,
          aspectRatio: '16/9',
          borderColor: `${color}40`,
          background: `linear-gradient(135deg, ${color}22 0%, #111 100%)`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <ImgPlaceholder color={color} label={images[idx]} />

        <button
          onClick={prev}
          disabled={idx === 0}
          className="absolute left-3 top-1/2 -translate-y-1/2 btn-capsule-icon"
          aria-label="Previous"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
        </button>

        <button
          onClick={next}
          disabled={idx === images.length - 1}
          className="absolute right-3 top-1/2 -translate-y-1/2 btn-capsule-icon"
          aria-label="Next"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
        </button>

        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-mono"
          style={{ background: 'rgba(0,0,0,0.65)', color: 'var(--text-secondary)' }}
        >
          {idx + 1} / {images.length}
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 btn-capsule-icon"
          aria-label="Close"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </motion.div>

      {/* Thumbnail row */}
      <div className="flex gap-2 mt-4 flex-wrap justify-center" onClick={e => e.stopPropagation()}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className="rounded transition-all"
            style={{
              width: 52,
              height: 32,
              background: `${color}22`,
              border: `2px solid ${i === idx ? color : 'transparent'}`,
              opacity: i === idx ? 1 : 0.45,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

// Project card
function ProjectCard({ project, onClick }: { project: WorkProject; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left group">
      <div
        className="rounded-xl overflow-hidden border transition-all hover:border-[var(--border-hover)]"
        style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
      >
        {/* Main image 16:9 */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <ImgPlaceholder color={project.accentColor} label={project.mainImage} />
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ background: project.accentColor, opacity: 0.5 }}
          />
        </div>

        {/* Thumbnail strip */}
        <div className="grid grid-cols-4 gap-1 px-2 pt-1.5 pb-1">
          {project.galleryImages.map((_, i) => (
            <div
              key={i}
              className="aspect-video rounded-sm"
              style={{ background: `${project.accentColor}18`, border: `1px solid\\ ${project.accentColor}22` }}
            />
          ))}
        </div>

        {/* Icon + title */}
        <div className="px-3 pb-3 pt-1 flex items-center gap-2.5">
          <div
            className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold flex-shrink-0"
            style={{ background: project.iconBg, color: project.iconText }}
          >
            {project.iconLetter}
          </div>
          <span
            className="text-[12px] font-medium truncate group-hover:text-[var(--accent)] transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            {project.title}
          </span>
        </div>
      </div>
    </button>
  )
}

interface WorkGridProps { isMobile?: boolean }

export function WorkGrid({ isMobile }: WorkGridProps) {
  const [selected, setSelected] = useState<WorkProject | null>(null)
  const [lightbox, setLightbox] = useState<{ images: string[]; startIndex: number } | null>(null)
  const cls = isMobile
    ? 'w-full rounded-2xl border overflow-hidden flex flex-col'
    : 'grid-card-desktop flex-shrink-0 w-[clamp(360px,28vw,500px)] h-[calc(100vh-88px)] rounded-2xl border overflow-hidden flex flex-col'

  const currentIndex = selected ? projects.findIndex(p => p.id === selected.id) : -1

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.14 }}
        className={cls}
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <span className="grid-label">Highlighted Work</span>
        </div>

        {/* Panel container */}
        <div className="flex-1 relative" style={{ overflow: 'clip' }}>

          {/* Project list — always visible behind the sheet */}
          <div
            className="absolute inset-0 no-scrollbar p-4"
            data-grid-scroll
            style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
          >
            <div className="flex flex-col gap-3">
              {projects.map(p => (
                <ProjectCard key={p.id} project={p} onClick={() => setSelected(p)} />
              ))}
            </div>
          </div>

          {/* Bottom sheet detail overlay */}
          <GridBottomSheet
            open={!!selected}
            onClose={() => setSelected(null)}
            accentColor={selected?.accentColor ?? 'var(--border-hover)'}
          >
            {selected && (
              <>
                {/* Scrollable sheet content */}
                <div
                  className="flex-1 no-scrollbar"
                  data-grid-scroll
                  style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
                >
                  {/* Main image */}
                  <div
                    className="mx-4 mt-2 rounded-xl overflow-hidden relative border cursor-pointer group"
                    style={{
                      aspectRatio: '16/9',
                      borderColor: 'rgba(255,255,255,0.06)',
                      background: `linear-gradient(135deg, ${selected.iconBg} 0%, var(--bg-elevated) 100%)`,
                    }}
                    onClick={() => setLightbox({ images: selected.galleryImages, startIndex: 0 })}
                  >
                    <ImgPlaceholder color={selected.accentColor} label={selected.mainImage} />
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(0,0,0,0.32)' }}
                    >
                      <span className="btn-capsule pointer-events-none gap-1.5">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                        View
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: selected.accentColor, opacity: 0.5 }} />
                  </div>

                  {/* Thumbnail strip */}
                  <div className="grid grid-cols-4 gap-2 px-4 mt-2">
                    {selected.galleryImages.map((_, i) => (
                      <div
                        key={i}
                        className="aspect-video rounded-lg border cursor-pointer relative overflow-hidden transition-all hover:opacity-80"
                        style={{ borderColor: 'rgba(255,255,255,0.06)', background: `${selected.accentColor}${14 + i * 6}` }}
                        onClick={() => setLightbox({ images: selected.galleryImages, startIndex: i })}
                      />
                    ))}
                  </div>

                  {/* Text content */}
                  <div className="px-5 pt-5 pb-2">
                    <h2 className="text-[20px] font-semibold leading-tight mb-3" style={{ color: 'var(--sheet-text)' }}>
                      {selected.title}
                    </h2>
                    <p className="text-[13px] leading-relaxed mb-6" style={{ color: 'var(--sheet-text-secondary)' }}>
                      {selected.description}
                    </p>

                    <div className="mb-6">
                      {[
                        { label: 'Company', value: selected.company },
                        { label: 'Context', value: selected.context },
                        { label: 'Year', value: selected.year },
                        { label: 'Contribution', value: selected.contribution },
                        { label: 'Tools', value: selected.tools.join(', ') },
                        ...(selected.link ? [{ label: 'Link', value: selected.link }] : []),
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="flex items-baseline justify-between py-3"
                          style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                        >
                          <span className="grid-label flex-shrink-0">{label}</span>
                          {label === 'Link' ? (
                            <a
                              href={`https://${value}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[12px] font-medium ml-4 underline underline-offset-2 hover:opacity-70 transition-opacity"
                              style={{ color: selected.accentColor }}
                            >
                              {value}
                            </a>
                          ) : (
                            <span className="text-[12px] font-medium text-right ml-4" style={{ color: 'var(--sheet-text)' }}>{value}</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="pt-5 pb-6" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <h3 className="text-[15px] font-semibold mb-3" style={{ color: 'var(--sheet-text)' }}>Selected work</h3>
                      <p className="text-[13px] leading-relaxed font-medium" style={{ color: 'var(--sheet-text)' }}>
                        {selected.selectedWork}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Capsule nav */}
                <div
                  className="flex-shrink-0 px-5 py-4 flex items-center justify-center"
                  style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => currentIndex > 0 && setSelected(projects[currentIndex - 1])}
                      disabled={currentIndex === 0}
                      className="btn-capsule-icon"
                      aria-label="Previous project"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <button onClick={() => setSelected(null)} className="btn-capsule">Close Project</button>
                    <button
                      onClick={() => currentIndex < projects.length - 1 && setSelected(projects[currentIndex + 1])}
                      disabled={currentIndex === projects.length - 1}
                      className="btn-capsule-icon"
                      aria-label="Next project"
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={lightbox.images}
            startIndex={lightbox.startIndex}
            color={selected?.accentColor ?? 'var(--accent)'}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
} 