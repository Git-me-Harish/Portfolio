'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProjectsSectionProps {
  isHorizontal?: boolean
}

const projects = [
  {
    id: 1,
    title: 'Neural Vision Pro',
    description: 'Real-time computer vision system for autonomous vehicle perception using transformer-based architectures.',
    longDescription: 'Developed a state-of-the-art perception system leveraging Vision Transformers (ViT) for multi-object detection and tracking. The system processes 60fps video streams with sub-20ms latency.',
    company: 'AI Research Lab',
    context: 'Lead Engineer',
    year: '2024',
    contribution: 'Architecture & Implementation',
    tools: 'PyTorch, CUDA, TensorRT',
    tags: ['Computer Vision', 'Deep Learning', 'Real-time', 'PyTorch'],
    metrics: [
      { label: 'Accuracy', value: '99.2%' },
      { label: 'Latency', value: '<20ms' },
      { label: 'FPS', value: '60' },
    ],
    color: 'from-primary/20 to-chart-2/20',
  },
  {
    id: 2,
    title: 'LLM Orchestrator',
    description: 'Production-ready framework for deploying and managing multiple large language models at scale.',
    longDescription: 'Built an orchestration platform for LLM deployment with automatic load balancing, model versioning, and A/B testing capabilities. Serves millions of inference requests daily.',
    company: 'TechCorp',
    context: 'ML Platform',
    year: '2024',
    contribution: 'Full Stack Development',
    tools: 'Python, Kubernetes, Ray',
    tags: ['LLM', 'MLOps', 'Infrastructure', 'Python'],
    metrics: [
      { label: 'Daily Requests', value: '10M+' },
      { label: 'Uptime', value: '99.99%' },
      { label: 'Models', value: '15+' },
    ],
    color: 'from-chart-2/20 to-chart-3/20',
  },
  {
    id: 3,
    title: 'Sentiment Analyzer',
    description: 'Multi-lingual NLP pipeline for real-time sentiment analysis across social media platforms.',
    longDescription: 'Created a distributed NLP system using fine-tuned BERT models for sentiment classification in 12 languages. Processes millions of social media posts for brand monitoring.',
    company: 'DataDriven Inc',
    context: 'NLP Team',
    year: '2023',
    contribution: 'Model Development',
    tools: 'Transformers, Spark, AWS',
    tags: ['NLP', 'Transformers', 'Distributed', 'AWS'],
    metrics: [
      { label: 'Languages', value: '12' },
      { label: 'F1 Score', value: '0.94' },
      { label: 'Throughput', value: '50K/s' },
    ],
    color: 'from-chart-3/20 to-chart-4/20',
  },
  {
    id: 4,
    title: 'AutoML Platform',
    description: 'Automated machine learning platform enabling non-technical users to build and deploy ML models.',
    longDescription: 'Designed and built an AutoML system with neural architecture search, hyperparameter optimization, and automated feature engineering. Reduced model development time by 80%.',
    company: 'Startup X',
    context: 'Founding Engineer',
    year: '2023',
    contribution: 'Architecture & Strategy',
    tools: 'Python, React, GCP',
    tags: ['AutoML', 'NAS', 'Platform', 'GCP'],
    metrics: [
      { label: 'Time Saved', value: '80%' },
      { label: 'Users', value: '5K+' },
      { label: 'Models Built', value: '50K' },
    ],
    color: 'from-chart-4/20 to-primary/20',
  },
]

const sideProjects = [
  {
    name: 'MLKit',
    description: 'Open-source toolkit for rapid ML prototyping.',
    link: 'github.com/mlkit',
    stars: '2.3k',
  },
  {
    name: 'DataViz Pro',
    description: 'Interactive visualization library for ML metrics.',
    link: 'dataviz.pro',
    stars: '1.8k',
  },
  {
    name: 'Model Zoo',
    description: 'Curated collection of pre-trained models.',
    link: 'modelzoo.ai',
    stars: '4.1k',
  },
  {
    name: 'PyTensor',
    description: 'Simplified tensor operations for beginners.',
    link: 'pytensor.dev',
    stars: '890',
  },
]

export function ProjectsSection({ isHorizontal }: ProjectsSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)

  return (
    <section
      id="projects"
      ref={ref}
      className={cn(
        'relative flex items-center',
        isHorizontal 
          ? 'min-w-[150vw] h-screen px-8 lg:px-16 shrink-0' 
          : 'min-h-screen px-5 py-24'
      )}
      style={isHorizontal ? { scrollSnapAlign: 'start' } : undefined}
    >
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase">Highlighted Work</span>
        </motion.div>

        <div className={cn(
          'grid gap-8',
          isHorizontal 
            ? 'grid-cols-[1fr_1fr_400px] h-[70vh]' 
            : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
        )}>
          {/* Main Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                onClick={() => setSelectedProject(project)}
                className={cn(
                  'group relative bg-card rounded-2xl border border-border overflow-hidden cursor-pointer transition-all duration-500',
                  'hover:border-primary/30',
                  selectedProject?.id === project.id && 'border-primary/50'
                )}
              >
                {/* Gradient background */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                  project.color
                )} />

                <div className="relative p-6">
                  {/* Project preview */}
                  <div className="aspect-video bg-secondary/50 rounded-lg mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 grid-pattern opacity-30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    {/* Floating metrics */}
                    <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                      {project.metrics.slice(0, 2).map((metric) => (
                        <div key={metric.label} className="px-2 py-1 bg-background/80 backdrop-blur rounded text-xs">
                          <span className="text-primary font-medium">{metric.value}</span>
                          <span className="text-muted-foreground ml-1">{metric.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span 
                        key={tag} 
                        className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Side Projects */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-card rounded-2xl border border-border p-8"
          >
            <h3 className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase mb-8">
              Side Projects
            </h3>

            <div className="space-y-6">
              {sideProjects.map((project, index) => (
                <motion.a
                  key={project.name}
                  href={`https://${project.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="group flex items-start gap-4 p-4 -mx-4 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <span className="text-sm font-bold text-primary">{project.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {project.name}
                      </h4>
                      <svg className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground/70">{project.link}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                        </svg>
                        {project.stars}
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Project Detail Panel */}
          <AnimatePresence mode="wait">
            {selectedProject ? (
              <motion.div
                key={selectedProject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-card rounded-2xl border border-border p-8 h-fit"
              >
                {/* Handle bar */}
                <div className="w-12 h-1 rounded-full bg-border mx-auto mb-8" />

                <h3 className="text-2xl font-medium text-foreground mb-4">{selectedProject.title}</h3>
                <p className="text-muted-foreground mb-8">{selectedProject.longDescription}</p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {selectedProject.metrics.map((metric) => (
                    <div key={metric.label} className="text-center p-4 bg-secondary/50 rounded-xl">
                      <div className="text-xl font-medium text-primary">{metric.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{metric.label}</div>
                    </div>
                  ))}
                </div>

                {/* Details */}
                <div className="space-y-4 mb-8">
                  {[
                    { label: 'Company', value: selectedProject.company },
                    { label: 'Context', value: selectedProject.context },
                    { label: 'Year', value: selectedProject.year },
                    { label: 'Contribution', value: selectedProject.contribution },
                    { label: 'Tools', value: selectedProject.tools },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                      <span className="text-xs font-mono text-muted-foreground uppercase">{item.label}</span>
                      <span className="text-sm text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-full flex items-center justify-center gap-4 py-3 bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="text-sm">Close Project</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card/50 rounded-2xl border border-dashed border-border p-8 h-fit"
              >
                <h3 className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase mb-6">
                  Ideas I&apos;m Exploring
                </h3>

                <div className="space-y-4">
                  {[
                    'Multimodal AI assistants for complex reasoning',
                    'Efficient fine-tuning techniques for edge deployment',
                    'Self-supervised learning for medical imaging',
                    'Interpretable ML for high-stakes decisions',
                  ].map((idea, index) => (
                    <motion.div
                      key={idea}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-sm text-foreground">{idea}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
