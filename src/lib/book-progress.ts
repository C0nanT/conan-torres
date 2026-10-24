import { revalidatePath } from 'next/cache'
import { OWNER } from './reader-access'
import { logReaderDbFailure } from './reader-db'
import { listReadingPositions } from './reading-position'
import { type RecommendedBook, site } from './site-data'

// The one place where the public reading progress is decided. A readable
// book with a saved page takes `current_page / total_pages` and the save date
// from the database; every other book keeps `progress` / `progressUpdatedAt`
// from site.json. Components read the books from here and never merge.

interface SavedProgress {
  progress: number
  updatedAt: string
}

function readSavedProgress(): Record<string, SavedProgress> {
  // The build has no data volume: skip the database and use site.json.
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return {}
  }
  try {
    const saved: Record<string, SavedProgress> = {}
    for (const position of listReadingPositions(OWNER)) {
      const { currentPage, totalPages, updatedAt } = position
      if (currentPage === null || updatedAt === null || !totalPages) {
        continue
      }
      saved[position.bookId] = {
        progress: Math.min(100, Math.round((currentPage / totalPages) * 100)),
        updatedAt,
      }
    }
    return saved
  } catch (error) {
    logReaderDbFailure('ler-progresso', error)
    return {}
  }
}

export function getBooks(): RecommendedBook[] {
  const saved = readSavedProgress()
  return site.books.recommended.map((book) => {
    const fromDb = book.readable ? saved[book.id] : undefined
    return fromDb
      ? {
          ...book,
          progress: fromDb.progress,
          progressUpdatedAt: fromDb.updatedAt,
        }
      : book
  })
}

// Call after a page is saved. The books page renders per request (it reads
// the database), so this mainly drops any cached copy of it, including the
// client router cache; add every other page that shows book progress here.
export function revalidateBookProgress() {
  revalidatePath('/books')
}
