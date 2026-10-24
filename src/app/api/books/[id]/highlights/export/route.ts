import { listHighlights } from '@/lib/highlights'
import { PRIVATE_HEADERS, privateText } from '@/lib/private-response'
import { getReader } from '@/lib/reader-access'
import { logReaderDbFailure } from '@/lib/reader-db'
import { getReadingPosition } from '@/lib/reading-position'
import { getReadableBook } from '@/lib/site-data'
import { getTranslations } from 'next-intl/server'

// Backup of one book's saved page and highlights, downloaded from the reader
// toolbar. Read-only: there is no import route.

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const reader = await getReader()
  if (!reader) {
    return privateText(401, 'Unauthorized')
  }

  const { id } = await params
  const book = getReadableBook(id)
  if (!book) {
    return privateText(404, 'Not found')
  }

  let body: string
  try {
    const position = getReadingPosition(reader, book.id)
    const highlights = listHighlights(reader, book.id)
    // "Saved position" means a page was saved; a row holding only the total
    // page count does not count.
    const hasSavedPage = position?.currentPage != null
    body = JSON.stringify(
      {
        bookId: book.id,
        readingPosition: hasSavedPage
          ? {
              currentPage: position?.currentPage,
              totalPages: position?.totalPages,
              updatedAt: position?.updatedAt,
            }
          : null,
        highlights: highlights.map((highlight) => ({
          page: highlight.page,
          color: highlight.color,
          text: highlight.text,
          note: highlight.note,
          createdAt: highlight.createdAt,
        })),
      },
      null,
      2
    )
  } catch (error) {
    logReaderDbFailure('exportar-grifos', error)
    // /api skips the middleware, so the locale is passed explicitly.
    const t = await getTranslations({ locale: 'pt', namespace: 'reader' })
    return privateText(500, t('exportFailed'))
  }

  const date = new Date().toISOString().slice(0, 10)
  return new Response(body, {
    headers: {
      ...PRIVATE_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="grifos-${book.id}-${date}.json"`,
    },
  })
}
