'use client'

import { Button } from '@/components/ui/button'
import {
  HIGHLIGHT_COLORS,
  type HighlightColor,
  MAX_HIGHLIGHT_NOTE,
} from '@/lib/highlight-rules'
import { cn } from '@/lib/shadcn'
import { Highlighter } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { HIGHLIGHT_PAINT } from './highlight-colors'
import type { TextSelection } from './use-text-selection'

// Appears while text is selected: first just "Grifar", then colour and note.
// The viewer freezes selection tracking while `isOpen`, because tapping here
// clears the browser's selection.
export function HighlightComposer({
  selection,
  isOpen,
  onOpenChange,
  onSave,
}: {
  selection: TextSelection
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSave: (color: HighlightColor, note: string) => Promise<boolean>
}) {
  const t = useTranslations('reader.highlights')
  const [color, setColor] = useState<HighlightColor>('yellow')
  const [note, setNote] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    startTransition(async () => {
      const isSaved = await onSave(color, note)
      if (isSaved) {
        setNote('')
        onOpenChange(false)
      }
    })
  }

  return (
    <section
      aria-label={t('composerLabel')}
      className="fixed inset-x-2 bottom-2 z-30 mx-auto max-w-md rounded-xl border bg-background p-3 shadow-lg motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4"
    >
      {isOpen ? (
        <div className="flex flex-col gap-3">
          <p className="line-clamp-2 text-muted-foreground text-sm">
            “{selection.text}”
          </p>
          <fieldset className="flex items-center gap-3">
            <legend className="sr-only">{t('colorLabel')}</legend>
            {HIGHLIGHT_COLORS.map((option) => (
              <label
                key={option}
                className="relative flex h-11 w-11 cursor-pointer items-center justify-center"
              >
                <input
                  type="radio"
                  name="highlight-color"
                  value={option}
                  checked={color === option}
                  onChange={() => setColor(option)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    'h-8 w-8 rounded-full border-2 border-transparent peer-checked:border-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring',
                    'motion-safe:transition-transform motion-safe:peer-checked:scale-110'
                  )}
                  style={{ backgroundColor: HIGHLIGHT_PAINT[option].solid }}
                />
                <span className="sr-only">{t(`colors.${option}`)}</span>
              </label>
            ))}
          </fieldset>
          <textarea
            value={note}
            maxLength={MAX_HIGHLIGHT_NOTE}
            rows={2}
            placeholder={t('notePlaceholder')}
            aria-label={t('noteLabel')}
            onChange={(event) => setNote(event.target.value)}
            className="w-full resize-none rounded-md border bg-background p-2 text-base"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              {t('cancel')}
            </Button>
            <Button type="button" disabled={isPending} onClick={handleSave}>
              {isPending ? t('saving') : t('save')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <p className="line-clamp-2 min-w-0 text-muted-foreground text-sm">
            {selection.isTooLong ? t('tooLong') : `“${selection.text}”`}
          </p>
          <Button
            type="button"
            disabled={selection.isTooLong}
            // Keeps the browser's selection alive until the click lands.
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => onOpenChange(true)}
          >
            <Highlighter className="mr-2 h-4 w-4" />
            {t('action')}
          </Button>
        </div>
      )}
    </section>
  )
}
