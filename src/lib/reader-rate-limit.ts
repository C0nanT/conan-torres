import { headers } from 'next/headers'

// In-memory lockout for wrong reader passwords, per client IP. Counters live in
// this process only, so a restart clears every lock (accepted by the spec).

const MAX_FAILURES = 3
const LOCK_DURATION_MS = 20 * 60 * 1000

interface AttemptEntry {
  failures: number
  lockedUntil?: number
}

// Kept on globalThis so dev hot reloads do not reset the counters.
const store = globalThis as typeof globalThis & {
  readerAttempts?: Map<string, AttemptEntry>
}
store.readerAttempts ??= new Map<string, AttemptEntry>()
const attempts = store.readerAttempts

function pruneExpired(now: number): void {
  for (const [ip, entry] of attempts) {
    if (entry.lockedUntil !== undefined && entry.lockedUntil <= now) {
      attempts.delete(ip)
    }
  }
}

// First hop of x-forwarded-for. Behind a proxy that is the client the proxy
// saw; without one, Next's server fills the header with the socket address.
// x-real-ip and a shared 'unknown' bucket are last-resort fallbacks.
export async function getClientIp(): Promise<string> {
  const headerList = await headers()
  const forwarded = headerList.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || headerList.get('x-real-ip')?.trim() || 'unknown'
}

/** Milliseconds until `ip` may try again, or 0 when it is not locked. */
export function getLockRemainingMs(ip: string): number {
  const now = Date.now()
  pruneExpired(now)
  const lockedUntil = attempts.get(ip)?.lockedUntil
  return lockedUntil === undefined ? 0 : lockedUntil - now
}

/** Records a wrong attempt and returns the lock time left (0 if unlocked). */
export function recordFailure(ip: string): number {
  const entry = attempts.get(ip) ?? { failures: 0 }
  entry.failures += 1
  if (entry.failures >= MAX_FAILURES) {
    entry.lockedUntil = Date.now() + LOCK_DURATION_MS
  }
  attempts.set(ip, entry)
  return entry.lockedUntil === undefined ? 0 : LOCK_DURATION_MS
}

export function clearFailures(ip: string): void {
  attempts.delete(ip)
}
