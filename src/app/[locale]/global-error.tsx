'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'system-ui, sans-serif',
            backgroundColor: '#f8fafc',
          }}
        >
          <div
            style={{
              maxWidth: '32rem',
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                width: '5rem',
                height: '5rem',
                backgroundColor: '#fee2e2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '2rem',
              }}
            >
              ⚠️
            </div>

            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#1f2937',
              }}
            >
              Erro Crítico
            </h1>

            <p
              style={{
                fontSize: '1.125rem',
                color: '#6b7280',
                marginBottom: '2rem',
              }}
            >
              Ocorreu um erro crítico na aplicação. Nossa equipe foi notificada.
            </p>

            <button
              type="button"
              onClick={reset}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                marginRight: '1rem',
              }}
            >
              Tentar Novamente
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = '/'
              }}
              style={{
                backgroundColor: 'transparent',
                color: '#6b7280',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
