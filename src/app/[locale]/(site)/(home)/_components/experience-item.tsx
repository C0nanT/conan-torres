'use client'

import { Switch } from '@/components/ui/switch'
import type { Experience } from '@/lib/site-data'
import { useTranslations } from 'next-intl'
import { useId, useState } from 'react'

export function ExperienceItem({ job }: { job: Experience }) {
  const t = useTranslations('experience')
  const switchId = useId()
  const [isDetailed, setIsDetailed] = useState(false)
  const hasDetails = Boolean(job.details?.length)
  const items = isDetailed && job.details ? job.details : job.highlights

  return (
    <div className="group grid gap-4 px-3 transition-colors duration-200 py-8 md:grid-cols-[280px_1fr] md:gap-12 hover:bg-muted/40">
      <div className="space-y-1">
        <h3 className="text-xl font-bold">
          {job.company}{' '}
          <span className="text-sm font-medium text-primary">
            [{job.level}]
          </span>
        </h3>
        <p className="text-sm text-muted-foreground">{job.role}</p>
        <p className="text-sm text-muted-foreground">{job.period}</p>
      </div>
      <div>
        {hasDetails && (
          <div className="relative z-10 float-right mb-2 ml-4 flex items-center gap-2">
            <Switch
              id={switchId}
              checked={isDetailed}
              onCheckedChange={setIsDetailed}
            />
            <label
              htmlFor={switchId}
              className="cursor-pointer font-serif text-xs italic text-muted-foreground"
            >
              {t('moreDetails')}
            </label>
          </div>
        )}
        <ul className="space-y-2 text-muted-foreground">
          {items.map((item) => (
            <li key={item} className="relative pl-5">
              <span aria-hidden="true" className="absolute left-0 text-primary">
                ▸
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
