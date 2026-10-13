import { Link } from '@/lib/navigation'
import { cn } from '@/lib/shadcn'

interface SocialButtonProps {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  className?: string
}

export function SocialButton({
  href,
  icon: Icon,
  label,
  className,
}: SocialButtonProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group relative flex h-12 w-12 items-center justify-center',
        'rounded-2xl border border-border/30 bg-card',
        'drop-shadow-sm transition-all duration-200 ease-out',
        'hover:border-foreground/30 hover:bg-muted hover:drop-shadow-md',
        'motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-110 motion-safe:active:scale-95',
        className
      )}
    >
      <Icon className="h-5 w-5 text-muted-foreground/70 group-hover:text-foreground transition-[color,transform] duration-200 motion-safe:group-hover:rotate-6" />
      <span className="sr-only">{label}</span>
    </Link>
  )
}
