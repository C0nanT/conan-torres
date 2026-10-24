import { createReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import { ensureBookFile } from '@/lib/book-file'
import {
  PRIVATE_HEADERS,
  PRIVATE_REVALIDATE_CACHE_CONTROL,
  privateText,
} from '@/lib/private-response'
import { getReader } from '@/lib/reader-access'
import { debugReader } from '@/lib/reader-log'
import { getReadableBook } from '@/lib/site-data'

function matchesEtag(header: string | null, etag: string): boolean {
  if (!header) {
    return false
  }
  return header
    .split(',')
    .map((tag) => tag.trim().replace(/^W\//, ''))
    .some((tag) => tag === '*' || tag === etag)
}

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

  // The validator comes from the server's cached copy, so deleting that file
  // (to refresh it from Drive) changes it. Access was checked above, so a 304
  // is only ever sent to the signed-in reader.
  const etag = `"${file.size.toString(16)}-${file.modifiedMs.toString(16)}"`
  const cacheHeaders = {
    ...PRIVATE_HEADERS,
    'Cache-Control': PRIVATE_REVALIDATE_CACHE_CONTROL,
    ETag: etag,
    'Last-Modified': new Date(file.modifiedMs).toUTCString(),
  }

  if (matchesEtag(request.headers.get('if-none-match'), etag)) {
    debugReader('arquivo', { livro: book.id, status: 304 })
    return new Response(null, { status: 304, headers: cacheHeaders })
  }

  debugReader('arquivo', { livro: book.id, status: 200, bytes: file.size })

  return new Response(
    // Node's web stream and the DOM ReadableStream Response expects are the
    // same object at runtime but distinct types; no guard can bridge them.
    Readable.toWeb(createReadStream(file.path)) as ReadableStream,
    {
      headers: {
        ...cacheHeaders,
        'Content-Type': 'application/pdf',
        'Content-Length': String(file.size),
        'Content-Disposition': 'inline',
      },
    }
  )
}
