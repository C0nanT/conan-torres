'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  type CertificationLink,
  getCertificationLinks,
} from '@/lib/certification-links'
import { formatCertificationDate } from '@/lib/certifications'
import type { Certification } from '@/lib/site-data'
import { sortTechnologies } from '@/lib/technology-groups'
import { ExternalLink, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { TechnologyBadge } from './technology-badge'

export function CertificationItem({
  certification,
}: {
  certification: Certification
}) {
  const t = useTranslations('certificates')
  const [primary, secondary] = getCertificationLinks(certification)
  const { title, issuer, issuedAt, technologies = [] } = certification

  const getLabel = (link: CertificationLink) =>
    link.kind === 'credential' ? 'viewCredential' : 'viewFile'
  const getAriaLabel = (link: CertificationLink) =>
    t(`${getLabel(link)}Label`, { title })

  return (
    <Card className="relative h-full overflow-hidden rounded-xl shadow-none">
      {primary && (
        <a
          href={primary.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={getAriaLabel(primary)}
          title={t(getLabel(primary))}
          className="absolute right-0 top-0 flex h-10 w-12 items-center justify-center rounded-bl-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          {primary.kind === 'credential' ? (
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          ) : (
            <FileText className="h-4 w-4" aria-hidden="true" />
          )}
        </a>
      )}

      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="space-y-2">
          <div
            className={`flex items-baseline justify-between gap-4 text-xs text-muted-foreground ${primary ? 'pr-10' : ''}`}
          >
            <span className="font-medium">{issuer}</span>
            <time dateTime={issuedAt} className="shrink-0 tabular-nums">
              {formatCertificationDate(issuedAt)}
            </time>
          </div>
          <h3 className="text-base font-semibold leading-snug">{title}</h3>
        </div>

        {technologies.length > 0 && (
          <ul aria-label={t('technologies')} className="flex flex-wrap gap-1.5">
            {sortTechnologies(technologies).map((tech) => (
              <li key={tech}>
                <TechnologyBadge label={tech} />
              </li>
            ))}
          </ul>
        )}

        {secondary && (
          <div className="mt-auto border-t pt-4">
            <Button asChild={true} size="sm" variant="outline">
              <a
                href={secondary.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={getAriaLabel(secondary)}
              >
                <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                {t(getLabel(secondary))}
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
