'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ContactSectionProps {
  isHorizontal?: boolean
}

export function ContactSection({ isHorizontal }: ContactSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText('hello@ai-engineer.dev')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      id="contact"
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
        <div className={cn(
          'grid gap-8',
          isHorizontal ? 'grid-cols-2 h-[70vh]' : 'grid-cols-1 lg:grid-cols-2'
        )}>
          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase mb-8">Get In Touch</span>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-8">
              <span className="text-foreground">{"Let's build"}</span>
              <br />
              <span className="text-gradient">something intelligent</span>
              <br />
              <span className="text-muted-foreground/70">together.</span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-lg mb-12">
              {"I'm always excited to discuss new AI/ML projects, research collaborations, or opportunities to push the boundaries of what's possible with intelligent systems."}
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                onClick={copyEmail}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium flex items-center gap-3 glow-primary"
              >
                {copied ? 'Copied!' : 'Copy Email'}
                <svg 
                  className="w-5 h-5 transition-transform group-hover:scale-110" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {copied ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  )}
                </svg>
              </motion.button>

              <motion.a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 border border-border rounded-full font-medium text-foreground hover:bg-card transition-colors flex items-center gap-3"
              >
                Schedule a Call
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </motion.a>
            </div>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid gap-4">
            {/* Social Links Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-card rounded-2xl border border-border p-8"
            >
              <h3 className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase mb-6">
                Connect
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { 
                    name: 'GitHub', 
                    handle: '@ai-engineer',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    ),
                  },
                  { 
                    name: 'LinkedIn', 
                    handle: '/in/ai-engineer',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    ),
                  },
                  { 
                    name: 'X (Twitter)', 
                    handle: '@ai_engineer',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    ),
                  },
                  { 
                    name: 'Google Scholar', 
                    handle: 'AI Engineer',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
                      </svg>
                    ),
                  },
                ].map((social, index) => (
                  <motion.a
                    key={social.name}
                    href="#"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="group flex items-center gap-4 p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                      {social.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {social.name}
                      </div>
                      <div className="text-xs text-muted-foreground">{social.handle}</div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-card rounded-2xl border border-border p-8"
            >
              <h3 className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase mb-6">
                Quick Links
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Resume / CV', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                  { label: 'Research', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                  { label: 'Blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
                  { label: 'Tutorials', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                ].map((link) => (
                  <motion.a
                    key={link.label}
                    href="#"
                    whileHover={{ scale: 1.02 }}
                    className="group flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                    </svg>
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">{link.label}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center justify-between text-xs text-muted-foreground py-4"
            >
              <span>Built with Next.js, Framer Motion & Three.js</span>
              <span>2024</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
