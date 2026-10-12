'use client'

import { Button } from '@/components/ui/button'
import {
  filterByTechnologies,
  getAllTechnologies,
  groupByYear,
  sortCertifications,
} from '@/lib/certifications'
import type { Certification } from '@/lib/site-data'
import { groupTechnologies } from '@/lib/technology-groups'
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
            <legend className="mb-3 flex items-center gap-3 text-sm font-medium">
              {t('filterBy')}
              {hasSelection && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                >
                  {t('clearFilters')}
                </Button>
              )}
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
                          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-32 top-4 hidden w-px -translate-x-1/2 bg-border lg:block"
          />
          {groupByYear(visible).map((group) => (
            <section
              key={group.year}
              aria-labelledby={`year-${group.year}`}
              className="relative grid gap-4 lg:grid-cols-[7rem_1fr] lg:gap-8"
            >
              <span
                aria-hidden="true"
                className="absolute left-32 top-2.5 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-foreground bg-background lg:block"
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
