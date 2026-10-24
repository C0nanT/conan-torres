import type { Highlight } from '@/lib/highlight-rules'
import { HIGHLIGHT_PAINT } from './highlight-colors'

// Paints the highlights of the page on screen over its text. Positions are
// percentages of the page box, so they follow any zoom. Pointer events pass
// through, so text selection keeps working underneath.
export function HighlightLayer({ highlights }: { highlights: Highlight[] }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] mix-blend-multiply"
    >
      {highlights.map((highlight) =>
        highlight.rects.map((rect) => (
          <div
            key={`${highlight.id}-${rect.x}-${rect.y}-${rect.w}`}
            data-highlight-id={highlight.id}
            className="absolute rounded-[2px]"
            style={{
              left: `${rect.x * 100}%`,
              top: `${rect.y * 100}%`,
              width: `${rect.w * 100}%`,
              height: `${rect.h * 100}%`,
              backgroundColor: HIGHLIGHT_PAINT[highlight.color].fill,
            }}
          />
        ))
      )}
    </div>
  )
}
