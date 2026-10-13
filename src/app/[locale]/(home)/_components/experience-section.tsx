import { site } from '@/lib/site-data'

export function ExperienceSection() {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="mb-12 text-3xl font-bold lg:text-4xl">
          Minhas <span className="gradient-text">experiências</span>
        </h2>

        <div className="divide-y divide-border">
          {site.experience.map((job) => (
            <div
              key={`${job.company}-${job.period}`}
              className="grid gap-4 py-8 first:pt-0 last:pb-0 md:grid-cols-[280px_1fr] md:gap-12"
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
