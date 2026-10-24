import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

// Shown while the reader page renders. The first open of a book downloads
// the PDF from Drive on the server (up to two minutes), so say so.
export default function ReaderLoading() {
  const t = useTranslations('reader.opening')

  return (
    <output
      aria-live="polite"
      className="flex h-full flex-col items-center justify-center gap-4 px-4 text-center"
    >
      <Loader2
        aria-hidden={true}
        className="h-8 w-8 animate-spin text-muted-foreground motion-reduce:animate-none"
      />
      <h1 className="font-bold text-2xl">{t('title')}</h1>
      <p className="max-w-md text-muted-foreground">{t('firstOpen')}</p>
    </output>
  )
}
