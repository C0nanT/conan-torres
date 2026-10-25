'use client'

import { Button } from '@/components/ui/button'
import { Link } from '@/lib/navigation'
import { ArrowLeft, LogOut, Minus, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { logout } from '../actions'
import { SavePageForm } from './save-page-form'
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP, clamp } from './viewer-limits'

export function PdfToolbar({
  bookId,
  page,
  total,
  zoom,
  onPageChange,
  onZoomChange,
}: {
  bookId: string
  page: number
  total: number
  zoom: number
  onPageChange: (page: number) => void
  onZoomChange: (zoom: number) => void
}) {
  const t = useTranslations('reader')
  const [draft, setDraft] = useState(String(page))

  useEffect(() => {
    setDraft(String(page))
  }, [page])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const target = Number.parseInt(draft, 10)
    if (Number.isNaN(target)) {
      setDraft(String(page))
      return
    }
    onPageChange(clamp(target, 1, total))
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b bg-background px-2 py-1.5">
      <Button asChild={true} variant="ghost" size="sm">
        <Link href="/books" aria-label={t('back')}>
          <ArrowLeft className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{t('back')}</span>
        </Link>
      </Button>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={t('previousPage')}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          ‹
        </Button>
        <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={total}
            value={draft}
            aria-label={t('goToPage')}
            onChange={(event) => setDraft(event.target.value)}
            className="h-8 w-14 rounded-md border bg-background px-1 text-center text-sm"
          />
          <span className="whitespace-nowrap text-muted-foreground text-sm">
            {t('pageOf', { total })}
          </span>
        </form>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={t('nextPage')}
          disabled={page >= total}
          onClick={() => onPageChange(page + 1)}
        >
          ›
        </Button>
      </div>

      <SavePageForm bookId={bookId} page={page} total={total} />

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={t('zoomOut')}
          disabled={zoom <= MIN_ZOOM}
          onClick={() => onZoomChange(zoom - ZOOM_STEP)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span
          className="w-12 text-center text-muted-foreground text-sm tabular-nums"
          title={t('zoomLevel', { percent: Math.round(zoom * 100) })}
        >
          {Math.round(zoom * 100)}%
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={t('zoomIn')}
          disabled={zoom >= MAX_ZOOM}
          onClick={() => onZoomChange(zoom + ZOOM_STEP)}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <form action={logout}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            aria-label={t('signOut')}
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('signOut')}</span>
          </Button>
        </form>
      </div>
    </header>
  )
}
