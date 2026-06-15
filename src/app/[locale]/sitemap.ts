import { getSiteUrl } from '@/lib/site-data'
import type { MetadataRoute } from 'next'

export default async function sitemap({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<MetadataRoute.Sitemap> {
  const { locale } = await params
  const baseUrl = getSiteUrl()

  const staticPages = [
    { path: '', priority: 1, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
  ]

  return staticPages.map(({ path, priority, changeFrequency }) => {
    const url =
      locale === 'pt' ? `${baseUrl}${path}` : `${baseUrl}/${locale}${path}`

    return {
      url,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: {
          'pt-BR': `${baseUrl}${path}`,
          'en-US': `${baseUrl}/en${path}`,
        },
      },
    }
  })
}
