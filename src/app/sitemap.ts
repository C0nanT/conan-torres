import { defaultLocale, locales } from '@/lib/navigation'
import { getSiteUrl } from '@/lib/site-data'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl()

  const staticPages = [
    { path: '', priority: 1, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/projects', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/books', priority: 0.6, changeFrequency: 'monthly' as const },
    {
      path: '/certificates',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
  ]

  const localizedUrl = (locale: string, path: string) =>
    locale === defaultLocale
      ? `${baseUrl}${path}`
      : `${baseUrl}/${locale}${path}`

  return locales.flatMap((locale) =>
    staticPages.map(({ path, priority, changeFrequency }) => ({
      url: localizedUrl(locale, path),
      lastModified: new Date(),
      changeFrequency,
      priority,
    }))
  )
}
