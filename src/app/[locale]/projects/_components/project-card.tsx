import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Project } from '@/lib/projects'
import { ExternalLink, Github } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations('projects')

  return (
    <article className="flex w-full flex-col gap-4 rounded-lg border border-border p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold">{project.name}</h2>
        {project.language && (
          <Badge variant="secondary">{project.language}</Badge>
        )}
      </div>

      {project.description && (
        <p className="text-sm text-muted-foreground">{project.description}</p>
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
    </article>
  )
}
