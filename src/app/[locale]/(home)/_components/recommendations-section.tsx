'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/shadcn'
import { type Recommendation, site } from '@/lib/site-data'
import { Linkedin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type KeyboardEvent, useId, useRef, useState } from 'react'
import { RecommendationAvatar } from './recommendation-avatar'

function Meta({ item }: { item: Recommendation }) {
  return (
    <>
      <p className="font-bold">{item.name}</p>
      <p className="text-sm text-muted-foreground">{item.headline}</p>
      <p className="text-xs text-muted-foreground">
        {[item.date, item.relationship].filter(Boolean).join(' · ')}
      </p>
    </>
  )
}

export function RecommendationsSection() {
  const t = useTranslations('recommendations')
  const items = site.recommendations
  const baseId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [selectedId, setSelectedId] = useState(items[0]?.id)
  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => item.id === selectedId)
  )
  const selected = items[selectedIndex]
  if (!selected) {
    return null
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = items.length - 1
    let next: number
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      next = selectedIndex === last ? 0 : selectedIndex + 1
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      next = selectedIndex === 0 ? last : selectedIndex - 1
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = last
    } else {
      return
    }
    event.preventDefault()
    const nextItem = items[next]
    if (nextItem) {
      setSelectedId(nextItem.id)
      tabRefs.current[next]?.focus()
    }
  }

  return (
    <section id="recomendacoes" className="bg-muted/30 py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <Badge
            variant="outline"
            className="px-3 py-1 motion-safe:hover:scale-100"
          >
            <Linkedin className="mr-1 h-3 w-3" />
            {t('badge')}
          </Badge>
          <h2 className="text-3xl font-bold lg:text-4xl">
            {t('titlePrefix')}{' '}
            <span className="gradient-text">{t('titleHighlight')}</span>
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-[260px_1fr] md:gap-12">
          <div
            role="tablist"
            aria-orientation="vertical"
            onKeyDown={handleKeyDown}
            className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible"
          >
            {items.map((item, index) => {
              const isSelected = item.id === selected.id
              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    tabRefs.current[index] = node
                  }}
                  id={`${baseId}-tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isSelected
                      ? 'border-primary/40 bg-background'
                      : 'border-transparent hover:bg-background/60'
                  )}
                >
                  <RecommendationAvatar person={item} size="sm" />
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              )
            })}
          </div>
          <figure
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${selected.id}`}
            className="relative"
          >
            <span
              aria-hidden={true}
              className="absolute -top-6 -left-2 text-7xl font-serif text-primary/20"
            >
              “
            </span>
            <blockquote className="whitespace-pre-line text-lg leading-relaxed lg:text-xl">
              {selected.text}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
              <RecommendationAvatar person={selected} />
              <div>
                <Meta item={selected} />
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
