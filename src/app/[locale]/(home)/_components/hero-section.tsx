'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import * as FancyButton from '@/components/ui/fancy-button'
import { Link } from '@/lib/navigation'
import {
  getMainYouTubeChannel,
  getSecondaryYouTubeChannel,
  site,
} from '@/lib/site-data'
import {
  ArrowRight,
  Briefcase,
  Code,
  Globe,
  GraduationCap,
  MapPin,
  Play,
  Star,
  Users,
  Youtube,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export function HeroSection() {
  const t = useTranslations('hero')
  const { profile, courses, social } = site
  const mainChannel = getMainYouTubeChannel()
  const secondaryChannel = getSecondaryYouTubeChannel()

  const stats = [
    {
      label: t('stats.subscribers'),
      value: profile.stats.youtubeSubscribers,
      icon: Users,
    },
    {
      label: t('stats.experience'),
      value: profile.stats.yearsExperience,
      icon: Briefcase,
    },
    {
      label: t('stats.lessons'),
      value: String(profile.stats.courseLessons),
      icon: GraduationCap,
    },
    {
      label: t('stats.countries'),
      value: String(profile.stats.countriesWorked),
      icon: Globe,
    },
  ]

  const highlights = [
    {
      label: site.content.hero.highlights.security,
      icon: '/icons/cadeado.png',
    },
    {
      label: site.content.hero.highlights.development,
      icon: '/icons/flecha-verde.png',
    },
    { label: site.content.hero.highlights.ai, icon: '/icons/claude.png' },
    {
      label: site.content.hero.highlights.editor,
      icon: '/icons/cursor-ide.png',
    },
  ]

  return (
    <section className="hero-section">
      <div className="max-w-6xl mx-auto px-8 py-16 lg:py-20 border-x-2 border-dotted border-border/40">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="px-3 py-1">
                <MapPin className="mr-1 h-3 w-3" />
                {profile.location.display}
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <Briefcase className="mr-1 h-3 w-3" />
                {profile.role}
              </Badge>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <div className="text-subtitle">{profile.subtitle}</div>
              <h1 className="text-display">
                {profile.firstName}{' '}
                <span className="gradient-text">{profile.lastName}</span>
              </h1>
              <p className="text-body-large text-muted-foreground max-w-2xl">
                {site.content.hero.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <div key={highlight.label} className="flex items-center gap-2">
                  {highlight.icon && (
                    <Image
                      src={highlight.icon}
                      alt=""
                      width={16}
                      height={16}
                      className="shrink-0"
                    />
                  )}
                  <span className="text-sm font-medium">{highlight.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <FancyButton.Root size="lg" asChild={true} className="group">
                <Link
                  href={courses.featured.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FancyButton.Icon as={GraduationCap} className="mr-2" />
                  {t('cta.courses')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </FancyButton.Root>

              <Button
                variant="outline"
                size="lg"
                asChild={true}
                className="group"
              >
                <Link
                  href={social.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code className="mr-2 h-4 w-4" />
                  YouTube
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            {/* YouTube Channels */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                {t('cta.channels')}
              </p>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild={true}
                  className="justify-start"
                >
                  <Link
                    href={mainChannel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Youtube className="mr-2 h-4 w-4 text-foreground" />
                    {mainChannel.handle} ({mainChannel.subscribers})
                  </Link>
                </Button>

                {secondaryChannel && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild={true}
                    className="justify-start"
                  >
                    <Link
                      href={secondaryChannel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Youtube className="mr-2 h-4 w-4 text-foreground" />
                      {secondaryChannel.handle}
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {t('cta.new')}
                      </Badge>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Image & Stats */}
          <div className="space-y-8">
            {/* Profile Image */}
            <div className="relative">
              <div className="aspect-square w-full max-w-md mx-auto relative overflow-hidden rounded-2xl bg-white from-muted/50 to-muted border border-border/20 shadow-[inset_0_0_40px_rgba(0,0,0,0.15)]">
                <Image
                  src={profile.images.hero}
                  alt={`${profile.displayName} - ${profile.jobTitle}`}
                  fill={true}
                  className="object-cover object-center"
                  priority={true}
                  sizes="(max-width: 768px) 100vw, 448px"
                />
              </div>

              {/* Floating badge */}
              <a
                href="https://api.whatsapp.com/send/?phone=5548999904772"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute -bottom-4 -right-4"
              >
                <Card className="border-green-500/20 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 ease-out">
                  <CardContent className="py-0 px-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-md shadow-green-500/50" />
                      <span className="text-xs font-medium">
                        {t('cta.available')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.label} className="tech-card">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="text-xs text-muted-foreground">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]">
          <div
            className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-muted/20 to-muted/10 opacity-20"
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
          />
        </div>
      </div>
    </section>
  )
}
