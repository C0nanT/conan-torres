import { generateLocalizedMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import { CertificationList } from './_components'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return await generateLocalizedMetadata(locale, 'certificates')
}

export default function CertificatesPage() {
  return <CertificationList />
}
