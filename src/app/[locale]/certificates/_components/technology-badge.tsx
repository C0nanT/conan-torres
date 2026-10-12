import { Badge } from '@/components/ui/badge'
import { getTechnologyColor } from '@/lib/technology-colors'
import type { CSSProperties } from 'react'

// The colour is a tinted background plus border; text stays foreground so contrast holds in
// both themes for any hue.
export function TechnologyBadge({
  label,
  isActive = false,
}: {
  label: string
  isActive?: boolean
}) {
  const color = getTechnologyColor(label)
  const style = color
    ? ({
        backgroundColor: `color-mix(in srgb, ${color} ${isActive ? 28 : 12}%, transparent)`,
        borderColor: `color-mix(in srgb, ${color} ${isActive ? 90 : 35}%, transparent)`,
      } satisfies CSSProperties)
    : undefined

  return (
    <Badge
      variant="outline"
      style={style}
      className={isActive ? 'font-bold' : 'font-medium'}
    >
      {label}
    </Badge>
  )
}
