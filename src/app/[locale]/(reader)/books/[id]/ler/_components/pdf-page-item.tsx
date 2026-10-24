'use client'

import type { Highlight } from '@/lib/highlight-rules'
import { useTranslations } from 'next-intl'
import type { PDFPageProxy } from 'pdfjs-dist'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Page } from 'react-pdf'
import { HighlightLayer } from './highlight-layer'
import { reportReaderError } from './report-reader-error'

// Marks the page box (`data-reader-page`): the element a selection and its
// rects are measured against. It has exactly the page's size, so saved rects
// keep their meaning.
export const PAGE_SELECTOR = '[data-reader-page]'

function PageContent({
  bookId,
  pageNumber,
  width,
  highlights,
  onRatio,
}: {
  bookId: string
  pageNumber: number
  width: number
  highlights: Highlight[]
  onRatio: (pageNumber: number, ratio: number) => void
}) {
  const t = useTranslations('reader')
  const [hasPageError, setHasPageError] = useState(false)
  const [hasTextError, setHasTextError] = useState(false)
  const loadedPage = useRef<PDFPageProxy | null>(null)

  // pdf.js keeps a page's operator list and decoded images after it is drawn.
  // Leaving the window drops them (after any render still running), or the
  // tab grows with every page read.
  useEffect(
    () => () => {
      loadedPage.current?.cleanup()
    },
    []
  )

  const handlePageError = (error: Error) => {
    setHasPageError(true)
    reportReaderError(bookId, `pdf-pagina-${pageNumber}`, error)
  }

  return (
    <>
      <Page
        pageNumber={pageNumber}
        width={width}
        loading={null}
        error={null}
        onLoadSuccess={(page) => {
          loadedPage.current = page
          onRatio(pageNumber, page.originalHeight / page.originalWidth)
        }}
        onLoadError={handlePageError}
        onRenderError={handlePageError}
        onRenderTextLayerError={(error) => {
          setHasTextError(true)
          reportReaderError(bookId, `pdf-texto-${pageNumber}`, error)
        }}
      />
      <HighlightLayer highlights={highlights} />
      {(hasPageError || hasTextError) && (
        <p
          role="alert"
          className="absolute inset-x-2 top-2 z-[3] rounded-md bg-background/90 p-2 text-center text-destructive text-sm"
        >
          {hasPageError
            ? t('pageFailed', { page: pageNumber })
            : t('pageTextFailed', { page: pageNumber })}
        </p>
      )}
    </>
  )
}

// One slot of the continuous column. The slot always reserves the page's
// size; the canvas, text and highlight layers exist only while the page is
// inside the render window, and unmounting them frees the canvas.
export const PdfPageItem = memo(function PdfPageItem({
  bookId,
  pageNumber,
  width,
  height,
  isRendered,
  highlights,
  registerPage,
  onRatio,
}: {
  bookId: string
  pageNumber: number
  width: number
  height: number
  isRendered: boolean
  highlights: Highlight[]
  registerPage: (pageNumber: number, element: HTMLDivElement | null) => void
  onRatio: (pageNumber: number, ratio: number) => void
}) {
  const ref = useCallback(
    (element: HTMLDivElement | null) => registerPage(pageNumber, element),
    [pageNumber, registerPage]
  )

  return (
    <div
      ref={ref}
      data-reader-page={pageNumber}
      className="relative overflow-hidden bg-white shadow-md"
      style={{ width, height }}
    >
      {isRendered && (
        <PageContent
          bookId={bookId}
          pageNumber={pageNumber}
          width={width}
          highlights={highlights}
          onRatio={onRatio}
        />
      )}
    </div>
  )
})
