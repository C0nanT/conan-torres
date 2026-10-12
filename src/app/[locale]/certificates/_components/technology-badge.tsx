import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/shadcn'
import { getTechnologyGroup } from '@/lib/technology-groups'
import type { CSSProperties } from 'react'

// The group colour is a tinted background plus border; text stays foreground
// so contrast holds in both themes for any hue.
export function TechnologyBadge({
  label,
  isActive = false,
  isDimmed = false,
}: {
  label: string
  isActive?: boolean
  isDimmed?: boolean
}) {
  const color = getTechnologyGroup(label)?.color
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
      className={cn(
        'transition-opacity',
        isActive ? 'font-bold' : 'font-medium',
        isDimmed && 'opacity-40'
      )}
    >
      {label}
    </Badge>
  )
}
