'use client'

import { Button } from '@/components/ui/button'
import type { Highlight, HighlightColor } from '@/lib/highlight-rules'
import { Link } from '@/lib/navigation'
import {
  ArrowLeft,
  Download,
  Highlighter,
  LogOut,
  Minus,
  Plus,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { logout, reportTotalPages } from '../actions'
import { HighlightComposer } from './highlight-composer'
import { HighlightLayer } from './highlight-layer'
import { HighlightsPanel } from './highlights-panel'
import { SavePageForm } from './save-page-form'
import { useHighlights } from './use-highlights'
import { useTextSelection } from './use-text-selection'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const MIN_ZOOM = 0.5
const MAX_ZOOM = 3
const ZOOM_STEP = 0.25
const MAX_PAGE_WIDTH = 900

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry?.contentRect.width ?? 0)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, width }
}

function Toolbar({
  bookId,
  page,
  total,
  zoom,
  highlightCount,
  isPanelOpen,
  onPageChange,
  onZoomChange,
  onTogglePanel,
}: {
  bookId: string
  page: number
  total: number
  zoom: number
  highlightCount: number
  isPanelOpen: boolean
  onPageChange: (page: number) => void
  onZoomChange: (zoom: number) => void
  onTogglePanel: () => void
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
        <Button
          type="button"
          variant={isPanelOpen ? 'secondary' : 'ghost'}
          size="sm"
          aria-label={t('highlights.toggle')}
          aria-pressed={isPanelOpen}
          onClick={onTogglePanel}
        >
          <Highlighter className="h-4 w-4" />
          <span className="ml-1 text-xs tabular-nums">{highlightCount}</span>
        </Button>
        <Button asChild={true} variant="ghost" size="sm">
          <a
            href={`/api/books/${bookId}/highlights/export`}
            aria-label={t('exportHighlights')}
          >
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('exportHighlights')}</span>
          </a>
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

export default function PdfViewer({
  bookId,
  src,
  title,
  savedPage,
  storedTotal,
  initialHighlights,
}: {
  bookId: string
  src: string
  title: string
  savedPage: number | null
  storedTotal: number | null
  initialHighlights: Highlight[]
}) {
  const t = useTranslations('reader')
  const [total, setTotal] = useState(0)
  // Always the server's saved page (or 1): the browser keeps no position.
  const [page, setPage] = useState(savedPage ?? 1)
  const hasReportedTotal = useRef(false)
  const [zoom, setZoom] = useState(1)
  const pageRef = useRef<HTMLDivElement>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isComposing, setIsComposing] = useState(false)
  const { highlights, add, remove } = useHighlights(bookId, initialHighlights)
  const { selection, clear: clearSelection } = useTextSelection(
    pageRef,
    page,
    isComposing
  )
  const { ref: scrollRef, width: containerWidth } =
    useElementWidth<HTMLDivElement>()

  // Stable identity: a new object each render makes react-pdf reload the file.
  const options = useMemo(() => ({ withCredentials: true }), [])

  const pageWidth = Math.min(Math.max(containerWidth - 16, 0), MAX_PAGE_WIDTH)

  const handlePageChange = (next: number) => {
    setPage(clamp(next, 1, Math.max(total, 1)))
    // Instant on purpose: no scrolling animation to opt out of.
    scrollRef.current?.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }

  const handleJump = (target: number) => {
    handlePageChange(target)
    // On phones the panel is a sheet that covers the page.
    if (window.matchMedia('(max-width: 767px)').matches) {
      setIsPanelOpen(false)
    }
  }

  const handleSaveHighlight = async (color: HighlightColor, note: string) => {
    if (!selection) {
      return false
    }
    const isSaved = await add({
      page,
      color,
      text: selection.text,
      note: note.trim() || null,
      rects: selection.rects,
    })
    if (isSaved) {
      clearSelection()
    }
    return isSaved
  }

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotal(numPages)
    // A replaced, shorter PDF must not leave the reader past its last page.
    setPage((current) => clamp(current, 1, numPages))
    // First open (or a replaced PDF): store the page count once.
    if (numPages !== storedTotal && !hasReportedTotal.current) {
      hasReportedTotal.current = true
      reportTotalPages(bookId, numPages).catch(() => undefined)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <Toolbar
        bookId={bookId}
        page={page}
        total={total}
        zoom={zoom}
        highlightCount={highlights.length}
        isPanelOpen={isPanelOpen}
        onTogglePanel={() => setIsPanelOpen((current) => !current)}
        onPageChange={handlePageChange}
        onZoomChange={(next) => setZoom(clamp(next, MIN_ZOOM, MAX_ZOOM))}
      />
      <div className="flex min-h-0 flex-1">
        <div
          ref={scrollRef}
          className="min-w-0 flex-1 overflow-auto bg-muted/40 p-2"
        >
          <Document
            file={src}
            options={options}
            onLoadSuccess={handleLoadSuccess}
            loading={
              <p className="p-8 text-center text-muted-foreground">
                {t('loading')}
              </p>
            }
            error={
              <p role="alert" className="p-8 text-center text-destructive">
                {t('loadFailed')}
              </p>
            }
            className="mx-auto w-fit"
            aria-label={title}
          >
            {pageWidth > 0 && total > 0 && (
              <div ref={pageRef} className="relative w-fit">
                <Page
                  pageNumber={page}
                  width={pageWidth * zoom}
                  className="shadow-md"
                />
                <HighlightLayer
                  highlights={highlights.filter((item) => item.page === page)}
                />
              </div>
            )}
          </Document>
        </div>
        {isPanelOpen && (
          <HighlightsPanel
            highlights={highlights}
            currentPage={page}
            onJump={handleJump}
            onRemove={remove}
            onClose={() => setIsPanelOpen(false)}
          />
        )}
      </div>
      {selection && (
        <HighlightComposer
          selection={selection}
          isOpen={isComposing}
          onOpenChange={setIsComposing}
          onSave={handleSaveHighlight}
        />
      )}
    </div>
  )
}
