'use client'

import {
  type HighlightRect,
  MAX_HIGHLIGHT_RECTS,
  MAX_HIGHLIGHT_TEXT,
} from '@/lib/highlight-rules'
import { type RefObject, useEffect, useState } from 'react'
import { PAGE_SELECTOR } from './page-selector'

const TEXT_LAYER = '.react-pdf__Page__textContent'
const SETTLE_MS = 200
const MIN_FRACTION = 0.0005

export interface TextSelection {
  // The page where the selection started; the rects are fractions of it.
  page: number
  text: string
  rects: HighlightRect[]
  isTooLong: boolean
  // The selection went on into another page, whose part was dropped.
  isLimited: boolean
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

// A highlight belongs to one page. A drag that ends outside the text layer
// (past the page edge, into the toolbar or into the next page) is clamped to
// the layer of the page where it started: only that part is kept.
function clampToLayer(range: Range, layer: Element): Range | null {
  const bounds = document.createRange()
  bounds.selectNodeContents(layer)
  if (
    range.compareBoundaryPoints(Range.END_TO_START, bounds) > 0 ||
    range.compareBoundaryPoints(Range.START_TO_END, bounds) < 0
  ) {
    return null
  }
  const clamped = range.cloneRange()
  if (range.compareBoundaryPoints(Range.START_TO_START, bounds) < 0) {
    clamped.setStart(bounds.startContainer, bounds.startOffset)
  }
  if (range.compareBoundaryPoints(Range.END_TO_END, bounds) > 0) {
    clamped.setEnd(bounds.endContainer, bounds.endOffset)
  }
  return clamped
}

function contains(outer: HighlightRect, inner: HighlightRect) {
  const slack = 0.0005
  return (
    outer !== inner &&
    outer.x <= inner.x + slack &&
    outer.y <= inner.y + slack &&
    outer.x + outer.w >= inner.x + inner.w - slack &&
    outer.y + outer.h >= inner.y + inner.h - slack
  )
}

// A range reports a box per element and per text node, so wrappers and
// duplicates are dropped and only the innermost line boxes remain.
function toRects(range: Range, page: Element): HighlightRect[] {
  const box = page.getBoundingClientRect()
  if (box.width === 0 || box.height === 0) {
    return []
  }
  const rects: HighlightRect[] = []
  for (const r of range.getClientRects()) {
    const x = clamp01((r.left - box.left) / box.width)
    const y = clamp01((r.top - box.top) / box.height)
    const w = clamp01((r.right - box.left) / box.width) - x
    const h = clamp01((r.bottom - box.top) / box.height) - y
    if (w > MIN_FRACTION && h > MIN_FRACTION) {
      rects.push({ x, y, w, h })
    }
  }
  const unique = rects.filter(
    (rect, index) =>
      !rects.some(
        (other, otherIndex) =>
          contains(rect, other) &&
          // Identical boxes: keep the first.
          !(contains(other, rect) && index < otherIndex)
      )
  )
  return unique
}

// The text layer has one span per line or run, with no whitespace between
// them, so Range.toString() glues lines together ("...poucosPagina"). Join
// the selected spans with a space instead.
function readText(range: Range): string {
  const spans = [...range.cloneContents().querySelectorAll('span')].filter(
    (span) => span.querySelector('span') === null
  )
  if (spans.length === 0) {
    return range.toString()
  }
  return spans.map((span) => span.textContent ?? '').join(' ')
}

function pageOf(node: Node | null): HTMLElement | null {
  const element = node instanceof Element ? node : node?.parentElement
  return element?.closest<HTMLElement>(PAGE_SELECTOR) ?? null
}

// The anchor is where the drag began, also when it went backwards.
function readSelection(container: Element): TextSelection | null {
  const selection = document.getSelection()
  if (!selection || selection.isCollapsed || !selection.rangeCount) {
    return null
  }
  const page = pageOf(selection.anchorNode)
  const layer = page?.querySelector(TEXT_LAYER)
  if (!(page && layer && container.contains(page))) {
    return null
  }
  const original = selection.getRangeAt(0)
  const range = clampToLayer(original, layer)
  if (!range) {
    return null
  }
  const text = readText(range).replace(/\s+/g, ' ').trim()
  if (!text) {
    return null
  }
  const rects = toRects(range, page)
  if (rects.length === 0) {
    return null
  }
  const isLimited = [...container.querySelectorAll(PAGE_SELECTOR)].some(
    (other) => other !== page && original.intersectsNode(other)
  )
  return {
    page: Number(page.dataset.readerPage),
    text,
    rects,
    isTooLong:
      text.length > MAX_HIGHLIGHT_TEXT || rects.length > MAX_HIGHLIGHT_RECTS,
    isLimited,
  }
}

// Watches the document selection and exposes the part of it that lies on the
// page where it started, inside `containerRef`. While `isFrozen` the last
// captured selection is kept: tapping the composer clears the browser's
// selection, but not this copy.
export function useTextSelection(
  containerRef: RefObject<HTMLElement>,
  isFrozen: boolean
) {
  const [selection, setSelection] = useState<TextSelection | null>(null)

  useEffect(() => {
    if (isFrozen) {
      return
    }
    let timer: ReturnType<typeof setTimeout> | undefined
    const handleChange = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const container = containerRef.current
        setSelection(container ? readSelection(container) : null)
      }, SETTLE_MS)
    }
    document.addEventListener('selectionchange', handleChange)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('selectionchange', handleChange)
    }
  }, [isFrozen, containerRef])

  const clear = () => {
    document.getSelection()?.removeAllRanges()
    setSelection(null)
  }

  return { selection, clear }
}
