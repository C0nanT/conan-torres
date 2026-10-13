import { site } from '@/lib/site-data'
import { ResumeDownloadTitle } from './resume-download-title'

export function ExperienceSection() {
  return (
    <section className="bg-gradient-to-b from-background to-muted/30 pt-16 pb-8 lg:pt-20 lg:pb-10">
      <div className="max-w-6xl mx-auto px-4">
        <ResumeDownloadTitle />

        <div className="divide-y divide-border">
          {site.experience.map((job) => (
            <div
              key={`${job.company}-${job.period}`}
              className="group grid gap-4 px-3 transition-colors duration-200 py-8 md:grid-cols-[280px_1fr] md:gap-12 hover:bg-muted/40"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-bold">
                  {job.company}{' '}
                  <span className="text-sm font-medium text-primary">
                    [{job.level}]
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground">{job.role}</p>
                <p className="text-sm text-muted-foreground">{job.period}</p>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                {job.highlights.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" className="text-primary">
                      ▸
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
