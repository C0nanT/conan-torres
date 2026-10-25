import { site } from '@/lib/site-data'
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  const { profile, site: siteConfig } = site

  return {
    name: `${profile.displayName} - ${profile.jobTitle} e Educador`,
    short_name: siteConfig.name,
    description: `Site oficial de ${profile.displayName} - ${profile.jobTitle} e Educador especialista em algoritmos e estruturas de dados`,
    start_url: '/',
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
