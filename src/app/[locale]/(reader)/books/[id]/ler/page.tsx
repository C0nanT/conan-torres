import { Button } from '@/components/ui/button'
import { Link } from '@/lib/navigation'
import { site } from '@/lib/site-data'
import { ArrowLeft } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const book = site.books.recommended.find((item) => item.id === id)

  if (!book) {
    notFound()
  }

  const t = await getTranslations('reader')

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-2xl font-bold sm:text-3xl">{book.title}</h1>
      <Button asChild={true} variant="outline">
        <Link href="/books">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </Link>
      </Button>
    </div>
  )
}
