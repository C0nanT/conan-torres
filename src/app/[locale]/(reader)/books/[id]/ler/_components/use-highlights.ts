'use client'

import type { Highlight, NewHighlight } from '@/lib/highlight-rules'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'
import { addHighlight, removeHighlight } from '../highlight-actions'

function byPage(a: Highlight, b: Highlight) {
  return a.page - b.page || a.createdAt.localeCompare(b.createdAt)
}

// The highlights on screen. The server is the source of truth: a highlight
// enters or leaves the list only after its action succeeded.
export function useHighlights(bookId: string, initial: Highlight[]) {
  const t = useTranslations('reader.highlights')
  const [highlights, setHighlights] = useState(initial)

  // Runs an action; `apply` updates the list and returns true on success.
  // Any other status, or a thrown network error, becomes a toast.
  const run = async <T extends { status: string }>(
    action: () => Promise<T>,
    apply: (result: T) => boolean
  ): Promise<boolean> => {
    try {
      const result = await action()
      if (apply(result)) {
        return true
      }
      toast.error(t(`errors.${result.status}`))
    } catch {
      toast.error(t('errors.error'))
    }
    return false
  }

  const add = (input: NewHighlight) =>
    run(
      () => addHighlight(bookId, input),
      (result) => {
        if (result.status !== 'created') {
          return false
        }
        const created = result.highlight
        setHighlights((current) => [...current, created].sort(byPage))
        return true
      }
    )

  const remove = (id: string) =>
    run(
      () => removeHighlight(bookId, id),
      (result) => {
        if (result.status !== 'deleted') {
          return false
        }
        setHighlights((current) => current.filter((item) => item.id !== id))
        return true
      }
    )

  return { highlights, add, remove }
}
