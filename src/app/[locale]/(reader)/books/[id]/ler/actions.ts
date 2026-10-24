'use server'

import { revalidateBookProgress } from '@/lib/book-progress'
import { isPageCount, parsePageNumber } from '@/lib/page-number'
import { getReader, signIn, signOut } from '@/lib/reader-access'
import { logReaderDbFailure } from '@/lib/reader-db'
import { debugReader } from '@/lib/reader-log'
import {
  clearFailures,
  getClientIp,
  registerAttempt,
} from '@/lib/reader-rate-limit'
import {
  getReadingPosition,
  saveCurrentPage,
  setTotalPages,
} from '@/lib/reading-position'
import { getReadableBook } from '@/lib/site-data'

export type LoginState =
  | { status: 'idle' }
  | { status: 'wrong-password' }
  | { status: 'not-configured' }
  | { status: 'locked'; minutesLeft: number }

// Changing the cookie makes Next re-render the reader page, which then shows
// the reader instead of the private screen; no redirect needed.
export async function login(
  _previous: LoginState,
  formData: FormData
): Promise<LoginState> {
  const ip = await getClientIp()
  // Counted before the password is compared, so a parallel burst of wrong
  // passwords stops at the limit; a right one clears the count.
  const attempt = registerAttempt(ip)
  if (!attempt.isAllowed) {
    debugReader('login', { ip, resultado: 'bloqueado' })
    return { status: 'locked', minutesLeft: attempt.minutesLeft }
  }

  const password = formData.get('password')
  const result = await signIn(typeof password === 'string' ? password : '')
  debugReader('login', { ip, resultado: result })
  if (result !== 'wrong-password') {
    // 'not-configured' cannot succeed either way, so it does not count.
    clearFailures(ip)
    return result === 'ok' ? { status: 'idle' } : { status: 'not-configured' }
  }

  return attempt.lockMinutesIfWrong > 0
    ? { status: 'locked', minutesLeft: attempt.lockMinutesIfWrong }
    : { status: 'wrong-password' }
}

export async function logout(): Promise<void> {
  await signOut()
}

export type SavePageResult =
  | { status: 'saved'; page: number }
  | { status: 'invalid'; total: number }
  | { status: 'unauthorized' }
  | { status: 'error' }

// Server actions are public POST endpoints: every argument is untrusted.
// `pdfTotal` is the page count the viewer read from the PDF; it fills or
// corrects the stored total, so the range check works even before the
// first-open report reached the server.
export async function savePage(
  bookId: unknown,
  rawPage: unknown,
  pdfTotal: unknown
): Promise<SavePageResult> {
  const reader = await getReader()
  const book = getReadableBook(bookId)
  if (!(reader && book)) {
    return { status: 'unauthorized' }
  }

  try {
    const stored = getReadingPosition(reader, book.id)?.totalPages ?? null
    const total = isPageCount(pdfTotal) ? pdfTotal : stored
    if (total === null) {
      return { status: 'error' }
    }
    const page = parsePageNumber(rawPage, total)
    if (page === null) {
      return { status: 'invalid', total }
    }
    if (total !== stored) {
      setTotalPages(reader, book.id, total)
    }
    saveCurrentPage(reader, book.id, page)
    revalidateBookProgress()
    return { status: 'saved', page }
  } catch (error) {
    logReaderDbFailure('salvar-pagina', error)
    return { status: 'error' }
  }
}

// Sent by the viewer once the PDF loads, only when the server's total is
// missing or differs from the file (the PDF was replaced).
export async function reportTotalPages(
  bookId: unknown,
  totalPages: unknown
): Promise<void> {
  const reader = await getReader()
  const book = getReadableBook(bookId)
  if (!(reader && book && isPageCount(totalPages))) {
    return
  }
  try {
    setTotalPages(reader, book.id, totalPages)
  } catch (error) {
    logReaderDbFailure('gravar-total', error)
  }
}
