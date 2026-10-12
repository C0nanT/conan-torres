'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import * as FancyButton from '@/components/ui/fancy-button'
import { Link } from '@/lib/navigation'
import { site } from '@/lib/site-data'
import {
  ArrowRight,
  Award,
  Briefcase,
  Code2,
  FolderGit2,
  GraduationCap,
  type LucideIcon,
  MapPin,
  Rocket,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { AvailableBadge } from './available-badge'
import { IntroAudio } from './intro-audio'

interface HeroHighlight {
  label: string
  image?: string
  icon?: LucideIcon
}

interface HeroStat {
  label: string
  value: string
  icon: LucideIcon
  href?: string
}

export function HeroSection() {
  const t = useTranslations('hero')
  const { profile } = site

  const stats: HeroStat[] = [
    {
      label: t('stats.projects'),
      value: profile.stats.relevantProjects,
      icon: FolderGit2,
    },
    {
      label: t('stats.certifications'),
      value: profile.stats.certifications,
      icon: Award,
      href: '/certificates',
    },
    {
      label: t('stats.experience'),
      value: profile.stats.yearsExperience,
      icon: Briefcase,
    },
    {
      label: t('stats.freelances'),
      value: profile.stats.freelances,
      icon: Rocket,
    },
  ]

  const highlights: HeroHighlight[] = [
    {
      label: site.content.hero.highlights.development,
      icon: Code2,
    },
    { label: site.content.hero.highlights.ai, image: '/icons/claude-code.svg' },
    {
      label: site.content.hero.highlights.editor,
      image: '/icons/cursor-ide.png',
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
              {highlights.map((highlight) => {
                const Icon = highlight.icon

                return (
                  <div
                    key={highlight.label}
                    className="flex items-center gap-2"
                  >
                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                    {highlight.image && (
                      <Image
                        src={highlight.image}
                        alt=""
                        width={16}
                        height={16}
                        className="shrink-0"
                      />
                    )}
                    <span className="text-sm font-medium">
                      {highlight.label}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
              <FancyButton.Root
                size="lg"
                type="button"
                disabled={true}
                className="group"
              >
                <FancyButton.Icon as={GraduationCap} className="mr-2" />
                {t('cta.courses')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </FancyButton.Root>
              <IntroAudio src={profile.introAudio} />
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

              <AvailableBadge />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => {
                const Icon = stat.icon
                const card = (
                  <Card
                    className={`tech-card relative h-full overflow-hidden p-4 ${stat.href ? 'transition-colors hover:border-primary/50' : ''}`}
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,hsl(var(--primary)/0.14),transparent_65%)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--primary)/0.35)_1px,transparent_1px)] [background-size:10px_10px] [mask-image:radial-gradient(circle_at_100%_0%,black,transparent_70%)]" />
                      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-primary/15" />
                      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full border border-primary/10" />
                      <Icon
                        strokeWidth={1.5}
                        className="absolute right-2 top-2 h-12 w-12 rotate-12 text-primary/25"
                      />
                    </div>
                    <CardContent className="relative p-3">
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                )

                if (stat.href) {
                  return (
                    <Link key={stat.label} href={stat.href} className="block">
                      {card}
                    </Link>
                  )
                }

                return <div key={stat.label}>{card}</div>
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
