'use client'

// PROTOTYPE (throwaway): três layouts da seção de recomendações, trocados
// por ?variant=A|B|C na home. Foco no texto; foto é só um avatar pequeno
// (placeholder de iniciais até existir foto real). Descartar após escolher.
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/shadcn'
import { type Recommendation, site } from '@/lib/site-data'
import { ChevronLeft, ChevronRight, Linkedin } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { RecommendationAvatar } from './recommendation-avatar'

const VARIANTS = [
  { key: 'A', name: 'Citação em destaque + seletor' },
  { key: 'B', name: 'Cartas editoriais (trilho lateral)' },
  { key: 'C', name: 'Colunas de texto (masonry)' },
]

function SectionHeader() {
  return (
    <div className="text-center space-y-4 mb-12">
      <Badge
        variant="outline"
        className="px-3 py-1 motion-safe:hover:scale-100"
      >
        <Linkedin className="mr-1 h-3 w-3" />
        Recomendações
      </Badge>
      <h2 className="text-3xl font-bold lg:text-4xl">
        O que dizem sobre <span className="gradient-text">meu trabalho</span>
      </h2>
    </div>
  )
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

// A: uma recomendação grande por vez (tipografia de citação) + lista de autores
function VariantA({ items }: { items: Recommendation[] }) {
  const [selectedId, setSelectedId] = useState(items[0]?.id)
  const selected = items.find((item) => item.id === selectedId) ?? items[0]
  if (!selected) {
    return null
  }

  return (
    <div className="grid gap-8 md:grid-cols-[260px_1fr] md:gap-12">
      <div
        role="tablist"
        aria-orientation="vertical"
        className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible"
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === selected.id}
            onClick={() => setSelectedId(item.id)}
            className={cn(
              'flex shrink-0 items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors',
              item.id === selected.id
                ? 'border-primary/40 bg-background'
                : 'border-transparent hover:bg-background/60'
            )}
          >
            <RecommendationAvatar person={item} size="sm" />
            <span className="text-sm font-medium">{item.name}</span>
          </button>
        ))}
      </div>
      <figure className="relative">
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
  )
}

// B: mesma gramática da seção de Experiência: trilho com autor, texto à direita
function VariantB({ items }: { items: Recommendation[] }) {
  return (
    <div className="divide-y divide-border">
      {items.map((item) => (
        <div
          key={item.id}
          className="grid gap-4 px-3 py-8 md:grid-cols-[280px_1fr] md:gap-12"
        >
          <div className="flex items-start gap-3">
            <RecommendationAvatar person={item} />
            <div className="space-y-0.5">
              <Meta item={item} />
            </div>
          </div>
          <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
            {item.text}
          </p>
        </div>
      ))}
    </div>
  )
}

// C: colunas fluidas, sem moldura de card, texto manda; autor numa linha só
function VariantC({ items }: { items: Recommendation[] }) {
  return (
    <div className="gap-x-10 md:columns-2">
      {items.map((item) => (
        <figure
          key={item.id}
          className="mb-10 break-inside-avoid border-l-2 border-primary/40 pl-5"
        >
          <blockquote className="whitespace-pre-line text-muted-foreground leading-relaxed">
            {item.text}
          </blockquote>
          <figcaption className="mt-3 flex items-center gap-2 text-sm">
            <RecommendationAvatar person={item} size="sm" />
            <span className="font-semibold">{item.name}</span>
            <span className="text-muted-foreground">
              · {item.headline.split('|')[0]?.trim()}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

function PrototypeSwitcher({ current }: { current: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const index = Math.max(
    0,
    VARIANTS.findIndex((v) => v.key === current)
  )

  const go = (delta: number) => {
    const next = VARIANTS[(index + delta + VARIANTS.length) % VARIANTS.length]
    if (next) {
      router.replace(`${pathname}?variant=${next.key}#recomendacoes`, {
        scroll: false,
      })
    }
  }

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('input, textarea, [contenteditable]')) {
        return
      }
      if (event.key === 'ArrowLeft') {
        go(-1)
      }
      if (event.key === 'ArrowRight') {
        go(1)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  return (
    <div className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-full bg-foreground px-4 py-2 text-sm text-background shadow-xl">
      <button
        type="button"
        aria-label="Variante anterior"
        onClick={() => go(-1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span>
        {VARIANTS[index]?.key} ({VARIANTS[index]?.name})
      </span>
      <button type="button" aria-label="Próxima variante" onClick={() => go(1)}>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

export function PrototypeRecommendations() {
  const variant = useSearchParams().get('variant') ?? 'A'
  const items = site.recommendations

  return (
    <section id="recomendacoes" className="bg-muted/30 py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader />
        {variant === 'A' && <VariantA items={items} />}
        {variant === 'B' && <VariantB items={items} />}
        {variant === 'C' && <VariantC items={items} />}
      </div>
      {process.env.NODE_ENV !== 'production' && (
        <PrototypeSwitcher current={variant} />
      )}
    </section>
  )
}
