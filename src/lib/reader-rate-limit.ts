import { headers } from 'next/headers'

// In-memory lockout for wrong reader passwords, per client IP. Counters live in
// this process only, so a restart clears every lock (accepted by the spec).

const MAX_FAILURES = 3
const LOCK_DURATION_MS = 20 * 60 * 1000
// Past this many tracked IPs the least recently active ones are dropped, so a
// flood of spoofed addresses cannot grow the map without bound.
const MAX_TRACKED_IPS = 10_000

interface AttemptEntry {
  failures: number
  lastFailureAt: number
  lockedUntil?: number
}

declare global {
  // Kept on globalThis so dev hot reloads do not reset the counters.
  var readerAttempts: Map<string, AttemptEntry> | undefined
}
globalThis.readerAttempts ??= new Map<string, AttemptEntry>()
const attempts = globalThis.readerAttempts

function isExpired(entry: AttemptEntry, now: number): boolean {
  return entry.lockedUntil === undefined
    ? entry.lastFailureAt + LOCK_DURATION_MS <= now
    : entry.lockedUntil <= now
}

function pruneExpired(now: number): void {
  for (const [ip, entry] of attempts) {
    if (isExpired(entry, now)) {
      attempts.delete(ip)
    }
  }
}

// Re-inserting keeps the map ordered by last activity, oldest first.
function touch(ip: string, entry: AttemptEntry): void {
  attempts.delete(ip)
  attempts.set(ip, entry)
  for (const oldest of attempts.keys()) {
    if (attempts.size <= MAX_TRACKED_IPS) {
      break
    }
    attempts.delete(oldest)
  }
}

function toMinutes(ms: number): number {
  return Math.ceil(ms / 60_000)
}

// First hop of x-forwarded-for. Behind a proxy that is the client the proxy
// saw; without one, Next's server fills the header with the socket address.
// x-real-ip and a shared 'unknown' bucket are last-resort fallbacks.
export async function getClientIp(): Promise<string> {
  const headerList = await headers()
  const forwarded = headerList.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || headerList.get('x-real-ip')?.trim() || 'unknown'
}

/** Whole minutes until `ip` may try again, or 0 when it is not locked. */
export function getLockMinutesLeft(ip: string): number {
  const now = Date.now()
  pruneExpired(now)
  const lockedUntil = attempts.get(ip)?.lockedUntil
  return lockedUntil === undefined ? 0 : toMinutes(lockedUntil - now)
}

export type AttemptCheck =
  | { isAllowed: false; minutesLeft: number }
  /** `lockMinutesIfWrong` is 0 unless this try is the last one allowed. */
  | { isAllowed: true; lockMinutesIfWrong: number }

/**
 * Counts a password attempt as a failure up front, before the password is
 * compared, so parallel requests cannot all pass the lock check. Synchronous
 * on purpose: nothing can interleave between the check and the count. Call
 * `clearFailures` when the password turns out right.
 */
export function registerAttempt(ip: string): AttemptCheck {
  const minutesLeft = getLockMinutesLeft(ip)
  if (minutesLeft > 0) {
    return { isAllowed: false, minutesLeft }
  }
  const now = Date.now()
  const entry = attempts.get(ip) ?? { failures: 0, lastFailureAt: now }
  entry.failures += 1
  entry.lastFailureAt = now
  const isLastTry = entry.failures >= MAX_FAILURES
  if (isLastTry) {
    entry.lockedUntil = now + LOCK_DURATION_MS
  }
  touch(ip, entry)
  return {
    isAllowed: true,
    lockMinutesIfWrong: isLastTry ? toMinutes(LOCK_DURATION_MS) : 0,
  }
}

export function clearFailures(ip: string): void {
  attempts.delete(ip)
}
