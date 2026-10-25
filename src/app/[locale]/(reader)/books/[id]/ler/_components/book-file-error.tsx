import { Button } from '@/components/ui/button'
import type { BookFileFailure } from '@/lib/reader/book-file-log'
import { AlertTriangle, LogOut } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { logout } from '../actions'

export async function BookFileError({ reason }: { reason: BookFileFailure }) {
  const t = await getTranslations('reader')

  return (
    <div className="flex max-w-md flex-col items-center gap-3">
      <AlertTriangle aria-hidden={true} className="h-8 w-8 text-destructive" />
      <h1 className="font-bold text-2xl">{t('fileError.title')}</h1>
      <p role="alert" className="text-muted-foreground">
        {t(`fileError.${reason}`)}
      </p>
      <form action={logout}>
        <Button type="submit" variant="ghost" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          {t('signOut')}
        </Button>
      </form>
    </div>
  )
}
