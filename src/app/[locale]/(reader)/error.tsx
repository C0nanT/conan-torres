'use client'

import { Button } from '@/components/ui/button'
import { Link } from '@/lib/navigation'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

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

  useEffect(() => {
    console.error('[reader] erro na página:', error)
  }, [error])

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
