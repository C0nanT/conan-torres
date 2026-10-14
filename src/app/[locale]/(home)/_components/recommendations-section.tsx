import { Badge } from '@/components/ui/badge'
import { site } from '@/lib/site-data'
import { ExternalLink, Linkedin } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { ExpandableText } from './expandable-text'
import { RecommendationAvatar } from './recommendation-avatar'

export async function RecommendationsSection() {
  const { recommendations } = site
  if (recommendations.length === 0) {
    return null
  }

  const t = await getTranslations('recommendations')

  return (
    <section className="bg-muted/30 py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <Badge
            variant="outline"
            className="px-3 py-1 motion-safe:hover:scale-100"
          >
            <Linkedin className="mr-1 h-3 w-3" />
            {t('badge')}
          </Badge>
          <h2 className="text-3xl font-bold lg:text-4xl">
            {t('titlePrefix')}{' '}
            <span className="gradient-text">{t('titleHighlight')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <ul className="grid gap-6 md:grid-cols-2">
          {recommendations.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-4 rounded-lg border border-border bg-background p-6"
            >
              <ExpandableText text={item.text} />
              <div className="mt-auto flex items-center gap-3 border-t border-border pt-4">
                <RecommendationAvatar person={item} />
                <div className="space-y-1">
                  <p className="font-bold">
                    {item.profileUrl ? (
                      <a
                        href={item.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t('viewProfile', { name: item.name })}
                        className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {item.name}
                      </a>
                    ) : (
                      item.name
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.headline}
                  </p>
                  {(item.relationship || item.date) && (
                    <p className="text-xs text-muted-foreground">
                      {[item.date, item.relationship]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <a
            href={site.social.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t('viewAll')}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
