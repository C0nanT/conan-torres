import { site } from '@/lib/site-data'
import { cn } from '@/lib/styling'
import { LogoIcon } from './logo-icon'

interface Props {
  className?: string
}

export function LogoHorizontal({ className }: Props) {
  return (
    <span
      role="img"
      aria-label={site.profile.displayName}
      className={cn('flex items-center gap-3', className)}
    >
      <LogoIcon className="h-10" />
      <span
        aria-hidden="true"
        className="text-2xl font-bold tracking-tight text-foreground"
      >
        {site.site.name}
      </span>
    </span>
  )
}
