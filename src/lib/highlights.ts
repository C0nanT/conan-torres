import { randomUUID } from 'node:crypto'
import type { Highlight, NewHighlight } from './highlight-rules'
import type { Reader } from './reader-access'
import { getDb } from './reader-db'

// Every highlight of each owner. The only module with highlight SQL: the
// reader page and its actions call these functions and never touch the
// database. Every query is scoped by owner and book.

interface HighlightRow {
  id: string
  page: number
  color: Highlight['color']
  text: string
  note: string | null
  rects: string
  createdAt: string
}

function toHighlight(row: HighlightRow): Highlight {
  return { ...row, rects: JSON.parse(row.rects) }
}

// Ordered by page, then by when they were made.
export function listHighlights(owner: Reader, bookId: string): Highlight[] {
  return getDb()
    .prepare<[{ owner: string; bookId: string }], HighlightRow>(
      `SELECT id, page, color, text, note, rects, created_at AS createdAt
         FROM highlights
        WHERE owner = @owner AND book_id = @bookId
        ORDER BY page, created_at, id`
    )
    .all({ owner, bookId })
    .map(toHighlight)
}

export function createHighlight(
  owner: Reader,
  bookId: string,
  input: NewHighlight
): Highlight {
  const highlight: Highlight = {
    id: randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
  }
  getDb()
    .prepare(
      `INSERT INTO highlights
         (id, owner, book_id, page, color, text, note, rects, created_at)
       VALUES (@id, @owner, @bookId, @page, @color, @text, @note, @rects,
               @createdAt)`
    )
    .run({
      ...highlight,
      owner,
      bookId,
      rects: JSON.stringify(highlight.rects),
    })
  return highlight
}

export function deleteHighlight(
  owner: Reader,
  bookId: string,
  id: string
): void {
  getDb()
    .prepare(
      `DELETE FROM highlights
        WHERE id = @id AND owner = @owner AND book_id = @bookId`
    )
    .run({ id, owner, bookId })
}
