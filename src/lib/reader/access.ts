import {
  createHash,
  createHmac,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto'
import { cookies, headers } from 'next/headers'

// The single answer to "who is reading this request". Every protected page,
// action and route goes through here, so the future login replaces only this
// module. Today the only reader is the owner, unlocked by READER_PASSWORD.

export type Reader = 'conan'

export const OWNER: Reader = 'conan'
const COOKIE_NAME = 'reader_session'
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60

// Read on every call (never at module load) so `pnpm build` needs no env.
// Empty or blank counts as unset: compose passes `${READER_PASSWORD:-}` as ''.
function getPassword(): string | undefined {
  const password = process.env.READER_PASSWORD?.trim()
  return password ? password : undefined
}

export function isReaderAccessConfigured(): boolean {
  return getPassword() !== undefined
}

// The signing key derives from the password, so changing READER_PASSWORD
// invalidates every cookie already issued. scrypt is deliberately slow (about
// 100 ms), so a stolen cookie is costly to brute-force offline for the
// password; the fixed salt only separates this use from any other. Derived
// once per password value per process.
const KDF_SALT = 'conan-torres:reader-cookie:v2'
const KDF_OPTIONS = {
  cost: 2 ** 15,
  blockSize: 8,
  parallelization: 1,
  maxmem: 64 * 1024 * 1024,
}
const KEY_LENGTH = 32
let derived: { password: string; key: Buffer } | undefined

function deriveKey(password: string): Buffer {
  if (derived?.password !== password) {
    derived = {
      password,
      key: scryptSync(password, KDF_SALT, KEY_LENGTH, KDF_OPTIONS),
    }
  }
  return derived.key
}

function sign(payload: string, password: string): string {
  return createHmac('sha256', deriveKey(password))
    .update(payload)
    .digest('base64url')
}

function safeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b)
}

function sha256(value: string): Buffer {
  return createHash('sha256').update(value).digest()
}

function readSession(value: string, password: string): Reader | null {
  const [reader, expiresAt, signature] = value.split('.')
  if (!(reader && expiresAt && signature) || reader !== OWNER) {
    return null
  }

  const expected = sign(`${reader}.${expiresAt}`, password)
  if (!safeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null
  }

  return Number(expiresAt) > Date.now() ? OWNER : null
}

export async function getReader(): Promise<Reader | null> {
  const password = getPassword()
  if (!password) {
    return null
  }

  const value = (await cookies()).get(COOKIE_NAME)?.value
  return value ? readSession(value, password) : null
}

// Secure everywhere except plain-http development.
async function isSecureRequest(): Promise<boolean> {
  if (process.env.NODE_ENV === 'production') {
    return true
  }
  return (await headers()).get('x-forwarded-proto') === 'https'
}

export type SignInResult = 'ok' | 'wrong-password' | 'not-configured'

export async function signIn(candidate: string): Promise<SignInResult> {
  const password = getPassword()
  if (!password) {
    return 'not-configured'
  }
  // Hashing first gives equal-length buffers for the constant-time compare.
  if (!safeEqual(sha256(candidate), sha256(password))) {
    return 'wrong-password'
  }

  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000
  const payload = `${OWNER}.${expiresAt}`
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, `${payload}.${sign(payload, password)}`, {
    httpOnly: true,
    secure: await isSecureRequest(),
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
  return 'ok'
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete({ name: COOKIE_NAME, path: '/' })
}
