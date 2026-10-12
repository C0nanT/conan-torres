import type { Certification } from '@/lib/site-data'

export type CertificationLinkKind = 'credential' | 'file'

export interface CertificationLink {
  kind: CertificationLinkKind
  href: string
}

// Credential comes first: it is the primary action when both exist.
export function getCertificationLinks(
  certification: Certification
): CertificationLink[] {
  const links: CertificationLink[] = []

  if (certification.url) {
    links.push({ kind: 'credential', href: certification.url })
  }
  if (certification.file) {
    links.push({ kind: 'file', href: certification.file })
  }

  return links
}
