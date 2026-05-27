'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AboutGrid } from '@/components/portfolio/grids/about-grid'
import { CareerGrid } from '@/components/portfolio/grids/career-grid'
import { WorkGrid } from '@/components/portfolio/grids/work-grid'
import { ProjectsGrid } from '@/components/portfolio/grids/projects-grid'
import { AchievementsGrid } from '@/components/portfolio/grids/achievements-grid'
import { IdeasGrid } from '@/components/portfolio/grids/ideas-grid'
import { KnowMoreGrid } from '@/components/portfolio/grids/know-more-grid'
import { MagneticCursor } from '@/components/portfolio/magnetic-cursor'
import { ThemeToggle } from '@/components/portfolio/theme-toggle'

const MOBILE_BP = 768

export default function Portfolio() {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < MOBILE_BP)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const checkScroll = useCallback(() => {
    const c = containerRef.current
    if (!c) return
    setCanScrollLeft(c.scrollLeft > 10)
    setCanScrollRight(c.scrollLeft < c.scrollWidth - c.clientWidth - 10)
  }, [])

  useEffect(() => {
    const c = containerRef.current
    if (!c || !mounted || isMobile) return

    c.addEventListener('scroll', checkScroll, { passive: true })
    checkScroll()

    const onWheel = (e: WheelEvent) => {
      // Pure horizontal trackpad gesture — let browser handle
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

      // Check whether the event target sits inside a scrollable child
      const target = e.target as HTMLElement
      const scrollableChild = target.closest('[data-grid-scroll]') as HTMLElement | null

      if (scrollableChild) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableChild
        const atTop = scrollTop <= 0
        const atBottom = scrollTop + clientHeight >= scrollHeight - 1

        // If the child can absorb this scroll direction, let it
        if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
          return // child will scroll
        }
      }

      // Otherwise convert vertical wheel → horizontal page scroll
      e.preventDefault()
      const multiplier = e.deltaMode === 1 ? 20 : e.deltaMode === 2 ? c.clientWidth : 1
      c.scrollLeft += e.deltaY * multiplier
    }

    c.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      c.removeEventListener('scroll', checkScroll)
      c.removeEventListener('wheel', onWheel)
    }
  }, [mounted, isMobile, checkScroll])

  const scrollBy = (dir: 'left' | 'right') => {
    const c = containerRef.current
    if (!c) return
    c.scrollBy({
      left: dir === 'right' ? window.innerWidth * 0.4 : -(window.innerWidth * 0.4),
      behavior: 'smooth',
    })
  }

  if (!mounted) return (
    <div className="h-screen w-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div
        className="w-5 h-5 rounded-full border border-t-transparent animate-spin"
        style={{ borderColor: 'var(--border-hover)', borderTopColor: 'transparent' }}
      />
    </div>
  )

  /* Mobile layout */
  if (isMobile) return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 py-3.5 backdrop-blur-md border-b"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)', opacity: 0.97 }}
      >
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Sri Harish</span>
        <ThemeToggle />
      </header>
      <div className="px-4 py-4 space-y-4 pb-12">
        <AboutGrid isMobile />
        <CareerGrid isMobile />
        <WorkGrid isMobile />
        <ProjectsGrid isMobile />
        {/* Achievements before Ideas */}
        <AchievementsGrid isMobile />
        <IdeasGrid isMobile />
        {/* Know More after Ideas ── */}
        <KnowMoreGrid isMobile />
      </div>
    </main>
  )

  /* ── Desktop layout ── */
  return (
    <main className="h-screen relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Ambient gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse at 15% 50%, rgba(0,180,120,0.03) 0%, transparent 55%),
                           radial-gradient(ellipse at 85% 50%, rgba(40,100,220,0.03) 0%, transparent 55%)`,
        }}
      />

      <MagneticCursor />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5">
        <motion.span
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          Sri Harish
        </motion.span>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-2.5"
        >
          <ThemeToggle />

          {/* Navigation arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollBy('left')}
              disabled={!canScrollLeft}
              className="btn-capsule-icon"
              aria-label="Scroll left"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => scrollBy('right')}
              disabled={!canScrollRight}
              className="btn-capsule-icon"
              aria-label="Scroll right"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </motion.div>
      </header>

      {/* Horizontal scroll track
          overflow-y is "hidden" on the TRACK but each grid card manages its own
          internal overflow-y scroll via data-grid-scroll sentinel elements.      */}
      <div
        ref={containerRef}
        className="h-full pt-[68px] pb-5 px-5 flex gap-3.5 overflow-x-auto overflow-y-hidden no-scrollbar"
      >
        <AboutGrid />
        <CareerGrid />
        <WorkGrid />
        <ProjectsGrid />
        {/* Achievements before Ideas */}
        <AchievementsGrid />
        <IdeasGrid />
        {/* Know More after Ideas */}
        <KnowMoreGrid />
        <div className="flex-shrink-0 w-1" />
      </div>
    </main>
  )
}