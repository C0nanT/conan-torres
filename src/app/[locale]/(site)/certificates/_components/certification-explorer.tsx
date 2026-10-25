'use client'

import { Button } from '@/components/ui/button'
import {
  filterByTechnologies,
  getAllTechnologies,
  groupByYear,
  sortCertifications,
} from '@/lib/certifications/certifications'
import { groupTechnologies } from '@/lib/certifications/technology-groups'
import type { Certification } from '@/lib/site-data'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Fragment, useState } from 'react'
import { CertificationItem } from './certification-item'
import { TechnologyBadge } from './technology-badge'

export function CertificationExplorer({
  certifications,
}: {
  certifications: Certification[]
}) {
  const t = useTranslations('certificates')
  const [selected, setSelected] = useState<string[]>([])
  const prefersReducedMotion = useReducedMotion()

  const technologyGroups = groupTechnologies(getAllTechnologies(certifications))
  const hasSelection = selected.length > 0
  const visible = sortCertifications(
    filterByTechnologies(certifications, selected),
    'newest'
  )

  const handleToggle = (tech: string) => {
    setSelected((current) =>
      current.includes(tech)
        ? current.filter((item) => item !== tech)
        : [...current, tech]
    )
  }

  const handleClear = () => setSelected([])

  return (
    <div className="space-y-6">
      <div>
        {technologyGroups.length > 0 && (
          <fieldset className="min-w-0 space-y-3">
            <legend className="mb-3 flex min-h-8 items-center gap-3 text-sm font-medium">
              {t('filterBy')}
              <AnimatePresence initial={false}>
                {hasSelection && (
                  <motion.span
                    key="clear-filters"
                    className="inline-flex"
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.9, x: -8 }
                    }
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.9, x: -8 }
                    }
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                    >
                      <Trash2 aria-hidden="true" className="mr-1.5 size-3.5" />
                      {t('clearFilters')}
                    </Button>
                  </motion.span>
                )}
              </AnimatePresence>
            </legend>
            <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[9rem_1fr]">
              {technologyGroups.map((group) => (
                <Fragment key={group.id}>
                  <dt className="pt-1 text-xs text-muted-foreground sm:text-right">
                    {t(`groups.${group.id}`)}
                  </dt>
                  <dd className="mb-2 flex flex-wrap gap-1.5 sm:mb-0">
                    {group.labels.map((tech) => {
                      const isActive = selected.includes(tech)

                      return (
                        <button
                          key={tech}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => handleToggle(tech)}
                          className="rounded-md transition-transform duration-150 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <TechnologyBadge
                            label={tech}
                            isActive={isActive}
                            isDimmed={hasSelection && !isActive}
                          />
                        </button>
                      )
                    })}
                  </dd>
                </Fragment>
              ))}
            </dl>
          </fieldset>
        )}
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {t('resultCount', { count: visible.length })}
      </p>

      {visible.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          {t('noResults')}
        </p>
      ) : (
        <div className="relative flex flex-col gap-10">
          {groupByYear(visible).map((group) => (
            <section
              key={group.year}
              aria-labelledby={`year-${group.year}`}
              className="relative grid gap-4 lg:grid-cols-[7rem_1fr] lg:gap-8"
            >
              <span
                aria-hidden="true"
                className="absolute bottom-[-2.25rem] left-32 top-6 hidden w-0.5 -translate-x-1/2 bg-[length:2px_8px] bg-[linear-gradient(to_bottom,currentColor_50%,transparent_50%)] text-border [mask-image:linear-gradient(to_bottom,black_55%,transparent)] lg:block"
              />
              <span
                aria-hidden="true"
                className="absolute left-32 top-2.5 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-border bg-background lg:block"
              />
              <h2
                id={`year-${group.year}`}
                className="text-2xl font-semibold tabular-nums text-muted-foreground lg:sticky lg:top-24 lg:self-start lg:text-right"
              >
                {group.year}
              </h2>
              <CardGrid items={group.items} />
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

function CardGrid({ items }: { items: Certification[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((certification) => (
        <li key={certification.id}>
          <CertificationItem certification={certification} />
        </li>
      ))}
    </ul>
  )
}
