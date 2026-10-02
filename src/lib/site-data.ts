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
      youtubeSubscribers: string
      yearsExperience: string
      courseLessons: number
      countriesWorked: number
      courseStudents: string
      courseHours: string
      videoCount: string
    }
    images: {
      avatar: string
      hero: string
      profile: string
      about: string
      og: string
      logo: string
    }
    knowsAbout: string[]
    tagline: string
  }
  content: {
    hero: {
      description: string
      highlights: {
        security: string
        development: string
        ai: string
        editor: string
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
    availability: string
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
  courses: {
    featured: {
      id: string
      title: string
      description: string
      students: string
      lessons: number
      hours: string
      highlights: string[]
      url: string
    }
    others: Array<{
      id: string
      title: string
      description: string
      url: string
    }>
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
  seo: {
    keywords: string[]
  }
}

export const site = siteData as SiteData

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
