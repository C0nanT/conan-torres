import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Link } from '@/lib/navigation'
import {
  getRecommendedChannelById,
  getYouTubeVideoThumbnail,
  getYouTubeVideoUrl,
  site,
} from '@/lib/site-data'
import { ExternalLink, Play, Youtube } from 'lucide-react'
import Image from 'next/image'

interface TopicCategory {
  label: string
  keywords: string[]
  bg: string
  text: string
  dot: string
}

const TOPIC_CATEGORIES: TopicCategory[] = [
  {
    label: 'IA no desenvolvimento',
    keywords: ['ai coding', 'claude', 'typescript'],
    bg: 'bg-blue-100 dark:bg-blue-950',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  {
    label: 'LLMs e Machine Learning',
    keywords: ['llm', 'neural', 'machine learning'],
    bg: 'bg-purple-100 dark:bg-purple-950',
    text: 'text-purple-700 dark:text-purple-300',
    dot: 'bg-purple-500',
  },
  {
    label: 'Workflows',
    keywords: ['workflow'],
    bg: 'bg-green-100 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-300',
    dot: 'bg-green-500',
  },
]

const DEFAULT_TOPIC_CATEGORY: TopicCategory = {
  label: 'Outros',
  keywords: [],
  bg: 'bg-gray-100 dark:bg-gray-950',
  text: 'text-gray-700 dark:text-gray-300',
  dot: 'bg-gray-500',
}

function getCategoryColors(tag: string): TopicCategory {
  const t = tag.toLowerCase()
  return (
    TOPIC_CATEGORIES.find((category) =>
      category.keywords.some((keyword) => t.includes(keyword))
    ) ?? DEFAULT_TOPIC_CATEGORY
  )
}

export function YouTubeChannels() {
  const { recommendedChannels, recommendedVideos } = site.youtube

  return (
    <section className="py-16 lg:py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="px-3 py-1">
            <Youtube className="mr-1 h-3 w-3 text-foreground" />
            YouTube
          </Badge>
          <h2 className="text-3xl font-bold lg:text-4xl">
            Canais e vídeos que <span className="gradient-text">recomendo</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Canais que acompanho de perto e vídeos que vale a pena assistir
            primeiro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {recommendedChannels.map((channel) => (
            <Card
              key={channel.id}
              className="tech-card relative flex h-full flex-col overflow-hidden"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start space-x-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-white">
                    <Youtube className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{channel.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {channel.handle}
                    </p>
                    <CardDescription className="mt-2 line-clamp-3 text-sm">
                      {channel.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col space-y-4 p-5 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">
                      {channel.subscribers}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Inscritos
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">
                      {channel.videoCount}
                    </div>
                    <div className="text-sm text-muted-foreground">Vídeos</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Tópicos principais:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {channel.highlights.map((highlight) => {
                      const colors = getCategoryColors(highlight)
                      return (
                        <Badge
                          key={highlight}
                          variant="outline"
                          className={`text-xs border-0 ${colors.bg} ${colors.text}`}
                        >
                          {highlight}
                        </Badge>
                      )
                    })}
                  </div>
                </div>

                <Button className="group mt-auto w-full" asChild={true}>
                  <Link
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Youtube className="mr-2 h-4 w-4" />
                    Visitar canal
                    <ExternalLink className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <ul className="mb-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {[...TOPIC_CATEGORIES, DEFAULT_TOPIC_CATEGORY].map((category) => (
            <li key={category.label} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-full ${category.dot}`}
              />
              {category.label}
            </li>
          ))}
        </ul>

        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Vídeos que recomendo</h3>
            <p className="text-muted-foreground">
              Conteúdos que assisti e indico para quem quer se aprofundar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedVideos.map((video) => {
              const channel = getRecommendedChannelById(video.channelId)
              const videoUrl = getYouTubeVideoUrl(
                video.videoId,
                video.startSeconds
              )

              return (
                <a
                  key={video.videoId}
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <Card className="tech-card transition-all overflow-hidden h-full">
                    <div className="aspect-video relative bg-muted">
                      <Image
                        src={getYouTubeVideoThumbnail(video.videoId)}
                        alt={video.title}
                        fill={true}
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-white scale-90 group-hover:scale-100 transition-transform">
                          <Play className="h-8 w-8 ml-1" />
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                          {video.title}
                        </h4>
                        <div className="flex items-center justify-between text-sm text-muted-foreground gap-2">
                          {channel && (
                            <Badge variant="secondary" className="text-xs">
                              {channel.handle}
                            </Badge>
                          )}
                          <div className="flex items-center space-x-1 shrink-0">
                            <Play className="h-3 w-3" />
                            <span>{video.views} views</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
