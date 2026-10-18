import { unstable_cache } from 'next/cache'
import { site } from './site-data'
import type { RecommendedYouTubeVideo } from './site-data'

const REVALIDATE_SECONDS = 60 * 60 * 24
const FETCH_TIMEOUT_MS = 8000
const VIEW_COUNT_PATTERN = /"viewCount":"(\d+)"/

export type LiveVideoStats =
  | { isFallback: false; views: number; fetchedAt: number }
  | { isFallback: true; views: string }

const viewsFormatter = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 0,
})

async function scrapeVideoViews(videoId: string) {
  const response = await fetch(
    `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
    {
      cache: 'no-store',
      headers: {
        'Accept-Language': 'pt-BR',
        'User-Agent': 'Mozilla/5.0 (compatible; conan-torres-site)',
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    }
  )
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  const match = VIEW_COUNT_PATTERN.exec(await response.text())
  if (!match?.[1]) {
    throw new Error('viewCount não encontrado')
  }
  return Number(match[1])
}

// Throwing inside the cached function makes Next keep the previous entry.
function getCachedVideoViews(videoId: string) {
  return unstable_cache(
    async () => ({
      views: await scrapeVideoViews(videoId),
      fetchedAt: Date.now(),
    }),
    ['youtube-live-stats', 'video-views', videoId],
    { revalidate: REVALIDATE_SECONDS }
  )()
}

export async function getLiveVideoStats(
  video: RecommendedYouTubeVideo
): Promise<LiveVideoStats> {
  try {
    const { views, fetchedAt } = await getCachedVideoViews(video.videoId)
    return { isFallback: false, views, fetchedAt }
  } catch {
    return { isFallback: true, views: video.views }
  }
}

export async function getLiveStatsByVideoId() {
  const entries = await Promise.all(
    site.youtube.recommendedVideos.map(
      async (video) => [video.videoId, await getLiveVideoStats(video)] as const
    )
  )
  return new Map(entries)
}

export function formatViews(stats: LiveVideoStats) {
  const label = stats.isFallback
    ? stats.views
    : viewsFormatter.format(stats.views)
  return `${label} visualizações`
}
