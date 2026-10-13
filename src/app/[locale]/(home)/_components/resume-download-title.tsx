'use client'

import { useTranslations } from 'next-intl'
import { RiDownload2Line } from 'react-icons/ri'
import { toast } from 'sonner'

export function ResumeDownloadTitle() {
  const t = useTranslations('experience')

  const handleClick = () => {
    toast(t('resumeUnavailable.title'), {
      description: t('resumeUnavailable.description'),
    })
  }

  return (
    <h2 className="mb-12 text-3xl font-bold lg:text-4xl">
      <button
        type="button"
        onClick={handleClick}
        aria-label={t('downloadResume')}
        className="group inline-flex items-center gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span className="underline decoration-transparent decoration-2 underline-offset-8 transition-colors duration-300 ease-out group-hover:text-primary group-hover:decoration-primary motion-reduce:transition-none">
          {t('titlePrefix')}{' '}
          <span className="gradient-text transition-colors duration-300 ease-out group-hover:text-primary motion-reduce:transition-none">
            {t('titleHighlight')}
          </span>
        </span>
        <RiDownload2Line
          aria-hidden="true"
          className="size-6 shrink-0 text-muted-foreground transition-colors duration-300 ease-out group-hover:text-primary motion-reduce:transition-none lg:size-7"
        />
      </button>
    </h2>
  )
}
