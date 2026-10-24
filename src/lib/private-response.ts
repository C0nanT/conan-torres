// Response helpers for the reader's owner-only route handlers: nothing they
// return may be cached or sniffed.

export const PRIVATE_HEADERS = {
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
}

export function privateText(status: number, body: string): Response {
  return new Response(body, { status, headers: PRIVATE_HEADERS })
}
