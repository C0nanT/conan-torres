import { getSiteUrl, site } from '@/lib/site-data'
import type { MetadataRoute } from 'next'

export default async function manifest({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<MetadataRoute.Manifest> {
  const { locale } = await params
  const isPortuguese = locale === 'pt'
  const { profile, site: siteConfig } = site

  return {
    name: isPortuguese
      ? `${profile.displayName} - ${profile.jobTitle} e Educador`
      : `${profile.displayName} - ${profile.jobTitle} and Educator`,
    short_name: siteConfig.name,
    description: isPortuguese
      ? `Site oficial de ${profile.displayName} - ${profile.jobTitle} e Educador especialista em algoritmos e estruturas de dados`
      : `Official website of ${profile.displayName} - ${profile.jobTitle} and Educator specializing in algorithms and data structures`,
    start_url: `/${locale}`,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
