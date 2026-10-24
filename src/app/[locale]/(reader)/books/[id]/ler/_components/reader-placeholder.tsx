import { Button } from '@/components/ui/button'
import type { RecommendedBook } from '@/lib/site-data'
import { LogOut } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { logout } from '../actions'

// Stand-in until the PDF viewer lands (ticket 03).
export async function ReaderPlaceholder({ book }: { book: RecommendedBook }) {
  const t = await getTranslations('reader')

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold sm:text-3xl">{book.title}</h1>
      <p className="text-muted-foreground">{t('placeholder')}</p>
      <form action={logout}>
        <Button type="submit" variant="ghost" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          {t('signOut')}
        </Button>
      </form>
    </div>
  )
}
