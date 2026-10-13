'use client'

import { site } from '@/lib/site-data'
import { MessageCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

const WHATSAPP_URL = `https://api.whatsapp.com/send/?phone=${site.contact.whatsapp}`

export function WhatsappFloatingButton() {
  const t = useTranslations('common')

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsappChat')}
      className="fixed bottom-4 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white transition-colors duration-200 ease-out hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none md:bottom-8 md:right-8"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
    </a>
  )
}
