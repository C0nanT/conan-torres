'use client'

import { cn } from '@/lib/styling'
import type { ButtonHTMLAttributes } from 'react'

interface SwitchProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'onChange' | 'role' | 'type'
  > {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function Switch({
  checked,
  onCheckedChange,
  className,
  ...props
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'inline-flex h-4 w-7 shrink-0 items-center rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        checked ? 'bg-primary' : 'bg-input',
        className
      )}
      {...props}
    >
      <span
        aria-hidden={true}
        className={cn(
          'pointer-events-none block h-3 w-3 rounded-full bg-background shadow transition-transform motion-reduce:transition-none',
          checked ? 'translate-x-3' : 'translate-x-0.5'
        )}
      />
    </button>
  )
}
