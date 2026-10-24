import { createReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import { ensureBookFile } from '@/lib/book-file'
import { PRIVATE_HEADERS, privateText } from '@/lib/private-response'
import { getReader } from '@/lib/reader-access'
import { debugReader } from '@/lib/reader-log'
import { getReadableBook } from '@/lib/site-data'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const hasCookie = request.headers.get('cookie')?.includes('reader_session')

  if (!(await getReader())) {
    debugReader('arquivo', { livro: id, status: 401, cookie: hasCookie })
    return privateText(401, 'Unauthorized')
  }

  const book = getReadableBook(id)
  if (!book) {
    debugReader('arquivo', { livro: id, status: 404 })
    return privateText(404, 'Not found')
  }

  const file = await ensureBookFile(book.id)
  if (!file.ok) {
    // The reason is already logged with the [book-file] prefix.
    debugReader('arquivo', { livro: book.id, status: 502, motivo: file.reason })
    return privateText(502, 'Book file unavailable')
  }

  debugReader('arquivo', { livro: book.id, status: 200, bytes: file.size })

  return new Response(
    // Node's web stream and the DOM ReadableStream Response expects are the
    // same object at runtime but distinct types; no guard can bridge them.
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
