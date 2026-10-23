import { cn } from '@/lib/shadcn'
import type { Recommendation } from '@/lib/site-data'
import Image from 'next/image'

interface RecommendationAvatarProps {
  person: Pick<Recommendation, 'name' | 'photo'>
  size?: 'sm' | 'md'
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

export function RecommendationAvatar({
  person,
  size = 'md',
}: RecommendationAvatarProps) {
  const sizeClass = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-11 w-11 text-sm'

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary',
        sizeClass
      )}
    >
      {person.photo ? (
        <Image
          src={person.photo}
          alt=""
          fill={true}
          sizes={size === 'sm' ? '32px' : '44px'}
          className="object-cover"
        />
      ) : (
        <span aria-hidden={true}>{getInitials(person.name)}</span>
      )}
    </span>
  )
}
