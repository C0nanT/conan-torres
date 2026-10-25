import { Button } from '@/components/ui/button'
import { Link } from '@/lib/navigation'
import { ArrowLeft } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'
import { CautionTape } from './caution-tape'

interface MaintenancePageProps {
  // the page's real content, shown faded behind the tape
  children: ReactNode
}

export async function MaintenancePage({ children }: MaintenancePageProps) {
  const t = await getTranslations('maintenance')
  return (
    <div className="relative h-[85vh] min-h-[32rem] overflow-hidden">
      <div
        aria-hidden="true"
        inert={true}
        className="pointer-events-none absolute inset-0 select-none opacity-25 blur-[2px]"
      >
        {children}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="relative h-32 w-full">
          <CautionTape
            label={t('tape')}
            size="lg"
            repeat={12}
            className="absolute inset-x-[-10%] top-1/2 -translate-y-1/2 -rotate-6"
          />
          <CautionTape
            label={t('tape')}
            size="lg"
            repeat={12}
            className="absolute inset-x-[-10%] top-1/2 -translate-y-1/2 rotate-3"
          />
        </div>

        <div className="mt-10 max-w-md space-y-6 px-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <p className="text-lg text-muted-foreground">{t('description')}</p>
          </div>
          <Button asChild={true} className="group">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1 motion-reduce:transition-none" />
              {t('backToHome')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
