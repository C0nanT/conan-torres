import { createReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import { ensureBookFile } from '@/lib/book-file'
import { getReader } from '@/lib/reader-access'
import { site } from '@/lib/site-data'

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
  if (!(await getReader())) {
    return plain(401, 'Unauthorized')
  }

  const { id } = await params
  const book = site.books.recommended.find((item) => item.id === id)
  if (!book?.readable) {
    return plain(404, 'Not found')
  }

  const file = await ensureBookFile(book.id)
  if (!file.ok) {
    // The reason is already logged with the [book-file] prefix.
    return plain(502, 'Book file unavailable')
  }

  return new Response(
    Readable.toWeb(createReadStream(file.path)) as ReadableStream,
    {
      headers: {
        ...PRIVATE_HEADERS,
        'Content-Type': 'application/pdf',
        'Content-Length': String(file.size),
        'Content-Disposition': 'inline',
      },
    }
  )
}
