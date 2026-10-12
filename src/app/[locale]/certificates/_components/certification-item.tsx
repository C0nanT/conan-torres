'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getCertificationLinks } from '@/lib/certification-links'
import { formatCertificationDate } from '@/lib/certifications'
import type { Certification } from '@/lib/site-data'
import { ExternalLink, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function CertificationItem({
  certification,
}: {
  certification: Certification
}) {
  const t = useTranslations('certificates')
  const links = getCertificationLinks(certification)
  const { title, issuer, issuedAt, skills, technologies = [] } = certification

  return (
    <Card className="h-full rounded-xl shadow-none">
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-4 text-xs text-muted-foreground">
            <span className="font-medium">{issuer}</span>
            <time dateTime={issuedAt} className="shrink-0 tabular-nums">
              {formatCertificationDate(issuedAt)}
            </time>
          </div>
          <h3 className="text-base font-semibold leading-snug">{title}</h3>
        </div>

        {technologies.length > 0 && (
          <ul aria-label={t('technologies')} className="flex flex-wrap gap-1.5">
            {technologies.map((tech) => (
              <li key={tech}>
                <Badge variant="secondary">{tech}</Badge>
              </li>
            ))}
          </ul>
        )}

        {skills.length > 0 && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">{t('skills')}:</span>{' '}
            {skills.join(', ')}
          </p>
        )}

        {links.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 border-t pt-4">
            {links.map((link, index) => {
              const isCredential = link.kind === 'credential'
              const Icon = isCredential ? ExternalLink : FileText

              return (
                <Button
                  key={link.kind}
                  asChild={true}
                  size="sm"
                  variant={index === 0 ? 'default' : 'outline'}
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(
                      isCredential ? 'viewCredentialLabel' : 'viewFileLabel',
                      { title }
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {t(isCredential ? 'viewCredential' : 'viewFile')}
                  </a>
                </Button>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
