import { Badge } from '@/components/ui/badge'
import { getSortedCertifications } from '@/lib/certifications'
import { Award } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { CertificationItem } from './certification-item'

export async function CertificationList() {
  const t = await getTranslations('certificates')
  const items = getSortedCertifications()

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="px-3 py-1">
            <Award className="mr-1 h-3 w-3" />
            {t('badge')}
          </Badge>
          <h1 className="text-3xl font-bold lg:text-4xl">{t('title')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-muted-foreground">{t('empty')}</p>
        ) : (
          <ul className="space-y-4">
            {items.map((certification) => (
              <li key={certification.id}>
                <CertificationItem certification={certification} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
