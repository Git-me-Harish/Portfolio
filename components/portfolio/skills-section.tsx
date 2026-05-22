'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SkillsSectionProps {
  isHorizontal?: boolean
}

const skillCategories = [
  {
    title: 'Machine Learning',
    skills: [
      { name: 'Deep Learning', level: 95 },
      { name: 'Computer Vision', level: 90 },
      { name: 'NLP', level: 92 },
      { name: 'Reinforcement Learning', level: 80 },
      { name: 'Time Series', level: 85 },
    ],
  },
  {
    title: 'Frameworks',
    skills: [
      { name: 'PyTorch', level: 95 },
      { name: 'TensorFlow', level: 88 },
      { name: 'Scikit-learn', level: 92 },
      { name: 'Hugging Face', level: 90 },
      { name: 'JAX', level: 75 },
    ],
  },
  {
    title: 'Tools & Infrastructure',
    skills: [
      { name: 'Python', level: 98 },
      { name: 'Docker', level: 85 },
      { name: 'Kubernetes', level: 80 },
      { name: 'AWS/GCP', level: 88 },
      { name: 'MLflow', level: 85 },
    ],
  },
]

const certifications = [
  { name: 'AWS ML Specialty', issuer: 'Amazon', year: '2024' },
  { name: 'TensorFlow Developer', issuer: 'Google', year: '2023' },
  { name: 'Deep Learning Specialization', issuer: 'deeplearning.ai', year: '2022' },
]

const publications = [
  {
    title: 'Efficient Attention Mechanisms for Vision Transformers',
    venue: 'NeurIPS 2024',
    citations: 45,
  },
  {
    title: 'Self-Supervised Learning for Medical Image Analysis',
    venue: 'CVPR 2023',
    citations: 128,
  },
  {
    title: 'Scalable Neural Architecture Search',
    venue: 'ICML 2023',
    citations: 89,
  },
]

export function SkillsSection({ isHorizontal }: SkillsSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="skills"
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
          <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase">Skills & Expertise</span>
        </motion.div>

        <div className={cn(
          'grid gap-8',
          isHorizontal ? 'grid-cols-3 h-[70vh]' : 'grid-cols-1 lg:grid-cols-3'
        )}>
          {/* Skills Bars */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={cn(
              'bg-card rounded-2xl border border-border p-8 overflow-y-auto',
              isHorizontal && 'row-span-2'
            )}
          >
            {skillCategories.map((category, catIndex) => (
              <div key={category.title} className={cn(catIndex > 0 && 'mt-10')}>
                <h3 className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase mb-6">
                  {category.title}
                </h3>
                <div className="space-y-5">
                  {category.skills.map((skill, index) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-foreground">{skill.name}</span>
                        <span className="text-xs font-mono text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : {}}
                          transition={{ duration: 1, delay: 0.3 + catIndex * 0.2 + index * 0.1 }}
                          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-card rounded-2xl border border-border p-8"
          >
            <h3 className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase mb-8">
              Certifications
            </h3>

            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="group p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {cert.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      <p className="text-xs font-mono text-muted-foreground/70 mt-1">{cert.year}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Learning Now */}
            <div className="mt-8 p-4 border border-dashed border-border rounded-xl">
              <h4 className="text-xs font-mono text-muted-foreground tracking-wider uppercase mb-3">
                Currently Learning
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Rust', 'Mojo', 'WebGPU', 'Quantum ML'].map((item) => (
                  <span key={item} className="text-xs px-3 py-1.5 rounded-full bg-secondary text-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Publications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={cn(
              'bg-card rounded-2xl border border-border p-8',
              isHorizontal && 'row-span-2'
            )}
          >
            <h3 className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase mb-8">
              Research & Publications
            </h3>

            <div className="space-y-6">
              {publications.map((pub, index) => (
                <motion.div
                  key={pub.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-full bg-primary/30 rounded-full" />
                    <div>
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                        {pub.title}
                      </h4>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-primary">{pub.venue}</span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                          </svg>
                          {pub.citations} citations
                        </span>
                      </div>
                    </div>
                  </div>
                  {index < publications.length - 1 && (
                    <div className="h-px bg-border/50 mt-6" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { value: '15+', label: 'Papers' },
                { value: '500+', label: 'Citations' },
                { value: '3', label: 'Patents' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-secondary/30 rounded-xl">
                  <div className="text-xl font-medium text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Reviewer */}
            <div className="mt-8">
              <h4 className="text-xs font-mono text-muted-foreground tracking-wider uppercase mb-4">
                Reviewer For
              </h4>
              <div className="flex flex-wrap gap-2">
                {['NeurIPS', 'ICML', 'CVPR', 'ICLR', 'ACL'].map((conf) => (
                  <span key={conf} className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground">
                    {conf}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
