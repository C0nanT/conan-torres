'use client'

import { cn } from '@/lib/shadcn'
import { useTranslations } from 'next-intl'
import { useId, useState } from 'react'

const COLLAPSE_THRESHOLD = 280

interface ExpandableTextProps {
  text: string
}

export function ExpandableText({ text }: ExpandableTextProps) {
  const t = useTranslations('recommendations')
  const [isExpanded, setIsExpanded] = useState(false)
  const textId = useId()
  const canExpand = text.length > COLLAPSE_THRESHOLD

  const handleToggle = () => {
    setIsExpanded((current) => !current)
  }

  return (
    <div className="space-y-2">
      <p
        id={textId}
        className={cn(
          'whitespace-pre-line text-muted-foreground',
          canExpand && !isExpanded && 'line-clamp-6'
        )}
      >
        {text}
      </p>
      {canExpand && (
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={isExpanded}
          aria-controls={textId}
          className="rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isExpanded ? t('readLess') : t('readMore')}
        </button>
      )}
    </div>
  )
}
