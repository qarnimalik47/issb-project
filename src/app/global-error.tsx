'use client'

/**
 * Global error boundary — catches errors thrown in the root layout itself.
 * Must render its own <html>/<body> because it replaces the root layout.
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en" dir="ltr">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ fontSize: '1.25rem' }}>Something went wrong</h1>
          <p style={{ color: '#666' }}>An unexpected error occurred.</p>
          <button onClick={reset} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
