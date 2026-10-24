'use client'

import type { Highlight, HighlightColor } from '@/lib/highlight-rules'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Document, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { reportTotalPages } from '../actions'
import { HighlightComposer } from './highlight-composer'
import { HighlightsPanel } from './highlights-panel'
import { PdfPageItem } from './pdf-page-item'
import { PdfToolbar } from './pdf-toolbar'
import { describeError, reportReaderError } from './report-reader-error'
import { useHighlights } from './use-highlights'
import { useTextSelection } from './use-text-selection'
import { MAX_ZOOM, MIN_ZOOM, clamp } from './viewer-limits'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const MAX_PAGE_WIDTH = 900

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
  const [loadError, setLoadError] = useState<string | null>(null)

  // A PDF that does not load used to leave only react-pdf's generic message.
  // The cause (HTTP status, pdf.js parse error) goes on screen and to the log.
  const handleLoadError = (origin: string) => (error: Error) => {
    setLoadError(describeError(error))
    reportReaderError(bookId, origin, error)
  }

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
      <PdfToolbar
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
            onLoadError={handleLoadError('pdf-carregar')}
            onSourceError={handleLoadError('pdf-origem')}
            loading={
              <p className="p-8 text-center text-muted-foreground">
                {t('loading')}
              </p>
            }
            error={
              <div role="alert" className="p-8 text-center">
                <p className="text-destructive">{t('loadFailed')}</p>
                {loadError && (
                  <p className="mt-2 break-words font-mono text-muted-foreground text-xs">
                    {loadError}
                  </p>
                )}
              </div>
            }
            className="mx-auto w-fit"
            aria-label={title}
          >
            {pageWidth > 0 && total > 0 && (
              <PdfPageItem
                bookId={bookId}
                pageNumber={page}
                width={pageWidth * zoom}
                highlights={highlights}
                pageRef={pageRef}
              />
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
