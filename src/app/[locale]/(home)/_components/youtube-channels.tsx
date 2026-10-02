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

function getCategoryColors(tag: string): { bg: string; text: string } {
  const t = tag.toLowerCase()
  if (
    t.includes('ai coding') ||
    t.includes('claude') ||
    t.includes('typescript')
  ) {
    return {
      bg: 'bg-blue-100 dark:bg-blue-950',
      text: 'text-blue-700 dark:text-blue-300',
    }
  }
  if (
    t.includes('llm') ||
    t.includes('neural') ||
    t.includes('machine learning')
  ) {
    return {
      bg: 'bg-purple-100 dark:bg-purple-950',
      text: 'text-purple-700 dark:text-purple-300',
    }
  }
  if (t.includes('workflow')) {
    return {
      bg: 'bg-green-100 dark:bg-green-950',
      text: 'text-green-700 dark:text-green-300',
    }
  }
  return {
    bg: 'bg-gray-100 dark:bg-gray-950',
    text: 'text-gray-700 dark:text-gray-300',
  }
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {recommendedChannels.map((channel) => (
            <Card
              key={channel.id}
              className="tech-card relative overflow-hidden"
            >
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-white">
                    <Youtube className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{channel.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {channel.handle}
                    </p>
                    <CardDescription className="mt-2">
                      {channel.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {channel.subscribers}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Inscritos
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {channel.videoCount}
                    </div>
                    <div className="text-sm text-muted-foreground">Vídeos</div>
                  </div>
                  <div className="text-center">
                    <Badge variant="default" className="text-xs">
                      {channel.status}
                    </Badge>
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

                <Button className="w-full group" asChild={true}>
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {recommendedChannels.map((channel) => (
              <Button
                key={channel.id}
                variant="outline"
                size="lg"
                asChild={true}
              >
                <Link
                  href={`${channel.url}/videos`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="mr-2 h-4 w-4 text-foreground" />
                  Ver mais no {channel.handle}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
