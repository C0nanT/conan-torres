// Response helpers for the reader's owner-only route handlers: nothing they
// return may be cached or sniffed.

export const PRIVATE_HEADERS = {
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
}

// For responses the browser may keep but must revalidate before every use.
export const PRIVATE_REVALIDATE_CACHE_CONTROL = 'private, no-cache'

export function privateText(status: number, body: string): Response {
  return new Response(body, { status, headers: PRIVATE_HEADERS })
}
