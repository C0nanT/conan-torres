'use client'

import type { Highlight } from '@/lib/highlight-rules'
import type { RefObject } from 'react'
import { Page } from 'react-pdf'
import { HighlightLayer } from './highlight-layer'
import { reportReaderError } from './report-reader-error'

export function PdfPageItem({
  bookId,
  pageNumber,
  width,
  highlights,
  pageRef,
}: {
  bookId: string
  pageNumber: number
  width: number
  highlights: Highlight[]
  pageRef: RefObject<HTMLDivElement>
}) {
  return (
    <div ref={pageRef} className="relative w-fit">
      <Page
        pageNumber={pageNumber}
        width={width}
        onRenderError={(error) =>
          reportReaderError(bookId, `pdf-pagina-${pageNumber}`, error)
        }
        onRenderTextLayerError={(error) =>
          reportReaderError(bookId, `pdf-texto-${pageNumber}`, error)
        }
        className="shadow-md"
      />
      <HighlightLayer
        highlights={highlights.filter((item) => item.page === pageNumber)}
      />
    </div>
  )
}
