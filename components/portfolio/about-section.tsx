'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AboutSectionProps {
  isHorizontal?: boolean
}

const roles = [
  { title: 'AI/ML Engineer', desc: 'Building production-ready ML systems' },
  { title: 'Data Scientist', desc: 'Extracting insights from complex data' },
  { title: 'Deep Learning', desc: 'Neural networks & computer vision' },
  { title: 'Research', desc: 'Publishing & advancing the field' },
]

const traits = [
  { label: 'FOCUS', value: 'Deep Learning, NLP, Computer Vision' },
  { label: 'STACK', value: 'Python, PyTorch, TensorFlow, Scikit-learn' },
  { label: 'TOOLS', value: 'MLflow, Kubernetes, AWS, Docker' },
  { label: 'RESEARCH', value: 'Transformers, GANs, Reinforcement Learning' },
  { label: 'LOCATION', value: 'Remote / San Francisco' },
]

export function AboutSection({ isHorizontal }: AboutSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section
      id="about"
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
          <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase">About Me</span>
        </motion.div>

        <div className={cn(
          'grid gap-8',
          isHorizontal ? 'grid-cols-3 h-[70vh]' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        )}>
          {/* Main About Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={cn(
              'bg-card rounded-2xl border border-border p-8 card-hover relative overflow-hidden',
              isHorizontal && 'row-span-2'
            )}
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            
            {/* Profile image placeholder - stylized */}
            <div className="relative w-full aspect-square max-w-[280px] mb-8 rounded-xl overflow-hidden bg-secondary">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              <div className="absolute inset-0 grid-pattern opacity-30" />
              {/* ASCII art style avatar representation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-primary/30 font-mono text-xs leading-none whitespace-pre select-none">
{`    ████████████████    
  ████████████████████  
 ██████████████████████ 
██████████  ████████████
████████      ██████████
███████  ████  █████████
███████  ████  █████████
████████      ██████████
██████████  ████████████
 ██████████████████████ 
  ████████████████████  
   ██████████████████   
    ████████████████    
   ██████████████████   
  ████████████████████  `}
                </div>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-light leading-tight mb-6">
              {"Hey, I'm building the future of AI — one model at a time."}
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {"I'm an AI/ML Engineer passionate about transforming complex data into intelligent systems. My work spans deep learning architectures, NLP models, and production-ready ML pipelines that scale."}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors flex items-center gap-2"
              >
                <span>Copy email</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </motion.button>
            </div>
          </motion.div>

          {/* Role Cards */}
          <div className={cn(
            'grid gap-4',
            isHorizontal ? 'grid-rows-4' : 'grid-cols-1'
          )}>
            {roles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="bg-card rounded-xl border border-border p-5 card-hover group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-150 transition-transform" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{role.title}</h3>
                    <p className="text-sm text-muted-foreground">{role.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Traits Card */}
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
              Details
            </h3>
            
            <div className="space-y-6">
              {traits.map((trait, index) => (
                <motion.div
                  key={trait.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="group"
                >
                  <div className="text-xs font-mono text-muted-foreground tracking-wider mb-1.5">
                    {trait.label}
                  </div>
                  <div className="text-foreground group-hover:text-primary transition-colors">
                    {trait.value}
                  </div>
                  {index < traits.length - 1 && (
                    <div className="h-px bg-border/50 mt-6" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
