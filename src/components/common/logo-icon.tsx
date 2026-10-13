import { cn } from '@/lib/shadcn'
import { site } from '@/lib/site-data'
import Image from 'next/image'

interface Props {
  className?: string
}

export function LogoIcon({ className }: Props) {
  return (
    <Image
      src="/android-chrome-512x512.png"
      alt={site.profile.displayName}
      width={512}
      height={512}
      className={cn('w-auto h-10', className)}
    />
  )
}
