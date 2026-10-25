import { reportClientError } from '../log-actions'

export function describeError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`
  }
  return String(error)
}

// Browser console for whoever has it open, server log for everyone else.
export function reportReaderError(
  bookId: string,
  origin: string,
  error: unknown
) {
  console.error(`[reader] ${origin}:`, error)
  reportClientError(bookId, origin, describeError(error)).catch(() => undefined)
}
