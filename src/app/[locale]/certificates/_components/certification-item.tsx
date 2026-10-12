'use client'

import { Button } from '@/components/ui/button'
import {
  type CertificationLink,
  getCertificationLinks,
} from '@/lib/certification-links'
import {
  formatCertificationDate,
  getIssuerInitials,
} from '@/lib/certifications'
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
    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-muted/40 text-card-foreground shadow-sm transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      {primary && (
        <a
          href={primary.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={getAriaLabel(primary)}
          title={t(getLabel(primary))}
          className="group absolute right-0 top-0 flex h-10 w-12 items-center justify-center rounded-bl-2xl bg-primary text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          {primary.kind === 'credential' ? (
            <ExternalLink
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
              aria-hidden="true"
            />
          ) : (
            <FileText
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
              aria-hidden="true"
            />
          )}
        </a>
      )}

      <div className="flex h-full flex-col gap-4 p-5">
        <div className={`flex items-center gap-3 ${primary ? 'pr-10' : ''}`}>
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-sm font-bold"
          >
            {getIssuerInitials(issuer)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{issuer}</p>
            <time
              dateTime={issuedAt}
              className="text-xs tabular-nums text-muted-foreground"
            >
              {formatCertificationDate(issuedAt)}
            </time>
          </div>
        </div>

        <h3 className="text-base font-semibold leading-snug">{title}</h3>

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
          <div className="mt-auto border-t border-border pt-4">
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
      </div>
    </article>
  )
}
