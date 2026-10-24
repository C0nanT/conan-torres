'use server'

import { signIn, signOut } from '@/lib/reader-access'
import {
  clearFailures,
  getClientIp,
  getLockRemainingMs,
  recordFailure,
} from '@/lib/reader-rate-limit'

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
