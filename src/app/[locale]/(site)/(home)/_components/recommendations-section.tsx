'use client'

import { Badge } from '@/components/ui/badge'
import { type Recommendation, site } from '@/lib/site-data'
import { cn } from '@/lib/styling'
import {
  AnimatePresence,
  type Variants,
  motion,
  useReducedMotion,
} from 'framer-motion'
import { ExternalLink, Linkedin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react'
import { RecommendationAvatar } from './recommendation-avatar'

// ~200 palavras/min: confortável para ler sem pressa
const READING_MS_PER_WORD = 300
const MIN_READING_MS = 6000
// a barra só aparece depois que o destaque termina de chegar no autor; o
// tempo de leitura total continua o mesmo, a contagem é que começa depois
const BAR_DELAY_MS = 500

function getReadingTimeMs(text: string) {
  const words = text.trim().split(/\s+/).length
  return Math.max(MIN_READING_MS, words * READING_MS_PER_WORD)
}

const PANEL_OFFSET = 16

// direction 1 = próximo (o texto "desce" na lista: sai por cima e o novo
// entra por baixo); -1 = anterior, o inverso. direction 0 = sem deslocamento.
const panelVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, y: direction * PANEL_OFFSET }),
  center: { opacity: 1, y: 0 },
  exit: (direction: number) => ({ opacity: 0, y: -direction * PANEL_OFFSET }),
}

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
  const listRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const isStill = useReducedMotion() ?? false
  const [selectedId, setSelectedId] = useState(items[0]?.id)
  const [direction, setDirection] = useState<1 | -1>(1)
  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => item.id === selectedId)
  )
  const selected = items[selectedIndex]

  // Na lista horizontal (mobile) mantém o autor ativo à vista; só rola a
  // própria lista, nunca a página.
  useEffect(() => {
    const list = listRef.current
    const tab = tabRefs.current[selectedIndex]
    if (!(list && tab)) {
      return
    }
    if (list.scrollWidth <= list.clientWidth) {
      return
    }
    const isReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    list.scrollTo({
      left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2,
      behavior: isReducedMotion ? 'auto' : 'smooth',
    })
  }, [selectedIndex])

  if (!selected) {
    return null
  }

  const selectPerson = (index: number, nextDirection: 1 | -1) => {
    const item = items[index]
    if (item) {
      setDirection(nextDirection)
      setSelectedId(item.id)
    }
  }

  const handleCountdownEnd = () => {
    selectPerson((selectedIndex + 1) % items.length, 1)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = items.length - 1
    let next: number
    let nextDirection: 1 | -1
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      next = selectedIndex === last ? 0 : selectedIndex + 1
      nextDirection = 1
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      next = selectedIndex === 0 ? last : selectedIndex - 1
      nextDirection = -1
    } else if (event.key === 'Home') {
      next = 0
      nextDirection = -1
    } else if (event.key === 'End') {
      next = last
      nextDirection = 1
    } else {
      return
    }
    event.preventDefault()
    selectPerson(next, nextDirection)
    tabRefs.current[next]?.focus()
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
          <a
            href={site.social.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t('viewAll')}
            <ExternalLink aria-hidden={true} className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="group grid gap-8 md:grid-cols-[260px_1fr] md:gap-12">
          <div
            ref={listRef}
            role="tablist"
            aria-orientation="vertical"
            onKeyDown={handleKeyDown}
            className="relative flex gap-2 overflow-x-auto md:flex-col md:overflow-visible"
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
                  onClick={() =>
                    selectPerson(index, index > selectedIndex ? 1 : -1)
                  }
                  className={cn(
                    'relative flex shrink-0 items-center rounded-lg border border-transparent px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    !isSelected && 'hover:bg-background/60'
                  )}
                >
                  {/* Um único destaque compartilhado: ao trocar de autor ele
                      desliza (desce) até o novo item em vez de reaparecer. */}
                  {isSelected && (
                    <motion.span
                      layoutId={`${baseId}-active`}
                      aria-hidden={true}
                      transition={
                        isStill
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 380, damping: 34 }
                      }
                      className="absolute inset-0 rounded-lg border border-primary/40 bg-background"
                    />
                  )}
                  <span className="relative flex items-center gap-3">
                    <RecommendationAvatar person={item} size="sm" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </span>
                  {/* Cada autor tem a própria barra, montada só na vez dele
                      (a montagem reinicia a animação). Sem animação
                      (prefers-reduced-motion) não há contagem nem troca
                      automática; com um só autor não há para onde ir. */}
                  {isSelected && items.length > 1 && (
                    <span
                      aria-hidden={true}
                      style={{ animationDelay: `${BAR_DELAY_MS}ms` }}
                      className="absolute inset-x-3 bottom-1 h-0.5 animate-recommendation-bar-in rounded-full bg-border motion-reduce:hidden"
                    >
                      <span
                        onAnimationEnd={handleCountdownEnd}
                        style={{
                          animationDelay: `${BAR_DELAY_MS}ms`,
                          animationDuration: `${getReadingTimeMs(item.text) - BAR_DELAY_MS}ms`,
                        }}
                        className="block h-full origin-right animate-recommendation-countdown rounded-full bg-primary group-hover:[animation-play-state:paused] group-has-[:focus-visible]:[animation-play-state:paused]"
                      />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <figure
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${selected.id}`}
            className="relative md:self-center"
          >
            <span
              aria-hidden={true}
              className="absolute -top-6 -left-2 text-7xl font-serif text-primary/20"
            >
              “
            </span>
            <AnimatePresence
              mode="wait"
              initial={false}
              custom={isStill ? 0 : direction}
            >
              <motion.div
                key={selected.id}
                custom={isStill ? 0 : direction}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: isStill ? 0 : 0.2, ease: 'easeOut' }}
              >
                <blockquote className="whitespace-pre-line text-lg leading-relaxed lg:text-xl">
                  {selected.text}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <RecommendationAvatar person={selected} />
                  <div>
                    <Meta item={selected} />
                  </div>
                </figcaption>
              </motion.div>
            </AnimatePresence>
          </figure>
        </div>
      </div>
    </section>
  )
}
