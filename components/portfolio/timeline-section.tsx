'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TimelineSectionProps {
  isHorizontal?: boolean
}

const timelineData = [
  {
    year: '2024',
    title: 'Senior ML Engineer',
    company: 'AI Research Lab',
    type: 'Full-time',
    period: 'Jan 24 — Present',
    description: 'Leading development of large language models and multi-modal AI systems.',
    highlights: [
      'Architected LLM fine-tuning pipeline processing 100M+ tokens daily',
      'Reduced model inference latency by 60% through optimization',
      'Led team of 5 ML engineers on production deployments',
    ],
    color: 'bg-primary',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    year: '2022',
    title: 'Machine Learning Engineer',
    company: 'TechCorp AI Division',
    type: 'Full-time',
    period: 'Mar 22 — Dec 23',
    description: 'Built and deployed ML models for computer vision and NLP applications.',
    highlights: [
      'Developed real-time object detection system with 95% accuracy',
      'Created NLP pipeline for sentiment analysis serving 10M requests/day',
      'Implemented MLOps practices reducing deployment time by 80%',
    ],
    color: 'bg-chart-2',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    year: '2020',
    title: 'Data Scientist',
    company: 'DataDriven Inc',
    type: 'Full-time',
    period: 'Jun 20 — Feb 22',
    description: 'Applied statistical analysis and ML to drive business decisions.',
    highlights: [
      'Built predictive models increasing revenue forecasting accuracy by 40%',
      'Designed A/B testing framework used across 50+ experiments',
      'Created executive dashboards visualizing key ML metrics',
    ],
    color: 'bg-chart-3',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    year: '2019',
    title: 'Research Assistant',
    company: 'University ML Lab',
    type: 'Research',
    period: 'Sep 19 — May 20',
    description: 'Conducted research on deep learning and published findings.',
    highlights: [
      'Co-authored 3 papers on neural architecture search',
      'Developed novel attention mechanism improving transformer efficiency',
      'Mentored undergraduate students on ML projects',
    ],
    color: 'bg-chart-4',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
]

export function TimelineSection({ isHorizontal }: TimelineSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [selectedItem, setSelectedItem] = useState<typeof timelineData[0] | null>(null)

  return (
    <section
      id="timeline"
      ref={ref}
      className={cn(
        'relative flex items-center',
        isHorizontal 
          ? 'min-w-screen h-screen px-8 lg:px-16 shrink-0' 
          : 'min-h-screen px-5 py-24'
      )}
      style={isHorizontal ? { scrollSnapAlign: 'start', width: '100vw' } : undefined}
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase">Career Journey</span>
        </motion.div>

        <div className={cn(
          'grid gap-8',
          isHorizontal ? 'grid-cols-[1fr_400px] h-[70vh]' : 'grid-cols-1 lg:grid-cols-[1fr_400px]'
        )}>
          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Year markers */}
            <div className="absolute left-0 top-0 bottom-0 w-20 flex flex-col justify-between py-4">
              {['2024', '2023', '2022', '2021', '2020', '2019'].map((year, index) => (
                <motion.span
                  key={year}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="text-sm font-mono text-muted-foreground"
                >
                  {year}
                </motion.span>
              ))}
            </div>

            {/* Timeline line */}
            <div className="absolute left-28 top-0 bottom-0 w-px bg-border">
              <motion.div
                initial={{ height: 0 }}
                animate={isInView ? { height: '100%' } : {}}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="w-full bg-gradient-to-b from-primary via-primary/50 to-transparent"
              />
            </div>

            {/* Timeline items */}
            <div className="ml-36 space-y-6">
              {timelineData.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.15 }}
                  onClick={() => setSelectedItem(item)}
                  className={cn(
                    'relative bg-card rounded-xl border border-border p-5 cursor-pointer transition-all duration-300',
                    selectedItem?.title === item.title 
                      ? 'border-primary/50 bg-card/80' 
                      : 'hover:border-border/80 hover:bg-card/50'
                  )}
                >
                  {/* Connector dot */}
                  <div className={cn(
                    'absolute -left-[3.25rem] top-6 w-4 h-4 rounded-full border-2 border-background',
                    item.color
                  )} />

                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center text-foreground shrink-0',
                      item.color + '/20'
                    )}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-foreground truncate">{item.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground shrink-0">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-sm text-primary">{item.company}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{item.period}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Detail Panel */}
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div
                key={selectedItem.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-card rounded-2xl border border-border p-8 h-fit"
              >
                {/* Handle bar */}
                <div className="w-12 h-1 rounded-full bg-border mx-auto mb-8" />

                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center mb-6',
                  selectedItem.color + '/20'
                )}>
                  {selectedItem.icon}
                </div>

                <h3 className="text-xl font-medium text-foreground mb-2">{selectedItem.title}</h3>
                <p className="text-primary mb-1">{selectedItem.company}</p>
                <p className="text-xs font-mono text-muted-foreground mb-6">{selectedItem.period}</p>

                <p className="text-muted-foreground mb-8">{selectedItem.description}</p>

                <div className="space-y-1 mb-8">
                  <h4 className="text-xs font-mono text-muted-foreground tracking-wider uppercase mb-4">
                    Key Achievements
                  </h4>
                  <ul className="space-y-3">
                    {selectedItem.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="text-sm text-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-full flex items-center justify-center gap-4 py-3 bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm">Close</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card/50 rounded-2xl border border-dashed border-border p-8 h-fit flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <p className="text-muted-foreground">Select a role to view details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
