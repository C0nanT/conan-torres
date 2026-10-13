import { Footer, Navigation } from '@/components/layout'
import { InitialLoading } from '@/components/ui/initial-loading'
import { RouteTransition } from '@/components/ui/route-transition'
import { Toaster } from '@/components/ui/sonner'
import {
  generateLocalizedMetadata,
  generateStructuredData,
} from '@/lib/metadata'
import { site } from '@/lib/site-data'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import '@/styles/globals.css'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const baseMetadata = await generateLocalizedMetadata(locale, 'home')

  return {
    ...baseMetadata,
    title: {
      default: baseMetadata.title as string,
      template: `%s | ${site.site.name}`,
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      shortcut: ['/favicon.ico'],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        {
          rel: 'mask-icon',
          url: '/safari-pinned-tab.svg',
          color: '#000000',
        },
      ],
    },
    manifest: `/${locale}/manifest.webmanifest`,
    verification: {
      google: 'your-google-verification-code',
    },
  }
}

const locales = ['pt', 'en']

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale)) {
    notFound()
  }

  const messages = await getMessages({ locale })

  const langAttribute = locale === 'pt' ? 'pt-BR' : 'en-US'

  const personStructuredData = generateStructuredData('Person', {
    name: site.profile.fullName,
    alternateName: [
      site.profile.aliases[0],
      site.profile.displayName,
      site.profile.aliases[1],
    ],
    description:
      locale === 'pt'
        ? `${site.profile.jobTitle} e Educador especialista em algoritmos e estruturas de dados`
        : `${site.profile.jobTitle} and Educator expert in algorithms and data structures`,
    nationality: site.profile.nationality,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.profile.structuredDataLocation.city,
      addressCountry: site.profile.structuredDataLocation.countryCode,
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: site.profile.education.institution,
    },
    knowsAbout: site.profile.knowsAbout,
  })

  const websiteStructuredData = generateStructuredData('WebSite', {
    name: site.site.name,
    alternateName: site.profile.aliases[0],
    description:
      locale === 'pt'
        ? `Site oficial de ${site.profile.displayName} - ${site.profile.jobTitle} e Educador`
        : `Official website of ${site.profile.displayName} - ${site.profile.jobTitle} and Educator`,
    inLanguage: locale === 'pt' ? 'pt-BR' : 'en-US',
  })

  const structuredDataArray = [personStructuredData, websiteStructuredData]

  return (
    <html lang={langAttribute} suppressHydrationWarning={true}>
      <head suppressHydrationWarning={true}>
        <script
          type="application/ld+json"
          suppressHydrationWarning={true}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe static JSON-LD structured data
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredDataArray),
          }}
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        <link rel="dns-prefetch" href="//www.linkedin.com" />
        <link rel="dns-prefetch" href="//github.com" />

        <style
          suppressHydrationWarning={true}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe static CSS for initial render
          dangerouslySetInnerHTML={{
            __html: `
              body {
                background-color: hsl(var(--background));
                color: hsl(var(--foreground));
              }
            `,
          }}
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <InitialLoading />
          <div className="flex flex-col">
            <Suspense fallback={<div className="h-16 bg-background" />}>
              <Navigation />
            </Suspense>
            <main className="min-h-screen">
              <RouteTransition>{children}</RouteTransition>
            </main>
            <Footer />
          </div>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
