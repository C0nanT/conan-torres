'use server'

import { isPageCount, parsePageNumber } from '@/lib/page-number'
import { getReader, signIn, signOut } from '@/lib/reader-access'
import { logReaderDbFailure } from '@/lib/reader-db'
import {
  clearFailures,
  getClientIp,
  getLockRemainingMs,
  recordFailure,
} from '@/lib/reader-rate-limit'
import {
  getReadingPosition,
  saveCurrentPage,
  setTotalPages,
} from '@/lib/reading-position'
import { site } from '@/lib/site-data'

export type LoginState =
  | { status: 'idle' }
  | { status: 'wrong-password' }
  | { status: 'not-configured' }
  | { status: 'locked'; minutesLeft: number }

function locked(remainingMs: number): LoginState {
  return { status: 'locked', minutesLeft: Math.ceil(remainingMs / 60_000) }
}

// Changing the cookie makes Next re-render the reader page, which then shows
// the reader instead of the private screen; no redirect needed.
export async function login(
  _previous: LoginState,
  formData: FormData
): Promise<LoginState> {
  const ip = await getClientIp()
  const remainingMs = getLockRemainingMs(ip)
  if (remainingMs > 0) {
    return locked(remainingMs)
  }

  const password = formData.get('password')
  const result = await signIn(typeof password === 'string' ? password : '')
  if (result === 'ok') {
    clearFailures(ip)
    return { status: 'idle' }
  }
  if (result === 'not-configured') {
    return { status: 'not-configured' }
  }

  const lockMs = recordFailure(ip)
  return lockMs > 0 ? locked(lockMs) : { status: 'wrong-password' }
}

export async function logout(): Promise<void> {
  await signOut()
}

function isReadableBook(bookId: unknown): bookId is string {
  return site.books.recommended.some(
    (book) => book.id === bookId && book.readable
  )
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
  if (!(reader && isReadableBook(bookId))) {
    return { status: 'unauthorized' }
  }

  try {
    const stored = getReadingPosition(reader, bookId)?.totalPages ?? null
    const total = isPageCount(pdfTotal) ? pdfTotal : stored
    if (total === null) {
      return { status: 'error' }
    }
    const page = parsePageNumber(rawPage, total)
    if (page === null) {
      return { status: 'invalid', total }
    }
    if (total !== stored) {
      setTotalPages(reader, bookId, total)
    }
    saveCurrentPage(reader, bookId, page)
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
  if (!(reader && isReadableBook(bookId) && isPageCount(totalPages))) {
    return
  }
  try {
    setTotalPages(reader, bookId, totalPages)
  } catch (error) {
    logReaderDbFailure('gravar-total', error)
  }
}
