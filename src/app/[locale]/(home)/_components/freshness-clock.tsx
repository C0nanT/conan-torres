'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Clock } from 'lucide-react'
import { useState } from 'react'
import type { PointerEvent } from 'react'

type FreshnessClockProps = {
  text: string
}

export function FreshnessClock({ text }: FreshnessClockProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Hover only for mouse; touch and keyboard go through click/Enter.
  const handlePointerEnter = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') {
      setIsOpen(true)
    }
  }
  const handlePointerLeave = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') {
      setIsOpen(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild={true}>
        <button
          type="button"
          aria-label="Ver data de atualização dos números"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          className="ml-1 inline-flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Clock className="size-3.5" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto px-3 py-2 text-sm" side="top">
        {text}
      </PopoverContent>
    </Popover>
  )
}
