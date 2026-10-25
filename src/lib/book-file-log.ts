// Failure log for the book PDF download. One console line per failed attempt,
// prefixed so it is easy to grep in `docker compose logs web`. Never receives
// the Drive file ID or URL: only the book id and a reason code.

const LOG_PREFIX = '[book-file]'

export type BookFileFailure =
  | 'missing-env'
  | 'invalid-book-id'
  | 'not-found'
  | 'drive-failed'
  | 'not-pdf'
  | 'confirm-page'
  | 'too-large'
  | 'io-error'

export function logBookFileFailure(
  bookId: string,
  reason: BookFileFailure,
  detail?: string
) {
  const extra = detail ? ` detalhe=${detail}` : ''
  console.warn(
    `${LOG_PREFIX} ${new Date().toISOString()} livro=${bookId} motivo=${reason}${extra}`
  )
}
