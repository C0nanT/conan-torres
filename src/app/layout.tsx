import { ClarityAnalytics } from '@/components/clarity'
import { getSiteUrl } from '@/lib/site-data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ClarityAnalytics />
      {children}
    </>
  )
}
