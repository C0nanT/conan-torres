import { projects } from '@/lib/projects'
import { Suspense } from 'react'
import { ExperienceSection, HeroSection, YouTubeChannels } from './_components'
import { PrototypeRecommendations } from './_components/prototype-recommendations'
import { SectionDivider } from './_components/section-divider'

export default function HomePage() {
  return (
    <>
      <HeroSection projectsCount={projects.length} />
      <ExperienceSection />
      <SectionDivider />
      <Suspense>
        <PrototypeRecommendations />
      </Suspense>
      <SectionDivider />
      <YouTubeChannels />
    </>
  )
}
