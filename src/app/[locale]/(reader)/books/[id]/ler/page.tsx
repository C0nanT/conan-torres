import { Button } from '@/components/ui/button'
import { ensureBookFile } from '@/lib/book-file'
import { Link } from '@/lib/navigation'
import { getReader, isReaderAccessConfigured } from '@/lib/reader-access'
import { getClientIp, getLockRemainingMs } from '@/lib/reader-rate-limit'
import { site } from '@/lib/site-data'
import { ArrowLeft } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { BookFileError, BookViewer, PrivateScreen } from './_components'
import type { LoginState } from './actions'

async function getInitialLoginState(): Promise<LoginState> {
  const remainingMs = getLockRemainingMs(await getClientIp())
  return remainingMs > 0
    ? { status: 'locked', minutesLeft: Math.ceil(remainingMs / 60_000) }
    : { status: 'idle' }
}

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const book = site.books.recommended.find((item) => item.id === id)

  if (!book?.readable) {
    notFound()
  }

  const reader = await getReader()

  if (reader) {
    const file = await ensureBookFile(book.id)
    if (file.ok) {
      return <BookViewer bookId={book.id} title={book.title} />
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
