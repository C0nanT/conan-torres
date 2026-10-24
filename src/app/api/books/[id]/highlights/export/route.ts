import { listHighlights } from '@/lib/highlights'
import { getReader } from '@/lib/reader-access'
import { logReaderDbFailure } from '@/lib/reader-db'
import { getReadingPosition } from '@/lib/reading-position'
import { site } from '@/lib/site-data'

// Backup of one book's saved page and highlights, downloaded from the reader
// toolbar. Read-only: there is no import route.

const PRIVATE_HEADERS = {
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
}

function plain(status: number, body: string) {
  return new Response(body, { status, headers: PRIVATE_HEADERS })
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const reader = await getReader()
  if (!reader) {
    return plain(401, 'Unauthorized')
  }

  const { id } = await params
  const book = site.books.recommended.find((item) => item.id === id)
  if (!book?.readable) {
    return plain(404, 'Not found')
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
    return plain(
      500,
      'Não consegui exportar os grifos agora. Tente de novo em instantes.'
    )
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
