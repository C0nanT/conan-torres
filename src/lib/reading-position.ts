import type { Reader } from './reader-access'
import { getDb } from './reader-db'

// Where each owner stopped in each book. The only module with reading-position
// SQL: the reader page, its actions and (later) the books page call these
// functions and never touch the database.
//
// A row can exist with only `totalPages` (written the first time the PDF
// opens). `currentPage` and `updatedAt` stay null until a page is saved, so
// "saved position" means currentPage !== null.

export interface ReadingPosition {
  currentPage: number | null
  totalPages: number | null
  updatedAt: string | null
}

export function getReadingPosition(
  owner: Reader,
  bookId: string
): ReadingPosition | null {
  const row = getDb()
    .prepare<[{ owner: string; bookId: string }], ReadingPosition>(
      `SELECT current_page AS currentPage, total_pages AS totalPages,
              updated_at AS updatedAt
         FROM reading_positions
        WHERE owner = @owner AND book_id = @bookId`
    )
    .get({ owner, bookId })
  return row ?? null
}

// Records the page count read from the PDF. Does not touch the saved page or
// its date.
export function setTotalPages(
  owner: Reader,
  bookId: string,
  totalPages: number
): void {
  getDb()
    .prepare(
      `INSERT INTO reading_positions (owner, book_id, total_pages)
       VALUES (@owner, @bookId, @totalPages)
       ON CONFLICT (owner, book_id) DO UPDATE SET total_pages = @totalPages`
    )
    .run({ owner, bookId, totalPages })
}

// Saves the page where the owner stopped. The caller validates the number
// against the total first.
export function saveCurrentPage(
  owner: Reader,
  bookId: string,
  currentPage: number
): void {
  const updatedAt = new Date().toISOString()
  getDb()
    .prepare(
      `INSERT INTO reading_positions (owner, book_id, current_page, updated_at)
       VALUES (@owner, @bookId, @currentPage, @updatedAt)
       ON CONFLICT (owner, book_id) DO UPDATE
         SET current_page = @currentPage, updated_at = @updatedAt`
    )
    .run({ owner, bookId, currentPage, updatedAt })
}

export interface BookReadingPosition extends ReadingPosition {
  bookId: string
}

// Every book the owner has a row for; feeds the public books page.
export function listReadingPositions(owner: Reader): BookReadingPosition[] {
  return getDb()
    .prepare<[{ owner: string }], BookReadingPosition>(
      `SELECT book_id AS bookId, current_page AS currentPage,
              total_pages AS totalPages, updated_at AS updatedAt
         FROM reading_positions
        WHERE owner = @owner`
    )
    .all({ owner })
}
