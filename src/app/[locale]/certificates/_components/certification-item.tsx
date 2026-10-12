import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getCertificationLinks } from '@/lib/certification-links'
import { formatCertificationDate } from '@/lib/certifications'
import type { Certification } from '@/lib/site-data'
import { ExternalLink, FileText } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export async function CertificationItem({
  certification,
}: {
  certification: Certification
}) {
  const t = await getTranslations('certificates')
  const links = getCertificationLinks(certification)
  const { title, issuer, issuedAt, skills } = certification

  return (
    <Card className="tech-card">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-1">
          <h2 className="font-bold text-lg">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {issuer} ·{' '}
            <time dateTime={issuedAt}>{formatCertificationDate(issuedAt)}</time>
          </p>
        </div>

        {skills.length > 0 && (
          <ul aria-label={t('skills')} className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li key={skill}>
                <Badge variant="secondary">{skill}</Badge>
              </li>
            ))}
          </ul>
        )}

        {links.length > 0 && (
          <div className="flex flex-wrap gap-2">
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
