// Page-number rules shared by the reader form (client) and the save action
// (server). Pure: no database or Node imports, so it is safe in the browser.

const DIGITS_ONLY = /^\d+$/

// Accepts a whole number between 1 and `total` (inclusive). Anything else
// (empty, decimal, negative, zero, past the end) returns null.
export function parsePageNumber(raw: unknown, total: number): number | null {
  const text = typeof raw === 'number' ? String(raw) : raw
  if (typeof text !== 'string' || !DIGITS_ONLY.test(text.trim())) {
    return null
  }
  const page = Number(text.trim())
  return Number.isSafeInteger(page) && page >= 1 && page <= total ? page : null
}

export function isPageCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0
}
