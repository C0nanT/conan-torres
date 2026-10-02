import {
  getOgImageUrl,
  getSiteUrl,
  getSocialSameAs,
  site,
} from '@/lib/site-data'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export interface LocalizedMetadata {
  title: string
  description: string
  keywords?: string[]
  openGraph?: {
    title?: string
    description?: string
    images?: Array<{
      url: string
      width?: number
      height?: number
      alt?: string
    }>
  }
  twitter?: {
    title?: string
    description?: string
    images?: string[]
  }
}

export async function generateLocalizedMetadata(
  locale: string,
  page: string,
  customMetadata?: Partial<LocalizedMetadata>
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' })
  const baseUrl = getSiteUrl()
  const { profile, seo } = site

  const title =
    customMetadata?.title ||
    (page === 'home' ? site.content.metadata.home.title : t(`${page}.title`))
  const description =
    customMetadata?.description ||
    (page === 'home'
      ? site.content.metadata.home.description
      : page === 'about'
        ? site.content.metadata.about.description
        : t(`${page}.description`))
  const pageKeywords = t.raw(`${page}.keywords`) || []
  const keywords = customMetadata?.keywords || [
    ...(Array.isArray(pageKeywords) ? pageKeywords : []),
    ...seo.keywords,
    profile.displayName.toLowerCase(),
  ]

  const ogLocale = locale === 'pt' ? 'pt_BR' : 'en_US'

  const canonicalUrl =
    locale === 'pt'
      ? `${baseUrl}${page === 'home' ? '' : `/${page}`}`
      : `${baseUrl}/en${page === 'home' ? '' : `/${page}`}`

  const alternateUrls = {
    'pt-BR': `${baseUrl}${page === 'home' ? '' : `/${page}`}`,
    'en-US': `${baseUrl}/en${page === 'home' ? '' : `/${page}`}`,
  }

  const defaultOgImage = {
    url: getOgImageUrl(locale),
    width: 1200,
    height: 630,
    alt: title,
    type: 'image/jpeg',
  }

  return {
    title,
    description,
    keywords: Array.isArray(keywords) ? keywords : [],
    authors: [{ name: profile.fullName, url: baseUrl }],
    creator: profile.fullName,
    publisher: profile.fullName,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: alternateUrls,
    },
    openGraph: {
      type: 'website',
      locale: ogLocale,
      url: canonicalUrl,
      siteName: site.site.name,
      title: customMetadata?.openGraph?.title || title,
      description: customMetadata?.openGraph?.description || description,
      images: customMetadata?.openGraph?.images || [defaultOgImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: customMetadata?.twitter?.title || title,
      description: customMetadata?.twitter?.description || description,
      images: customMetadata?.twitter?.images || [defaultOgImage.url],
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    category: 'technology',
  }
}

export function generateStructuredData(
  type: 'Person' | 'Article' | 'WebSite' | 'Organization',
  data: Record<string, unknown>
) {
  const baseUrl = getSiteUrl()
  const { profile, site: siteConfig } = site

  const commonContext = {
    '@context': 'https://schema.org',
  }

  switch (type) {
    case 'Person':
      return {
        ...commonContext,
        '@type': 'Person',
        name: profile.fullName,
        url: baseUrl,
        image: `${baseUrl}${profile.images.profile}`,
        jobTitle: profile.jobTitle,
        worksFor: {
          '@type': 'Organization',
          name: 'Tech Startup',
        },
        knowsAbout: profile.knowsAbout,
        sameAs: getSocialSameAs(),
        ...data,
      }

    case 'Article':
      return {
        ...commonContext,
        '@type': 'Article',
        author: {
          '@type': 'Person',
          name: profile.fullName,
          url: baseUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}${profile.images.logo}`,
          },
        },
        ...data,
      }

    case 'WebSite':
      return {
        ...commonContext,
        '@type': 'WebSite',
        name: siteConfig.name,
        alternateName: profile.aliases[0],
        url: baseUrl,
        ...data,
      }

    case 'Organization':
      return {
        ...commonContext,
        '@type': 'Organization',
        name: siteConfig.name,
        url: baseUrl,
        logo: `${baseUrl}${profile.images.logo}`,
        sameAs: getSocialSameAs(),
        ...data,
      }

    default:
      return { ...commonContext, ...data }
  }
}
