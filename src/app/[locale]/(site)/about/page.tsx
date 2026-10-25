import { MaintenancePage } from '@/components/common'
import { isProductionEnv } from '@/lib/app-env'
import { generateLocalizedMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import { connection } from 'next/server'
import { AboutHero, Philosophy } from './_components'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return await generateLocalizedMetadata(locale, 'about')
}

// Rendered per request: APP_ENV is only in the runtime .env, not at build.
export default async function AboutPage() {
  await connection()
  if (isProductionEnv()) {
    return <MaintenancePage />
  }
  return (
    <>
      <AboutHero />
      <Philosophy />
    </>
  )
}
