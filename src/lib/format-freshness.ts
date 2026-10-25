import type { LiveChannelStats, LiveVideoStats } from '@/lib/youtube/live-stats'

const FALLBACK_TEXT = 'Valor aproximado — ainda não foi possível atualizar'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

function formatBrasiliaDate(epochMs: number) {
  const parts = Object.fromEntries(
    dateFormatter.formatToParts(epochMs).map((part) => [part.type, part.value])
  )
  return `${parts.day}/${parts.month}/${parts.year} às ${parts.hour}:${parts.minute}`
}

// Card date is the oldest fetched-at; any fallback number makes it approximate.
export function formatCardFreshness(
  ...stats: (LiveVideoStats | LiveChannelStats | undefined)[]
) {
  const fetchedAts: number[] = []
  for (const item of stats) {
    if (!item) {
      continue
    }
    if (item.isFallback) {
      return FALLBACK_TEXT
    }
    fetchedAts.push(item.fetchedAt)
  }
  if (fetchedAts.length === 0) {
    return FALLBACK_TEXT
  }
  return `Atualizado em ${formatBrasiliaDate(Math.min(...fetchedAts))}`
}
