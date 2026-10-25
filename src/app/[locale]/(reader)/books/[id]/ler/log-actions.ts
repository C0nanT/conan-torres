'use server'

import { getReader } from '@/lib/reader-access'
import { logReaderClientError } from '@/lib/reader-log'

// Lets the browser report an error to the server log, which is the only place
// Conan can read it when the reader runs on the VPS. Server actions are public
// POST endpoints: only the signed-in reader may write to the log, and every
// argument is untrusted (the logger flattens and truncates them).
export async function reportClientError(
  bookId: unknown,
  origin: unknown,
  message: unknown
): Promise<void> {
  if (!(await getReader())) {
    return
  }
  logReaderClientError(
    typeof bookId === 'string' ? bookId : 'desconhecido',
    typeof origin === 'string' ? origin : 'desconhecida',
    typeof message === 'string' ? message : 'sem mensagem'
  )
}
