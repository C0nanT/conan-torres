'use client'

import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'

function LoadingMessage() {
  const t = useTranslations('reader')
  return (
    <div className="flex h-full items-center justify-center text-muted-foreground">
      {t('loading')}
    </div>
  )
}

// react-pdf touches browser-only globals (DOMMatrix) at import time, so the
// viewer must never be prerendered: ssr:false is only allowed in a Client
// Component.
const PdfViewer = dynamic(() => import('./pdf-viewer'), {
  ssr: false,
  loading: () => <LoadingMessage />,
})

export function BookViewer({
  bookId,
  title,
}: {
  bookId: string
  title: string
}) {
  return <PdfViewer src={`/api/books/${bookId}/file`} title={title} />
}
