import { getReadableBook } from '@/lib/site-data'
import { notFound } from 'next/navigation'

// Checks the book before this segment's loading.tsx starts streaming, so an
// unknown or unreadable id answers 404 (rendered by (reader)/not-found.tsx).
export default async function ReaderBookLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!getReadableBook(id)) {
    notFound()
  }
  return children
}
