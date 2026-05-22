'use client'

import { motion, useAnimation, Variants } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'

interface AnimatedTextProps {
  text: string
  className?: string
  once?: boolean
  delay?: number
}

const letterVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    rotateX: -90,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.5,
      ease: [0.6, 0.01, 0.05, 0.95],
    },
  }),
}

export function AnimatedText({ text, className = '', once = true, delay = 0 }: AnimatedTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, amount: 0.5 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  const words = text.split(' ')

  return (
    <span ref={ref} className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-[0.25em]">
          {word.split('').map((char, charIndex) => {
            const globalIndex = words
              .slice(0, wordIndex)
              .reduce((acc, w) => acc + w.length, 0) + charIndex + wordIndex
            
            return (
              <motion.span
                key={charIndex}
                custom={globalIndex + delay * 10}
                variants={letterVariants}
                initial="hidden"
                animate={controls}
                className="inline-block"
                style={{ transformOrigin: 'bottom' }}
              >
                {char}
              </motion.span>
            )
          })}
        </span>
      ))}
    </span>
  )
}

interface AnimatedParagraphProps {
  text: string
  className?: string
  once?: boolean
}

const wordVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    filter: 'blur(4px)',
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.05,
      duration: 0.6,
      ease: [0.6, 0.01, 0.05, 0.95],
    },
  }),
}

export function AnimatedParagraph({ text, className = '', once = true }: AnimatedParagraphProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const isInView = useInView(ref, { once, amount: 0.3 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  const words = text.split(' ')

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          custom={index}
          variants={wordVariants}
          initial="hidden"
          animate={controls}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}

interface CountUpProps {
  end: number
  suffix?: string
  prefix?: string
  className?: string
  duration?: number
}

export function CountUp({ end, suffix = '', prefix = '', className = '', duration = 2 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        transition: { duration: 0.3 },
      })
    }
  }, [isInView, controls])

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={controls}
      className={className}
    >
      {prefix}
      {isInView ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CountUpNumber end={end} duration={duration} />
        </motion.span>
      ) : (
        '0'
      )}
      {suffix}
    </motion.span>
  )
}

function CountUpNumber({ end, duration }: { end: number; duration: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = nodeRef.current
    if (!node) return

    const startTime = performance.now()
    const startValue = 0

    const updateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      
      // Ease out quad
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.floor(startValue + (end - startValue) * easeOut)
      
      node.textContent = currentValue.toString()
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber)
      } else {
        node.textContent = end.toString()
      }
    }

    requestAnimationFrame(updateNumber)
  }, [end, duration])

  return <span ref={nodeRef}>0</span>
}
