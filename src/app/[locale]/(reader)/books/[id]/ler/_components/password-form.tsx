'use client'

import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useFormState, useFormStatus } from 'react-dom'
import { type LoginState, login } from '../actions'

function SubmitButton({ isDisabled }: { isDisabled: boolean }) {
  const t = useTranslations('reader')
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={isDisabled || pending}>
      {pending ? t('submitting') : t('submit')}
    </Button>
  )
}

function StatusMessage({ state }: { state: LoginState }) {
  const t = useTranslations('reader')

  switch (state.status) {
    case 'wrong-password':
      return t('wrongPassword')
    case 'locked':
      return t('locked', { minutes: state.minutesLeft })
    case 'not-configured':
      return t('notConfigured')
    default:
      return null
  }
}

export function PasswordForm({ initialState }: { initialState: LoginState }) {
  const t = useTranslations('reader')
  const [state, formAction] = useFormState(login, initialState)
  const isLocked = state.status === 'locked'

  return (
    <form action={formAction} className="flex w-full max-w-xs flex-col gap-3">
      <label htmlFor="reader-password" className="text-left text-sm">
        {t('passwordLabel')}
      </label>
      <input
        id="reader-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required={true}
        disabled={isLocked}
        aria-describedby="reader-password-status"
        className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      />
      <SubmitButton isDisabled={isLocked} />
      <output
        id="reader-password-status"
        className="block min-h-5 text-sm text-destructive"
      >
        <StatusMessage state={state} />
      </output>
    </form>
  )
}
