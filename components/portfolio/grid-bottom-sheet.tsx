'use client'

/**
 * GridBottomSheet
 * ───────────────
 * A bottom sheet confined to its parent grid container.
 *
 * Behaviour:
 *  - Slides up from the bottom of the grid (position: absolute)
 *  - Curved top corners + frosted glass → the list behind shows through
 *  - Drag handle: click to close OR drag down past threshold to dismiss
 *  - Pointer events (mouse + touch) for drag
 *  - Sheet stays fully within the grid — never breaks out to page level
 *  - Full dark / light theme support via CSS variables
 */

import { useRef, useEffect, useCallback, useState, ReactNode, PointerEvent } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'

interface GridBottomSheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  /** Accent color for the handle tint — optional */
  accentColor?: string
  /** How much of the sheet is visible when open — default covers ~92% of container */
  peekHeight?: string
}

const DRAG_CLOSE_THRESHOLD = 80 // px downward drag to auto-dismiss
const SPRING = { type: 'spring' as const, stiffness: 380, damping: 36, mass: 0.9 }

export function GridBottomSheet({
  open,
  onClose,
  children,
  accentColor = 'var(--border-hover)',
  peekHeight = '92%',
}: GridBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartY = useRef(0)
  const dragCurrentY = useRef(0)
  const y = useMotionValue(0)

  // Reset drag offset whenever the sheet opens
  useEffect(() => {
    if (open) y.set(0)
  }, [open, y])

  // ── Pointer drag handlers ──────────────────────────────────────────────────

  const onPointerDown = useCallback((e: PointerEvent) => {
    setIsDragging(true)
    dragStartY.current = e.clientY
    dragCurrentY.current = 0
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    e.preventDefault()
  }, [])

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return
      const delta = e.clientY - dragStartY.current
      const clamped = Math.max(0, delta) // only allow downward drag
      dragCurrentY.current = clamped
      y.set(clamped)
    },
    [isDragging, y],
  )

  const onPointerUp = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return
      setIsDragging(false)
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)

      if (dragCurrentY.current > DRAG_CLOSE_THRESHOLD) {
        onClose()
      } else {
        y.set(0) // snap back
      }
      dragCurrentY.current = 0
    },
    [isDragging, onClose, y],
  )

  const backdropOpacity = useTransform(y, [0, DRAG_CLOSE_THRESHOLD * 2], [1, 0])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Frosted backdrop — lets list show through ── */}
          <motion.div
            key="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              opacity: backdropOpacity as unknown as number,
              pointerEvents: 'none',
            }}
          />

          {/* ── The sheet itself ── */}
          <motion.div
            key="sheet-panel"
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={SPRING}
            style={{
              y,
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: peekHeight,
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '20px 20px 0 0',
              background: 'var(--background)',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              border: 'none',
              boxShadow: 'none',
              overflow: 'hidden',
              willChange: 'transform',
            }}
          >
            {/* Drag handle zone */}
            <div
              className="flex-shrink-0 flex flex-col items-center"
              style={{
                paddingTop: 10,
                paddingBottom: 8,
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                touchAction: 'none',
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              title="Drag to dismiss"
              role="button"
              aria-label="Drag to close or click to dismiss"
              onClick={() => {
                if (dragCurrentY.current < 5) onClose()
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 9999,
                  background: accentColor,
                  opacity: isDragging ? 0.9 : 0.5,
                  transition: 'opacity 0.15s ease',
                  boxShadow: isDragging ? `0 0 8px ${accentColor}` : 'none',
                }}
              />
            </div>

            {/* ── Scrollable content — caller fills this ── */}
            <div className="flex-1 flex flex-col min-h-0" style={{ overflow: 'hidden' }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}