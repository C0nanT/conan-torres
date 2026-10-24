'use client'

import { Button } from '@/components/ui/button'
import type { Highlight } from '@/lib/highlight-rules'
import { Trash2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { HIGHLIGHT_PAINT } from './highlight-colors'

const ARM_MS = 4000

function HighlightItem({
  highlight,
  isCurrentPage,
  onJump,
  onRemove,
}: {
  highlight: Highlight
  isCurrentPage: boolean
  onJump: (page: number) => void
  onRemove: (id: string) => Promise<boolean>
}) {
  const t = useTranslations('reader.highlights')
  // Deleting takes two taps: the first arms the button for a few seconds.
  const [isArmed, setIsArmed] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    if (!isArmed) {
      return
    }
    const timer = setTimeout(() => setIsArmed(false), ARM_MS)
    return () => clearTimeout(timer)
  }, [isArmed])

  const handleRemove = async () => {
    setIsRemoving(true)
    const isRemoved = await onRemove(highlight.id)
    if (!isRemoved) {
      setIsRemoving(false)
      setIsArmed(false)
    }
  }

  return (
    <li className="flex gap-2 border-b py-2 pr-1 pl-3 last:border-b-0">
      <button
        type="button"
        onClick={() => onJump(highlight.page)}
        aria-current={isCurrentPage ? 'page' : undefined}
        className="flex min-h-11 min-w-0 flex-1 flex-col gap-1 rounded-md border-l-4 pl-2 text-left hover:bg-accent"
        style={{ borderLeftColor: HIGHLIGHT_PAINT[highlight.color].solid }}
      >
        <span className="text-muted-foreground text-xs">
          {t('pageShort', { page: highlight.page })} ·{' '}
          {t(`colors.${highlight.color}`)}
        </span>
        <span className="line-clamp-3 break-words text-sm">
          “{highlight.text}”
        </span>
        {highlight.note && (
          <span className="line-clamp-3 break-words text-muted-foreground text-sm italic">
            {highlight.note}
          </span>
        )}
      </button>
      <div className="flex shrink-0 flex-col items-end gap-1">
        {isArmed ? (
          <>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={isRemoving}
              onClick={handleRemove}
            >
              {t('confirmDelete')}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={isRemoving}
              onClick={() => setIsArmed(false)}
            >
              {t('cancel')}
            </Button>
          </>
        ) : (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={t('delete')}
            onClick={() => setIsArmed(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </li>
  )
}

// Bottom sheet on phones, side column from md up.
export function HighlightsPanel({
  highlights,
  currentPage,
  onJump,
  onRemove,
  onClose,
}: {
  highlights: Highlight[]
  currentPage: number
  onJump: (page: number) => void
  onRemove: (id: string) => Promise<boolean>
  onClose: () => void
}) {
  const t = useTranslations('reader.highlights')

  return (
    <>
      <button
        type="button"
        aria-label={t('close')}
        onClick={onClose}
        className="fixed inset-0 z-30 bg-black/40 md:hidden motion-safe:animate-in motion-safe:fade-in"
      />
      <aside
        aria-label={t('title')}
        className="fixed inset-x-0 bottom-0 z-40 flex max-h-[70dvh] flex-col rounded-t-xl border-t bg-background shadow-xl max-md:motion-safe:animate-in max-md:motion-safe:slide-in-from-bottom md:motion-safe:animate-in md:motion-safe:slide-in-from-right md:static md:z-auto md:max-h-none md:w-80 md:shrink-0 md:rounded-none md:border-t-0 md:border-l md:shadow-none"
      >
        <div className="flex items-center justify-between border-b px-3 py-1">
          <h2 className="font-medium text-sm">
            {t('title')} ({highlights.length})
          </h2>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={t('close')}
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {highlights.length === 0 ? (
          <p className="p-4 text-muted-foreground text-sm">{t('empty')}</p>
        ) : (
          <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {highlights.map((highlight) => (
              <HighlightItem
                key={highlight.id}
                highlight={highlight}
                isCurrentPage={highlight.page === currentPage}
                onJump={onJump}
                onRemove={onRemove}
              />
            ))}
          </ul>
        )}
      </aside>
    </>
  )
}
