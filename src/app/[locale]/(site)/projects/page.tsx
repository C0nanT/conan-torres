import { generateLocalizedMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import { ProjectList } from './_components'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return await generateLocalizedMetadata(locale, 'projects')
}

export default function ProjectsPage() {
  return <ProjectList />
}
