import { generateLocalizedMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import { connection } from 'next/server'
import { BookList } from './_components'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return await generateLocalizedMetadata(locale, 'books')
}

// Rendered per request so a deploy never serves build-time numbers over a
// database that already has saved pages; the numbers themselves are cached and
// refreshed on demand when a page is saved (see book-progress.ts).
export default async function BooksPage() {
  await connection()
  return <BookList />
}
