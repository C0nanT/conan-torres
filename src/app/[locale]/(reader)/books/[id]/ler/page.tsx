import { Button } from '@/components/ui/button'
import { ensureBookFile } from '@/lib/book-file'
import type { Highlight } from '@/lib/highlight-rules'
import { listHighlights } from '@/lib/highlights'
import { Link } from '@/lib/navigation'
import {
  type Reader,
  getReader,
  isReaderAccessConfigured,
} from '@/lib/reader-access'
import { logReaderDbFailure } from '@/lib/reader-db'
import { getClientIp, getLockMinutesLeft } from '@/lib/reader-rate-limit'
import {
  type ReadingPosition,
  getReadingPosition,
} from '@/lib/reading-position'
import { getReadableBook } from '@/lib/site-data'
import { ArrowLeft } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { BookFileError, BookViewer, PrivateScreen } from './_components'
import type { LoginState } from './actions'

async function getInitialLoginState(): Promise<LoginState> {
  const minutesLeft = getLockMinutesLeft(await getClientIp())
  return minutesLeft > 0
    ? { status: 'locked', minutesLeft }
    : { status: 'idle' }
}

// A database failure must not lock Conan out of the book: open on page 1 and
// let the save action report the problem.
function loadPosition(owner: Reader, bookId: string): ReadingPosition | null {
  try {
    return getReadingPosition(owner, bookId)
  } catch (error) {
    logReaderDbFailure('ler-posicao', error)
    return null
  }
}

// Same rule: highlights that fail to load must not block reading.
function loadHighlights(owner: Reader, bookId: string): Highlight[] {
  try {
    return listHighlights(owner, bookId)
  } catch (error) {
    logReaderDbFailure('ler-grifos', error)
    return []
  }
}

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const book = getReadableBook(id)

  if (!book) {
    notFound()
  }

  const reader = await getReader()

  if (reader) {
    const file = await ensureBookFile(book.id)
    if (file.ok) {
      const position = loadPosition(reader, book.id)
      return (
        <BookViewer
          bookId={book.id}
          title={book.title}
          savedPage={position?.currentPage ?? null}
          storedTotal={position?.totalPages ?? null}
          initialHighlights={loadHighlights(reader, book.id)}
        />
      )
    }
    return (
      <Centered>
        <BookFileError reason={file.reason} />
      </Centered>
    )
  }

  return (
    <Centered>
      <PrivateScreen
        book={book}
        isConfigured={isReaderAccessConfigured()}
        initialState={await getInitialLoginState()}
      />
    </Centered>
  )
}

async function Centered({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('reader')

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 overflow-y-auto px-4 py-8 text-center">
      {children}
      <Button asChild={true} variant="outline">
        <Link href="/books">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </Link>
      </Button>
    </div>
  )
}
