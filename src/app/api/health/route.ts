// Liveness probe for the container HEALTHCHECK and the reverse proxy.
// Answers 200 whenever the Next server is up: it needs no reader password,
// reads no env var and never opens the SQLite database, so a missing secret
// or a locked volume cannot mark the container unhealthy.
export const dynamic = 'force-dynamic'

export function GET() {
  return Response.json(
    { status: 'ok' },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
