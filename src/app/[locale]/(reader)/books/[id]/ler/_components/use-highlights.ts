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

  const add = async (input: NewHighlight): Promise<boolean> => {
    try {
      const result = await addHighlight(bookId, input)
      if (result.status === 'created') {
        setHighlights((current) => [...current, result.highlight].sort(byPage))
        return true
      }
      toast.error(t(`errors.${result.status}`))
    } catch {
      toast.error(t('errors.error'))
    }
    return false
  }

  const remove = async (id: string): Promise<boolean> => {
    try {
      const result = await removeHighlight(bookId, id)
      if (result.status === 'deleted') {
        setHighlights((current) => current.filter((item) => item.id !== id))
        return true
      }
      toast.error(t(`errors.${result.status}`))
    } catch {
      toast.error(t('errors.error'))
    }
    return false
  }

  return { highlights, add, remove }
}
