import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from '@/lib/navigation'
import { ArrowLeft, Wrench } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export async function MaintenancePage() {
  const t = await getTranslations('maintenance')
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="container mx-auto px-4">
        <Card className="tech-card max-w-2xl mx-auto">
          <CardContent className="p-12 text-center space-y-8">
            <div className="space-y-4">
              <Wrench className="mx-auto h-16 w-16 text-primary/40" />
              <h1 className="text-3xl font-bold">{t('title')}</h1>
              <p className="text-lg text-muted-foreground">
                {t('description')}
              </p>
            </div>

            <Button asChild={true} className="group">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform motion-reduce:transition-none" />
                {t('backToHome')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
