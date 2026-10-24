'use client'

import type { Highlight } from '@/lib/highlight-rules'
import {
  type RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useDocumentContext } from 'react-pdf'
import { PdfPageItem } from './pdf-page-item'

// Pages drawn beyond each edge of the visible area. Everything further away is
// an empty slot of the right size.
const RENDER_AROUND = 2
// Space between pages, in px (matches `gap-2` and the scroller's `p-2`).
const PAGE_GAP = 8
const NO_HIGHLIGHTS: Highlight[] = []

export interface PdfPageListHandle {
  scrollToPage: (page: number) => void
}

function groupByPage(highlights: Highlight[]) {
  const groups = new Map<number, Highlight[]>()
  for (const highlight of highlights) {
    const group = groups.get(highlight.page)
    if (group) {
      group.push(highlight)
    } else {
      groups.set(highlight.page, [highlight])
    }
  }
  return groups
}

// The ratio (height / width) of page 1, the size every slot reserves until
// its own page has loaded once.
function useDefaultRatio() {
  const { pdf } = useDocumentContext() ?? {}
  const [ratio, setRatio] = useState<number | null>(null)

  useEffect(() => {
    if (!pdf) {
      return
    }
    let isCurrent = true
    pdf
      .getPage(1)
      .then((page) => {
        const { width, height } = page.getViewport({ scale: 1 })
        if (isCurrent) {
          setRatio(height / width)
        }
      })
      // A page that cannot load still shows its own error in its slot.
      .catch(() => isCurrent && setRatio(Math.SQRT2))
    return () => {
      isCurrent = false
    }
  }, [pdf])

  return ratio
}

// The page that covers the vertical centre of the scroller, or the nearest
// one when the centre falls in the gap between two pages.
function findCentrePage(
  scroller: HTMLElement,
  elements: Map<number, HTMLDivElement>,
  candidates: Iterable<number>
) {
  const box = scroller.getBoundingClientRect()
  const centre = box.top + scroller.clientHeight / 2
  let best: number | null = null
  let bestDistance = Number.POSITIVE_INFINITY
  for (const page of candidates) {
    const rect = elements.get(page)?.getBoundingClientRect()
    if (!rect) {
      continue
    }
    const distance =
      centre < rect.top ? rect.top - centre : Math.max(0, centre - rect.bottom)
    if (distance < bestDistance) {
      best = page
      bestDistance = distance
    }
  }
  return best
}

// The continuous column: reserves every page's slot, draws only the pages in
// the render window, tracks the current page and scrolls to a page on demand.
export const PdfPageList = forwardRef<
  PdfPageListHandle,
  {
    bookId: string
    total: number
    width: number
    initialPage: number
    highlights: Highlight[]
    scrollRef: RefObject<HTMLDivElement>
    onPageChange: (page: number) => void
  }
>(function PdfPageList(
  { bookId, total, width, initialPage, highlights, scrollRef, onPageChange },
  ref
) {
  const defaultRatio = useDefaultRatio()
  const [ratios, setRatios] = useState<Record<number, number>>({})
  const [rendered, setRendered] = useState<ReadonlySet<number>>(new Set())
  const elements = useRef(new Map<number, HTMLDivElement>())
  const inWindow = useRef(new Set<number>())
  const observer = useRef<IntersectionObserver | null>(null)
  const currentPage = useRef(initialPage)
  // scrollTop right after a programmatic scroll: until the user scrolls away
  // from it, the requested page stays current, even if another page covers
  // the centre (at low zoom several pages fit on screen).
  const pinnedTop = useRef<number | null>(null)
  const frame = useRef(0)
  const hasRestored = useRef(false)

  const byPage = useMemo(() => groupByPage(highlights), [highlights])
  const slotHeight = width * (defaultRatio ?? 0)

  const report = useCallback(
    (page: number) => {
      if (page !== currentPage.current) {
        currentPage.current = page
        onPageChange(page)
      }
    },
    [onPageChange]
  )

  const updateCurrentPage = useCallback(() => {
    frame.current = 0
    const scroller = scrollRef.current
    if (!scroller) {
      return
    }
    if (pinnedTop.current !== null) {
      if (Math.abs(scroller.scrollTop - pinnedTop.current) < 1) {
        return
      }
      pinnedTop.current = null
    }
    const page = findCentrePage(scroller, elements.current, inWindow.current)
    if (page !== null) {
      report(page)
    }
  }, [report, scrollRef])

  // At most once per animation frame, however many scroll events arrive.
  const scheduleUpdate = useCallback(() => {
    if (!frame.current) {
      frame.current = requestAnimationFrame(updateCurrentPage)
    }
  }, [updateCurrentPage])

  const scrollToPage = useCallback(
    (page: number) => {
      const scroller = scrollRef.current
      const element = elements.current.get(page)
      if (!(scroller && element)) {
        return
      }
      const offset =
        element.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top
      // Instant on purpose: no scrolling animation to opt out of.
      scroller.scrollTo({
        top: scroller.scrollTop + offset - PAGE_GAP,
        behavior: 'instant',
      })
      pinnedTop.current = scroller.scrollTop
      report(page)
    },
    [report, scrollRef]
  )

  useImperativeHandle(ref, () => ({ scrollToPage }), [scrollToPage])

  // The render window is the area the observer watches: the scroller grown by
  // RENDER_AROUND page heights on each side. Pages entering it are drawn,
  // pages leaving it are unmounted. Rebuilt when the page height changes.
  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller || slotHeight <= 0) {
      return
    }
    // One pixel short of reaching a third page past the edge.
    const margin = Math.floor(
      RENDER_AROUND * (slotHeight + PAGE_GAP) - PAGE_GAP - 1
    )
    inWindow.current = new Set()
    const next = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const page = Number(
            (entry.target as HTMLElement).dataset.readerPage ?? 0
          )
          if (entry.isIntersecting) {
            inWindow.current.add(page)
          } else {
            inWindow.current.delete(page)
          }
        }
        setRendered(new Set(inWindow.current))
        scheduleUpdate()
      },
      { root: scroller, rootMargin: `${margin}px 0px` }
    )
    for (const element of elements.current.values()) {
      next.observe(element)
    }
    observer.current = next
    return () => {
      next.disconnect()
      observer.current = null
    }
  }, [scheduleUpdate, scrollRef, slotHeight])

  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) {
      return
    }
    scroller.addEventListener('scroll', scheduleUpdate, { passive: true })
    return () => {
      scroller.removeEventListener('scroll', scheduleUpdate)
      cancelAnimationFrame(frame.current)
      frame.current = 0
    }
  }, [scheduleUpdate, scrollRef])

  // Opening: jump to the saved page (or page 1) once the slots have a size.
  // After that, a new width (zoom, resize, panel) keeps the current page on
  // screen.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs on new width
  useLayoutEffect(() => {
    if (slotHeight <= 0) {
      return
    }
    if (!hasRestored.current) {
      hasRestored.current = true
      scrollToPage(initialPage)
      return
    }
    scrollToPage(currentPage.current)
  }, [slotHeight])

  const registerPage = useCallback(
    (page: number, element: HTMLDivElement | null) => {
      const previous = elements.current.get(page)
      if (previous) {
        observer.current?.unobserve(previous)
        elements.current.delete(page)
      }
      if (element) {
        elements.current.set(page, element)
        observer.current?.observe(element)
      }
    },
    []
  )

  const handleRatio = useCallback(
    (page: number, ratio: number) => {
      if (defaultRatio !== null && Math.abs(ratio - defaultRatio) < 0.001) {
        return
      }
      setRatios((current) =>
        current[page] === ratio ? current : { ...current, [page]: ratio }
      )
    },
    [defaultRatio]
  )

  if (defaultRatio === null) {
    return null
  }

  const pages = Array.from({ length: total }, (_, index) => index + 1)

  return (
    <div className="flex flex-col items-center gap-2">
      {pages.map((page) => (
        <PdfPageItem
          key={page}
          bookId={bookId}
          pageNumber={page}
          width={width}
          height={width * (ratios[page] ?? defaultRatio)}
          isRendered={rendered.has(page)}
          highlights={byPage.get(page) ?? NO_HIGHLIGHTS}
          registerPage={registerPage}
          onRatio={handleRatio}
        />
      ))}
    </div>
  )
})
