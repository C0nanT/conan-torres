import { Button } from '@/components/ui/button'
import { Link } from '@/lib/navigation'
import { getReader, isReaderAccessConfigured } from '@/lib/reader-access'
import { getClientIp, getLockRemainingMs } from '@/lib/reader-rate-limit'
import { site } from '@/lib/site-data'
import { ArrowLeft } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { PrivateScreen, ReaderPlaceholder } from './_components'
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

  const t = await getTranslations('reader')
  const reader = await getReader()

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 overflow-y-auto px-4 py-8 text-center">
      {reader ? (
        <ReaderPlaceholder book={book} />
      ) : (
        <PrivateScreen
          book={book}
          isConfigured={isReaderAccessConfigured()}
          initialState={await getInitialLoginState()}
        />
      )}
      <Button asChild={true} variant="outline">
        <Link href="/books">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </Link>
      </Button>
    </div>
  )
}
