'use client'

import { useEffect, useState, RefObject } from 'react'
import { motion } from 'framer-motion'

interface ScrollProgressProps {
  horizontal?: boolean
  containerRef?: RefObject<HTMLDivElement | null>
}

export function ScrollProgress({ horizontal, containerRef }: ScrollProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (horizontal && containerRef?.current) {
      const container = containerRef.current
      
      const handleScroll = () => {
        const scrollWidth = container.scrollWidth - container.clientWidth
        const scrolled = scrollWidth > 0 ? container.scrollLeft / scrollWidth : 0
        setProgress(scrolled)
      }

      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    } else {
      const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrolled = scrollHeight > 0 ? window.scrollY / scrollHeight : 0
        setProgress(scrolled)
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [horizontal, containerRef])

  const sections = ['Home', 'About', 'Journey', 'Work', 'Skills', 'Contact']
  const currentSection = Math.min(Math.floor(progress * sections.length), sections.length - 1)

  return (
    <>
      {/* Progress bar */}
      <div className={`fixed z-50 ${horizontal ? 'bottom-6 left-1/2 -translate-x-1/2 w-64 h-1' : 'top-1/2 right-6 -translate-y-1/2 w-1 h-64'}`}>
        <div className="w-full h-full bg-border/30 rounded-full overflow-hidden">
          <motion.div
            className="bg-primary rounded-full"
            initial={false}
            animate={horizontal ? {
              width: `${progress * 100}%`,
              height: '100%',
            } : {
              height: `${progress * 100}%`,
              width: '100%',
            }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Section dots */}
      <div className={`fixed z-50 hidden md:flex ${horizontal ? 'bottom-6 right-8 flex-row gap-3' : 'top-1/2 right-6 -translate-y-1/2 flex-col gap-3'}`}>
        {sections.map((section, index) => (
          <motion.button
            key={section}
            className={`group relative w-3 h-3 rounded-full transition-colors ${
              currentSection === index ? 'bg-primary' : 'bg-border hover:bg-primary/50'
            }`}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className={`absolute ${horizontal ? 'bottom-full mb-2 left-1/2 -translate-x-1/2' : 'right-full mr-3 top-1/2 -translate-y-1/2'} text-xs font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
              {section}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Current section indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 left-6 z-50 hidden md:flex items-center gap-3"
      >
        <span className="text-xs font-mono text-muted-foreground tracking-wider">
          {String(currentSection + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
        </span>
        <span className="w-8 h-px bg-border" />
        <span className="text-xs font-mono text-primary tracking-wider uppercase">
          {sections[currentSection]}
        </span>
      </motion.div>
    </>
  )
}
