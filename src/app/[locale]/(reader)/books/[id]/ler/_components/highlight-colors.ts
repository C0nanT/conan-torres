import type { HighlightColor } from '@/lib/highlight-rules'

// Paint for each fixed colour: `fill` over the text (blended, so the text
// stays readable) and `solid` for swatches and list markers.
export const HIGHLIGHT_PAINT: Record<
  HighlightColor,
  { fill: string; solid: string }
> = {
  yellow: { fill: 'rgba(250, 204, 21, 0.5)', solid: '#facc15' },
  green: { fill: 'rgba(74, 222, 128, 0.5)', solid: '#4ade80' },
  blue: { fill: 'rgba(96, 165, 250, 0.5)', solid: '#60a5fa' },
  pink: { fill: 'rgba(244, 114, 182, 0.5)', solid: '#f472b6' },
}
