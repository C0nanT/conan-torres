'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Clock } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent, PointerEvent } from 'react'

const HOVER_CLOSE_DELAY_MS = 150

type FreshnessClockProps = {
  text: string
}

export function FreshnessClock({ text }: FreshnessClockProps) {
  const [isOpen, setIsOpen] = useState(false)
  // True while the popover is open only because the mouse is hovering it.
  const isHoverOpenRef = useRef(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>()

  const cancelHoverClose = () => {
    clearTimeout(closeTimerRef.current)
  }

  useEffect(() => () => clearTimeout(closeTimerRef.current), [])

  const handleOpenChange = (isNextOpen: boolean) => {
    cancelHoverClose()
    isHoverOpenRef.current = false
    setIsOpen(isNextOpen)
  }

  // Hover only for mouse; touch and keyboard go through click/Enter.
  const handlePointerEnter = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') {
      return
    }
    cancelHoverClose()
    if (!isOpen) {
      isHoverOpenRef.current = true
      setIsOpen(true)
    }
  }

  // Delayed so the pointer can cross from the trigger into the content.
  const handlePointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || !isHoverOpenRef.current) {
      return
    }
    cancelHoverClose()
    closeTimerRef.current = setTimeout(() => {
      isHoverOpenRef.current = false
      setIsOpen(false)
    }, HOVER_CLOSE_DELAY_MS)
  }

  // A click on a hover-opened popover pins it open instead of toggling it.
  const handleTriggerClick = (event: MouseEvent) => {
    if (isHoverOpenRef.current) {
      event.preventDefault()
      cancelHoverClose()
      isHoverOpenRef.current = false
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild={true}>
        <button
          type="button"
          aria-label="Ver data de atualização dos números"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onClick={handleTriggerClick}
          className="ml-1 inline-flex size-6 cursor-default items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Clock className="size-3.5" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto px-3 py-2 text-sm"
        side="top"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {text}
      </PopoverContent>
    </Popover>
  )
}
