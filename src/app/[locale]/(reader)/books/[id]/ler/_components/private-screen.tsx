import { Button } from '@/components/ui/button'
import type { RecommendedBook } from '@/lib/site-data'
import { ExternalLink, Lock } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { LoginState } from '../actions'
import { PasswordForm } from './password-form'

export async function PrivateScreen({
  book,
  isConfigured,
  initialState,
}: {
  book: RecommendedBook
  isConfigured: boolean
  initialState: LoginState
}) {
  const t = await getTranslations('reader')

  return (
    <div className="flex flex-col items-center gap-6">
      <Lock aria-hidden={true} className="h-8 w-8 text-muted-foreground" />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">{t('privateTitle')}</h1>
        <p className="max-w-md text-muted-foreground">
          {t('privateDescription', { title: book.title })}
        </p>
      </div>
      {isConfigured ? (
        <PasswordForm initialState={initialState} />
      ) : (
        <output className="block max-w-md text-sm text-destructive">
          {t('notConfigured')}
        </output>
      )}
      <Button asChild={true} size="sm" variant="secondary">
        <a href={book.url} target="_blank" rel="noopener noreferrer">
          {t('buy')}
          <ExternalLink className="ml-2 h-3.5 w-3.5" />
        </a>
      </Button>
    </div>
  )
}
