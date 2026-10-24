'use client'

import { Button } from '@/components/ui/button'
import { Link } from '@/lib/navigation'
import { ArrowLeft, LogOut, Minus, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { logout } from '../actions'

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
  page,
  total,
  zoom,
  onPageChange,
  onZoomChange,
}: {
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

export default function PdfViewer({
  src,
  title,
}: {
  src: string
  title: string
}) {
  const t = useTranslations('reader')
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [zoom, setZoom] = useState(1)
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

  return (
    <div className="flex h-full flex-col">
      <Toolbar
        page={page}
        total={total}
        zoom={zoom}
        onPageChange={handlePageChange}
        onZoomChange={(next) => setZoom(clamp(next, MIN_ZOOM, MAX_ZOOM))}
      />
      <div ref={scrollRef} className="flex-1 overflow-auto bg-muted/40 p-2">
        <Document
          file={src}
          options={options}
          onLoadSuccess={({ numPages }) => setTotal(numPages)}
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
            <Page
              pageNumber={page}
              width={pageWidth * zoom}
              className="shadow-md"
            />
          )}
        </Document>
      </div>
    </div>
  )
}
