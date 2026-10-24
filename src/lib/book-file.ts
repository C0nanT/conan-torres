import { createWriteStream } from 'node:fs'
import { mkdir, rename, rm, stat } from 'node:fs/promises'
import path from 'node:path'
import { Readable, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type { ReadableStream as NodeReadableStream } from 'node:stream/web'
import { type BookFileFailure, logBookFileFailure } from './book-file-log'

// Server-side copy of a book PDF that lives in Google Drive ("anyone with the
// link"). The Drive file ID comes from BOOK_FILE_<BOOK_ID_IN_CONSTANT_CASE>
// and never leaves the server: callers only get a local path or a reason code.

const DRIVE_DOWNLOAD_URL = 'https://drive.usercontent.google.com/download'
const DOWNLOAD_TIMEOUT_MS = 120_000
const MAX_BYTES = 300 * 1024 * 1024
const MAX_CONFIRM_PAGE_CHARS = 512 * 1024
const PDF_MAGIC = '%PDF-'
const BOOK_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const CACHE_DIR = path.join(process.cwd(), '.next', 'cache', 'book-files')

export type BookFileResult =
  | { ok: true; path: string; size: number }
  | { ok: false; reason: BookFileFailure }

interface FailureInfo {
  reason: BookFileFailure
  detail?: string
}

// Errors thrown inside this module carry their reason code here, keyed by the
// Error itself, so they stay plain Errors (the stream pipeline needs one) and
// the catch in fetchAndCache can tell them from unexpected ones.
const failureInfo = new WeakMap<Error, FailureInfo>()

function bookFileFailure(reason: BookFileFailure, detail?: string): Error {
  const error = new Error(reason)
  failureInfo.set(error, { reason, detail })
  return error
}

function getFailureInfo(error: unknown): FailureInfo | undefined {
  return error instanceof Error ? failureInfo.get(error) : undefined
}

export function getBookFileEnvName(bookId: string): string {
  return `BOOK_FILE_${bookId.replaceAll('-', '_').toUpperCase()}`
}

function getCachePath(bookId: string): string {
  return path.join(CACHE_DIR, `${bookId}.pdf`)
}

async function readSize(file: string): Promise<number | null> {
  try {
    const info = await stat(file)
    return info.isFile() && info.size > 0 ? info.size : null
  } catch {
    return null
  }
}

async function fetchDrive(url: URL): Promise<Response> {
  let res: Response
  try {
    res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
    })
  } catch (error) {
    throw bookFileFailure(
      'drive-failed',
      error instanceof Error ? error.name : 'erro'
    )
  }
  if (res.status === 404) {
    throw bookFileFailure('not-found', '404')
  }
  if (!res.ok) {
    throw bookFileFailure('drive-failed', String(res.status))
  }
  return res
}

function isHtml(res: Response): boolean {
  return (res.headers.get('content-type') ?? '').startsWith('text/html')
}

// Drive's "can't scan for viruses" page carries a GET form with hidden inputs
// (id, export, confirm, uuid...). Merging them into the action query is the
// documented way through (same approach as gdown).
function parseConfirmForm(html: string): URL | null {
  const form = html.match(
    /<form[^>]*id="download-form"[^>]*action="([^"]+)"[^>]*>([\s\S]*?)<\/form>/
  )
  if (!form?.[1]) {
    return null
  }
  let action: URL
  try {
    action = new URL(form[1].replaceAll('&amp;', '&'))
  } catch {
    return null
  }
  if (action.hostname !== new URL(DRIVE_DOWNLOAD_URL).hostname) {
    return null
  }
  for (const input of (form[2] ?? '').matchAll(/<input[^>]*>/g)) {
    const tag = input[0]
    if (!tag.includes('type="hidden"')) {
      continue
    }
    const name = tag.match(/name="([^"]*)"/)?.[1]
    const value = tag.match(/value="([^"]*)"/)?.[1] ?? ''
    if (name) {
      action.searchParams.set(name, value.replaceAll('&amp;', '&'))
    }
  }
  return action
}

async function openPdfResponse(fileId: string): Promise<Response> {
  const first = new URL(DRIVE_DOWNLOAD_URL)
  first.searchParams.set('id', fileId)
  first.searchParams.set('export', 'download')
  first.searchParams.set('confirm', 't')

  const res = await fetchDrive(first)
  if (!isHtml(res)) {
    return res
  }

  const html = (await res.text()).slice(0, MAX_CONFIRM_PAGE_CHARS)
  const confirmUrl = parseConfirmForm(html)
  if (!confirmUrl) {
    // Sign-in wall (private file), error page or an unknown interstitial.
    throw bookFileFailure(
      html.includes('download-form') ? 'confirm-page' : 'not-pdf',
      'html'
    )
  }
  const confirmed = await fetchDrive(confirmUrl)
  if (isHtml(confirmed)) {
    throw bookFileFailure('confirm-page', 'html-again')
  }
  return confirmed
}

// Fails the pipeline when the stream is not a PDF or grows past the cap.
function createPdfGuard(): Transform {
  let seen = 0
  let isChecked = false
  return new Transform({
    transform(chunk: Buffer, _encoding, callback) {
      if (!isChecked) {
        isChecked = true
        const head = chunk.subarray(0, PDF_MAGIC.length).toString('latin1')
        if (head !== PDF_MAGIC) {
          callback(bookFileFailure('not-pdf', 'magic'))
          return
        }
      }
      seen += chunk.length
      if (seen > MAX_BYTES) {
        callback(bookFileFailure('too-large'))
        return
      }
      callback(null, chunk)
    },
  })
}

async function download(fileId: string, target: string): Promise<void> {
  const res = await openPdfResponse(fileId)
  if (!res.body) {
    throw bookFileFailure('drive-failed', 'empty-body')
  }

  await mkdir(CACHE_DIR, { recursive: true })
  const temp = `${target}.${process.pid}.${Date.now()}.tmp`
  try {
    await pipeline(
      // Same object at runtime; TS types fetch's DOM stream and Node's web
      // stream separately, and no guard can bridge them.
      Readable.fromWeb(res.body as NodeReadableStream),
      createPdfGuard(),
      createWriteStream(temp)
    )
    if ((await readSize(temp)) === null) {
      throw bookFileFailure('not-pdf', 'empty')
    }
    await rename(temp, target)
  } catch (error) {
    await rm(temp, { force: true })
    if (getFailureInfo(error)) {
      throw error
    }
    const name = error instanceof Error ? error.name : 'erro'
    throw bookFileFailure(
      name === 'TimeoutError' || name === 'AbortError'
        ? 'drive-failed'
        : 'io-error',
      name
    )
  }
}

async function fetchAndCache(bookId: string): Promise<BookFileResult> {
  const target = getCachePath(bookId)
  const cachedSize = await readSize(target)
  if (cachedSize !== null) {
    return { ok: true, path: target, size: cachedSize }
  }

  try {
    if (!BOOK_ID_PATTERN.test(bookId)) {
      throw bookFileFailure('invalid-book-id')
    }
    const envName = getBookFileEnvName(bookId)
    const fileId = process.env[envName]?.trim()
    if (!fileId) {
      throw bookFileFailure('missing-env', envName)
    }
    await download(fileId, target)
    const size = await readSize(target)
    if (size === null) {
      throw bookFileFailure('io-error', 'missing-after-rename')
    }
    return { ok: true, path: target, size }
  } catch (error) {
    const failure = getFailureInfo(error) ?? {
      reason: 'io-error',
      detail: 'unexpected',
    }
    logBookFileFailure(bookId, failure.reason, failure.detail)
    return { ok: false, reason: failure.reason }
  }
}

// Concurrent requests for the same book share one download.
const inFlight = new Map<string, Promise<BookFileResult>>()

export function ensureBookFile(bookId: string): Promise<BookFileResult> {
  const pending = inFlight.get(bookId)
  if (pending) {
    return pending
  }
  const started = fetchAndCache(bookId).finally(() => {
    inFlight.delete(bookId)
  })
  inFlight.set(bookId, started)
  return started
}
