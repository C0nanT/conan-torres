'use client'

import { Button } from '@/components/ui/button'
import { Link, usePathname } from '@/lib/navigation'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { reportReaderError } from './books/[id]/ler/_components/report-reader-error'

const BOOK_PATH_PATTERN = /^\/books\/([^/]+)\/ler/

// Full-screen error inside the reader shell, so a thrown error does not fall
// through to global-error.tsx.
export default function ReaderError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('reader')
  const pathname = usePathname()

  // In production a server error reaches the browser with its message
  // stripped; the digest is what links it to the server log.
  useEffect(() => {
    const bookId = BOOK_PATH_PATTERN.exec(pathname)?.[1] ?? 'desconhecido'
    const origin = error.digest ? `pagina digest=${error.digest}` : 'pagina'
    reportReaderError(bookId, origin, error)
  }, [error, pathname])

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 overflow-y-auto px-4 py-8 text-center">
      <AlertTriangle aria-hidden={true} className="h-8 w-8 text-destructive" />
      <div className="flex max-w-md flex-col gap-3">
        <h1 className="font-bold text-2xl">{t('crash.title')}</h1>
        <p role="alert" className="text-muted-foreground">
          {t('crash.description')}
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" onClick={reset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {t('crash.retry')}
        </Button>
        <Button asChild={true} variant="outline">
          <Link href="/books">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back')}
          </Link>
        </Button>
      </div>
    </div>
  )
}
