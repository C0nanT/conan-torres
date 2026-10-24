import { isPageCount } from './page-number'

// Highlight shape and validation shared by the viewer (client) and the server
// actions. Pure: no database or Node imports, so it is safe in the browser.

export const HIGHLIGHT_COLORS = ['yellow', 'green', 'blue', 'pink'] as const
export type HighlightColor = (typeof HIGHLIGHT_COLORS)[number]

export const MAX_HIGHLIGHT_TEXT = 2000
export const MAX_HIGHLIGHT_NOTE = 500
export const MAX_HIGHLIGHT_RECTS = 80
// Upper bound for a page number when the PDF's page count is not stored yet.
const MAX_PAGE_WITHOUT_TOTAL = 100_000

// A rectangle as fractions (0 to 1) of the page's width and height, so it
// redraws correctly at any zoom.
export interface HighlightRect {
  x: number
  y: number
  w: number
  h: number
}

export interface Highlight {
  id: string
  page: number
  color: HighlightColor
  text: string
  note: string | null
  rects: HighlightRect[]
  createdAt: string
}

export interface NewHighlight {
  page: number
  color: HighlightColor
  text: string
  note: string | null
  rects: HighlightRect[]
}

// Float slack for rects that touch the page edge.
const EDGE_SLACK = 0.001

export function isHighlightColor(value: unknown): value is HighlightColor {
  return HIGHLIGHT_COLORS.some((color) => color === value)
}

function isFraction(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 1 + EDGE_SLACK
  )
}

function parseRect(raw: unknown): HighlightRect | null {
  if (typeof raw !== 'object' || raw === null) {
    return null
  }
  const { x, y, w, h } = raw as Record<string, unknown>
  if (!(isFraction(x) && isFraction(y) && isFraction(w) && isFraction(h))) {
    return null
  }
  if (w <= 0 || h <= 0 || x + w > 1 + EDGE_SLACK || y + h > 1 + EDGE_SLACK) {
    return null
  }
  return { x, y, w, h }
}

function parseRects(raw: unknown): HighlightRect[] | null {
  if (
    !Array.isArray(raw) ||
    raw.length === 0 ||
    raw.length > MAX_HIGHLIGHT_RECTS
  ) {
    return null
  }
  const rects: HighlightRect[] = []
  for (const item of raw) {
    const rect = parseRect(item)
    if (!rect) {
      return null
    }
    rects.push(rect)
  }
  return rects
}

function parseNote(raw: unknown): { ok: true; note: string | null } | null {
  if (raw === null || raw === undefined) {
    return { ok: true, note: null }
  }
  if (typeof raw !== 'string' || raw.length > MAX_HIGHLIGHT_NOTE) {
    return null
  }
  return { ok: true, note: raw.trim() || null }
}

// Returns a clean highlight or null when anything is out of range. `total` is
// the stored page count, or null when not known yet.
export function parseNewHighlight(
  raw: unknown,
  total: number | null
): NewHighlight | null {
  if (typeof raw !== 'object' || raw === null) {
    return null
  }
  const input = raw as Record<string, unknown>

  const { page, color } = input
  if (!isPageCount(page) || page > (total ?? MAX_PAGE_WITHOUT_TOTAL)) {
    return null
  }
  if (!isHighlightColor(color)) {
    return null
  }
  if (typeof input.text !== 'string') {
    return null
  }
  const text = input.text.trim()
  if (text.length === 0 || text.length > MAX_HIGHLIGHT_TEXT) {
    return null
  }
  const parsedNote = parseNote(input.note)
  const rects = parseRects(input.rects)
  if (!(parsedNote && rects)) {
    return null
  }

  return { page, color, text, note: parsedNote.note, rects }
}
