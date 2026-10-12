import { type Certification, certifications } from '@/lib/site-data'

// issuedAt is YYYY-MM, so it sorts as a string. Array#sort is stable, so ties
// keep the JSON order.
export function getSortedCertifications(): Certification[] {
  return [...certifications].sort((a, b) =>
    b.issuedAt.localeCompare(a.issuedAt)
  )
}

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  timeZone: 'UTC',
})

// 'YYYY-MM' -> 'mai. 2026'
export function formatCertificationDate(issuedAt: string): string {
  const [year, month] = issuedAt.split('-').map(Number)
  if (!(year && month)) {
    return issuedAt
  }

  return `${monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)))} ${year}`
}
