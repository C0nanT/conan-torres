'use server'

import type { Highlight } from '@/lib/highlight-rules'
import { parseNewHighlight } from '@/lib/highlight-rules'
import { createHighlight, deleteHighlight } from '@/lib/highlights'
import { getReader } from '@/lib/reader-access'
import { logReaderDbFailure } from '@/lib/reader-db'
import { getReadingPosition } from '@/lib/reading-position'
import { site } from '@/lib/site-data'

export type AddHighlightResult =
  | { status: 'created'; highlight: Highlight }
  | { status: 'invalid' }
  | { status: 'unauthorized' }
  | { status: 'error' }

export type RemoveHighlightResult =
  | { status: 'deleted' }
  | { status: 'unauthorized' }
  | { status: 'error' }

function isReadableBook(bookId: unknown): bookId is string {
  return site.books.recommended.some(
    (book) => book.id === bookId && book.readable
  )
}

// Server actions are public POST endpoints: every argument is untrusted.
export async function addHighlight(
  bookId: unknown,
  raw: unknown
): Promise<AddHighlightResult> {
  const reader = await getReader()
  if (!(reader && isReadableBook(bookId))) {
    return { status: 'unauthorized' }
  }

  try {
    const total = getReadingPosition(reader, bookId)?.totalPages ?? null
    const input = parseNewHighlight(raw, total)
    if (!input) {
      return { status: 'invalid' }
    }
    return {
      status: 'created',
      highlight: createHighlight(reader, bookId, input),
    }
  } catch (error) {
    logReaderDbFailure('criar-grifo', error)
    return { status: 'error' }
  }
}

export async function removeHighlight(
  bookId: unknown,
  id: unknown
): Promise<RemoveHighlightResult> {
  const reader = await getReader()
  if (!(reader && isReadableBook(bookId))) {
    return { status: 'unauthorized' }
  }
  if (typeof id !== 'string' || id.length === 0 || id.length > 64) {
    return { status: 'error' }
  }

  try {
    // Already gone counts as deleted: the goal state is reached.
    deleteHighlight(reader, bookId, id)
    return { status: 'deleted' }
  } catch (error) {
    logReaderDbFailure('apagar-grifo', error)
    return { status: 'error' }
  }
}
