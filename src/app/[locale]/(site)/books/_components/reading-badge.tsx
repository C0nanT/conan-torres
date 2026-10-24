'use client'

import { Badge } from '@/components/ui/badge'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const TYPE_DELAY_MS = 140
const HOLD_TICKS = 8
const DOTS = 3

// Loop: types the label letter by letter, then the three dots one by one
// (each hops once as it appears), holds, and erases everything. The full text
// The badge grows and shrinks with the text: the content width is measured
// and eased through a CSS width transition.
export function ReadingBadge({ label }: { label: string }) {
  const isStill = useReducedMotion() ?? false
  const total = label.length + DOTS
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (isStill) {
      return
    }
    const id = setInterval(() => setTick((t) => t + 1), TYPE_DELAY_MS)
    return () => clearInterval(id)
  }, [isStill])

  const cycle = total * 2 + HOLD_TICKS
  const position = tick % cycle
  let typed = total
  if (!isStill) {
    if (position < total) {
      typed = position
    } else if (position >= total + HOLD_TICKS) {
      typed = cycle - position
    }
  }

  const dotsShown = Math.max(0, typed - label.length)
  const contentRef = useRef<HTMLSpanElement>(null)
  const [width, setWidth] = useState(0)

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure on every typed change
  useLayoutEffect(() => {
    setWidth(contentRef.current?.offsetWidth ?? 0)
  }, [typed])

  return (
    <Badge variant="outline">
      <span
        aria-label={`${label}...`}
        className="inline-flex whitespace-nowrap transition-[width] duration-150 ease-linear motion-reduce:transition-none [overflow-x:clip]"
        style={{ width }}
      >
        <span
          ref={contentRef}
          aria-hidden={true}
          className="inline-flex w-max shrink-0"
        >
          {'\u200b'}
          {label.slice(0, typed)}
          {Array.from({ length: dotsShown }, (_, i) => (
            <motion.span
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length dots
              key={i}
              animate={isStill ? undefined : { y: [0, -4, 0] }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              .
            </motion.span>
          ))}
        </span>
      </span>
    </Badge>
  )
}
