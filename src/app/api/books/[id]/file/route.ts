import { createReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import { ensureBookFile } from '@/lib/book-file'
import { PRIVATE_HEADERS, privateText } from '@/lib/private-response'
import { getReader } from '@/lib/reader-access'
import { getReadableBook } from '@/lib/site-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getReader())) {
    return privateText(401, 'Unauthorized')
  }

  const { id } = await params
  const book = getReadableBook(id)
  if (!book) {
    return privateText(404, 'Not found')
  }

  const file = await ensureBookFile(book.id)
  if (!file.ok) {
    // The reason is already logged with the [book-file] prefix.
    return privateText(502, 'Book file unavailable')
  }

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
