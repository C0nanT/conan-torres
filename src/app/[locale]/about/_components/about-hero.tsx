import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { site } from '@/lib/site-data'
import { Award, Briefcase, GraduationCap, MapPin, Users } from 'lucide-react'

const getQuickFactIcon = (label: string) => {
  switch (label) {
    case 'Formação':
      return GraduationCap
    case 'Experiência':
      return Briefcase
    case 'Localização':
      return MapPin
    case 'Posição':
      return Award
    default:
      return Briefcase
  }
}

export function AboutHero() {
  const { profile, about } = site
  const headlineParts = about.headline.split(about.headlineHighlight)

  return (
    <section className="hero-section">
      <div className="max-w-6xl mx-auto px-4 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <Badge variant="outline" className="px-3 py-1 w-fit">
              <Users className="mr-1 h-3 w-3" />
              {about.badge}
            </Badge>

            {/* Main Content */}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                {headlineParts[0]}
                <span className="gradient-text">{about.headlineHighlight}</span>
                {headlineParts[1]}
              </h1>

              <div className="text-xl text-muted-foreground">
                {about.subheadline}
              </div>

              <div className="prose prose-lg max-w-none text-muted-foreground">
                {about.bio.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Principais conquistas:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {about.achievements.map((achievement) => (
                  <div
                    key={achievement}
                    className="flex items-center space-x-2"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Image & Facts */}
          <div className="space-y-8">
            {/* Profile Image */}
            <div className="relative">
              <div className="aspect-square w-full max-w-md mx-auto relative overflow-hidden rounded-2xl bg-gradient-to-br from-muted/50 to-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl font-bold text-primary/20">
                    {profile.initials}
                  </div>
                </div>
              </div>

              {/* Location badge */}
              <div className="absolute -bottom-4 -right-4">
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">
                        {profile.location.display}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="space-y-4">
              {about.quickFacts.map((fact) => {
                const Icon = getQuickFactIcon(fact.label)
                return (
                  <Card key={fact.label} className="tech-card">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {fact.label}
                          </div>
                          <div className="font-semibold">{fact.value}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {fact.year}
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
        <div className="absolute right-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:right-[calc(50%-18rem)] lg:right-48 lg:top-[calc(50%-30rem)] xl:right-[calc(50%-24rem)]">
          <div
            className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-l from-muted/20 to-muted/10 opacity-20"
            style={{
              clipPath:
                'polygon(26.4% 48.3%, 8.3% 88.2%, 0% 53.6%, 2.6% 17.8%, 7.5% 15.1%, 24.3% 36%, 44.7% 52.5%, 53.5% 50.6%, 55% 37.1%, 49.7% 12.8%, 78.7% 35.9%, 99.9% 0%, 94.6% 48.9%, 78.6% 36.1%, 41.1% 99.8%, 26.4% 48.3%)',
            }}
          />
        </div>
      </div>
    </section>
  )
}
