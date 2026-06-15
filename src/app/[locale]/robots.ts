import { getSiteUrl } from '@/lib/site-data'
import type { MetadataRoute } from 'next'

export default async function robots({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<MetadataRoute.Robots> {
  const { locale } = await params
  const baseUrl = getSiteUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/', '/admin/', '/api/', '/_next/', '/static/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'Slurp',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Twitterbot',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'LinkedInBot',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Googlebot-Video',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Applebot',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'WhatsApp',
        allow: '/',
      },
      {
        userAgent: 'Telegrambot',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/${locale}/sitemap.xml`,
    host: baseUrl,
  }
}
