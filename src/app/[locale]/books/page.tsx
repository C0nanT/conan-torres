import { generateLocalizedMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import { BookList } from './_components'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return await generateLocalizedMetadata(locale, 'books')
}

export default function BooksPage() {
  return <BookList />
}
