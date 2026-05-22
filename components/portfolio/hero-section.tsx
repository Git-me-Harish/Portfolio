'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { NeuralNetwork3D } from './neural-network-3d'

interface HeroSectionProps {
  isHorizontal?: boolean
}

export function HeroSection({ isHorizontal }: HeroSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section
      id="hero"
      ref={ref}
      className={cn(
        'relative flex flex-col justify-center overflow-hidden',
        isHorizontal 
          ? 'min-w-screen h-screen px-8 lg:px-16 shrink-0' 
          : 'min-h-screen px-5 py-24'
      )}
      style={isHorizontal ? { scrollSnapAlign: 'start', width: '100vw' } : undefined}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-60">
        <NeuralNetwork3D />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
          </span>
          <span className="text-sm font-mono text-muted-foreground tracking-wider uppercase">
            Available for new opportunities
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-[0.95] tracking-tight mb-8"
        >
          <span className="block text-foreground">Building</span>
          <span className="block text-gradient mt-2">Intelligent Systems</span>
          <span className="block text-muted-foreground/70 mt-2">That Learn & Adapt</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-12"
        >
          AI/ML Engineer & Data Scientist specializing in deep learning, 
          computer vision, and transforming complex data into actionable insights. 
          Creating models that push the boundaries of what machines can learn.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium flex items-center gap-3 glow-primary"
          >
            View My Work
            <svg 
              className="w-5 h-5 transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
          
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 border border-border rounded-full font-medium text-foreground hover:bg-card transition-colors"
          >
            Contact Me
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap gap-12 mt-16 pt-8 border-t border-border/50"
        >
          {[
            { value: '5+', label: 'Years Experience' },
            { value: '50+', label: 'ML Models Deployed' },
            { value: '15+', label: 'Research Papers' },
            { value: '99.2%', label: 'Model Accuracy' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className="group"
            >
              <div className="text-3xl md:text-4xl font-light text-foreground group-hover:text-primary transition-colors">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1 font-mono tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator - only on first section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1 }}
        className={cn(
          'absolute bottom-8 flex flex-col items-center gap-2',
          isHorizontal ? 'right-8' : 'left-1/2 -translate-x-1/2'
        )}
      >
        <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
          {isHorizontal ? 'Scroll Right' : 'Scroll Down'}
        </span>
        <motion.div
          animate={{ 
            x: isHorizontal ? [0, 10, 0] : 0,
            y: isHorizontal ? 0 : [0, 10, 0]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  )
}
