'use client'

import { Button } from '@/components/ui/button'
import {
  type CertificationSort,
  certificationSorts,
  filterByTechnologies,
  getAllTechnologies,
  groupByYear,
  sortCertifications,
} from '@/lib/certifications'
import type { Certification } from '@/lib/site-data'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { CertificationItem } from './certification-item'
import { TechnologyBadge } from './technology-badge'

export function CertificationExplorer({
  certifications,
}: {
  certifications: Certification[]
}) {
  const t = useTranslations('certificates')
  const [selected, setSelected] = useState<string[]>([])
  const [sort, setSort] = useState<CertificationSort>('newest')

  const technologies = getAllTechnologies(certifications)
  const visible = sortCertifications(
    filterByTechnologies(certifications, selected),
    sort
  )

  const isChronological = sort === 'newest' || sort === 'oldest'

  const handleToggle = (tech: string) => {
    setSelected((current) =>
      current.includes(tech)
        ? current.filter((item) => item !== tech)
        : [...current, tech]
    )
  }

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(event.target.value as CertificationSort)
  }

  const handleClear = () => setSelected([])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        {technologies.length > 0 && (
          <fieldset className="min-w-0 space-y-2">
            <legend className="text-sm font-medium">{t('filterBy')}</legend>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => {
                const isActive = selected.includes(tech)

                return (
                  <button
                    key={tech}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleToggle(tech)}
                    className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <TechnologyBadge label={tech} isActive={isActive} />
                  </button>
                )
              })}
              {selected.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                >
                  {t('clearFilters')}
                </Button>
              )}
            </div>
          </fieldset>
        )}

        <label className="flex shrink-0 flex-col gap-2 text-sm font-medium sm:ml-auto">
          {t('sortBy')}
          <select
            value={sort}
            onChange={handleSortChange}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {certificationSorts.map((option) => (
              <option key={option} value={option}>
                {t(`sort.${option}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {t('resultCount', { count: visible.length })}
      </p>

      {visible.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          {t('noResults')}
        </p>
      ) : isChronological ? (
        <div className="space-y-10">
          {groupByYear(visible).map((group) => (
            <section
              key={group.year}
              aria-labelledby={`year-${group.year}`}
              className="grid gap-4 lg:grid-cols-[7rem_1fr] lg:gap-8"
            >
              <h2
                id={`year-${group.year}`}
                className="text-2xl font-semibold tabular-nums text-muted-foreground lg:sticky lg:top-24 lg:self-start"
              >
                {group.year}
              </h2>
              <CardGrid items={group.items} />
            </section>
          ))}
        </div>
      ) : (
        <section aria-labelledby="all-certifications">
          <h2 id="all-certifications" className="sr-only">
            {t('allCertifications')}
          </h2>
          <CardGrid items={visible} />
        </section>
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
