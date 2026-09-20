'use client'

/**
 * Route-level error boundary. Shows a safe, generic message (rule: user-facing
 * errors leak nothing) while the full error is captured by Next's overlay in
 * development and by error tracking in production.
 */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-ink-muted">An unexpected error occurred. Please try again.</p>
      <button
        onClick={reset}
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400"
      >
        Try again
      </button>
    </main>
  )
}
