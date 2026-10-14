import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Project } from '@/lib/projects'
import { Code2, ExternalLink, Github } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

function ProjectCover({ project }: { project: Project }) {
  if (project.image) {
    return (
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={project.image}
          alt=""
          fill={true}
          sizes="(min-width: 1024px) 512px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div
      aria-hidden={true}
      className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-muted to-muted/40"
    >
      <span className="text-2xl font-bold text-muted-foreground/60">
        {project.language ?? <Code2 className="h-8 w-8" />}
      </span>
    </div>
  )
}

export function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations('projects')

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-lg border border-border transition-[transform,border-color] duration-200 ease-out motion-reduce:transition-none motion-safe:hover:-translate-y-1 hover:border-primary/50">
      <ProjectCover project={project} />
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold">{project.name}</h2>
          {project.language && (
            <Badge variant="secondary">{project.language}</Badge>
          )}
        </div>

        {project.description && (
          <p className="text-sm text-muted-foreground">{project.description}</p>
        )}

        {project.stack.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label={t('stack')}>
            {project.stack.map((tech) => (
              <li key={tech}>
                <Badge variant="outline" className="text-xs">
                  {tech}
                </Badge>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap gap-2">
          <Button asChild={true} variant="outline" size="sm">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('codeLabel', { name: project.name })}
            >
              <Github aria-hidden={true} className="h-4 w-4" />
              {t('code')}
            </a>
          </Button>
          {project.demoUrl && (
            <Button asChild={true} variant="outline" size="sm">
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('demoLabel', { name: project.name })}
              >
                <ExternalLink aria-hidden={true} className="h-4 w-4" />
                {t('demo')}
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
