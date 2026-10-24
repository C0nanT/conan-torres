import { site } from '@/lib/site-data'
import { ExperienceItem } from './experience-item'
import { ResumeDownloadTitle } from './resume-download-title'

export function ExperienceSection() {
  return (
    <section className="bg-gradient-to-b from-background to-muted/30 pt-16 pb-8 lg:pt-20 lg:pb-10">
      <div className="max-w-6xl mx-auto px-4">
        <ResumeDownloadTitle />

        <div className="divide-y divide-border">
          {site.experience.map((job) => (
            <ExperienceItem key={`${job.company}-${job.period}`} job={job} />
          ))}
        </div>
      </div>
    </section>
  )
}
