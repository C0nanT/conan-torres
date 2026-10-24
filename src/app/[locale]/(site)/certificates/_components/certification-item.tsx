'use client'

import { Button } from '@/components/ui/button'
import {
  type CertificationLink,
  getCertificationLinks,
} from '@/lib/certification-links'
import {
  formatCertificationDate,
  getIssuerInitials,
  getIssuerLogo,
} from '@/lib/certifications'
import { cn } from '@/lib/shadcn'
import type { Certification } from '@/lib/site-data'
import { sortTechnologies } from '@/lib/technology-groups'
import { ExternalLink, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { TechnologyBadge } from './technology-badge'

export function CertificationItem({
  certification,
}: {
  certification: Certification
}) {
  const t = useTranslations('certificates')
  const [primary, secondary] = getCertificationLinks(certification)
  const { title, issuer, issuedAt, technologies = [] } = certification
  const logo = getIssuerLogo(issuer)

  const getLabel = (link: CertificationLink) =>
    link.kind === 'credential' ? 'viewCredential' : 'viewFile'
  const getAriaLabel = (link: CertificationLink) =>
    t(`${getLabel(link)}Label`, { title })

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-transparent bg-muted/40 text-card-foreground shadow-sm transition-[transform,box-shadow,border-color] duration-200 ease-out motion-reduce:transition-none',
        primary &&
          'cursor-pointer hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md motion-reduce:hover:translate-y-0'
      )}
    >
      {primary && (
        <>
          <a
            href={primary.href}
            target="_blank"
            rel="noopener noreferrer"
            title={t(getLabel(primary))}
            className="absolute inset-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            <span className="sr-only">{getAriaLabel(primary)}</span>
          </a>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 flex h-10 w-12 items-center justify-center rounded-bl-2xl bg-primary text-primary-foreground transition-colors group-hover:bg-primary/80"
          >
            {primary.kind === 'credential' ? (
              <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:transform-none" />
            ) : (
              <FileText className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:transform-none" />
            )}
          </div>
        </>
      )}

      <div className="flex h-full flex-col gap-4 p-5">
        <div className={`flex items-center gap-3 ${primary ? 'pr-10' : ''}`}>
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white text-sm font-bold text-black"
          >
            {logo ? (
              <Image
                src={logo.src}
                alt=""
                width={40}
                height={40}
                className={cn(
                  'h-full w-full object-contain',
                  logo.padded && 'p-1.5'
                )}
              />
            ) : (
              getIssuerInitials(issuer)
            )}
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
          <div className="relative mt-auto border-t border-border pt-4">
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
