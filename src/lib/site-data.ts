import certificationsData from '../../data/certifications.json'
import siteData from '../../data/site.json'

export interface SocialLink {
  url: string
  handle?: string
  label: string
}

export interface RecommendedYouTubeChannel {
  id: string
  name: string
  handle: string
  url: string
  description: string
  subscribers: string
  videoCount: string
  category: string
  highlights: string[]
}

export interface RecommendedYouTubeVideo {
  videoId: string
  title: string
  views: string
  channelId: string
  startSeconds?: number
}

export type BookStatus = 'read' | 'reading' | 'to-read'

export interface RecommendedBook {
  id: string
  title: string
  subtitle?: string
  originalTitle?: string
  authors: string[]
  language: 'pt' | 'en'
  category: string
  topics: string[]
  description: string
  url: string
  /** path under `public/`, e.g. `/books/<id>.jpg` */
  cover?: string
  status: BookStatus
  /** 0-100, only meaningful while `status` is `reading` */
  progress?: number
  /** ISO date (YYYY-MM-DD) of the last `progress` update */
  progressUpdatedAt?: string
  /** 1-5 stars */
  rating?: 1 | 2 | 3 | 4 | 5
  /** short personal remark about the book */
  note?: string
}

export interface Experience {
  company: string
  level: string
  role: string
  period: string
  highlights: string[]
}

export interface SiteData {
  profile: {
    fullName: string
    displayName: string
    firstName: string
    lastName: string
    aliases: string[]
    initials: string
    role: string
    subtitle: string
    jobTitle: string
    nationality: string
    location: {
      city: string
      country: string
      countryCode: string
      display: string
    }
    structuredDataLocation: {
      city: string
      countryCode: string
    }
    education: {
      degree: string
      institution: string
      institutionShort: string
      year: number
    }
    stats: {
      relevantProjects: string
      certifications: string
      yearsExperience: string
      freelances: string
    }
    images: {
      avatar: string
      hero: string
      profile: string
      about: string
      og: string
      logo: string
    }
    introAudio: string
    knowsAbout: string[]
    tagline: string
  }
  content: {
    hero: {
      description: string
      highlights: {
        architecture: string
        people: string
        ai: string
        learning: string
      }
    }
    metadata: {
      home: {
        title: string
        description: string
      }
      about: {
        description: string
      }
    }
  }
  contact: {
    email: string
  }
  social: {
    linkedin: SocialLink
    github: SocialLink
  }
  site: {
    name: string
    url: string
    analytics: {
      clarityId: string
    }
  }
  youtube: {
    recommendedChannels: RecommendedYouTubeChannel[]
    recommendedVideos: RecommendedYouTubeVideo[]
  }
  books: {
    recommended: RecommendedBook[]
  }
  about: {
    badge: string
    headline: string
    headlineHighlight: string
    subheadline: string
    bio: string[]
    quickFacts: Array<{
      label: string
      value: string
      year: string
    }>
    achievements: string[]
  }
  philosophy: {
    coreValues: Array<{
      title: string
      description: string
      quote: string
    }>
    personalInsights: Array<{
      title: string
      content: string
      category: string
    }>
  }
  experience: Experience[]
  seo: {
    keywords: string[]
  }
}

export interface Certification {
  id: string
  title: string
  issuer: string
  issuedAt: string
  credentialId: string | null
  skills: string[]
  technologies?: string[]
  file?: string
  url?: string
}

export const site = siteData as SiteData

export const certifications =
  certificationsData.certifications as Certification[]

export function getSiteUrl(): string {
  return site.site.url
}

export function getContactEmail(): string {
  return site.contact.email
}

export function getSocialLinksForNav(): Array<{
  name: string
  href: string
}> {
  return [{ name: site.social.linkedin.label, href: site.social.linkedin.url }]
}

export function getSocialSameAs(): string[] {
  return [site.social.linkedin.url, site.social.github.url]
}

export function getRecommendedChannelById(
  id: string
): RecommendedYouTubeChannel | undefined {
  return site.youtube.recommendedChannels.find((channel) => channel.id === id)
}

export function getBookProgress(book: RecommendedBook): number | undefined {
  if (book.status === 'read') {
    return 100
  }
  if (book.status === 'to-read') {
    return 0
  }
  return book.progress
}

export function getYouTubeVideoUrl(
  videoId: string,
  startSeconds?: number
): string {
  const base = `https://www.youtube.com/watch?v=${videoId}`
  if (startSeconds === undefined) {
    return base
  }
  return `${base}&t=${startSeconds}s`
}

export function getYouTubeVideoThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

export function getOgImageUrl(locale: string): string {
  return `${site.site.url}${site.profile.images.og.replace('{locale}', locale)}`
}

export function getProfileImageUrl(
  type: keyof SiteData['profile']['images'] = 'avatar'
): string {
  return site.profile.images[type]
}
