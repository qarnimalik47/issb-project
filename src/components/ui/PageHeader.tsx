import type { ReactNode } from 'react'

/**
 * Title, one line of orientation, and up to one action. The brass rule under
 * the title is the only ornament in the app's page chrome.
 */
export function PageHeader({
  title,
  lede,
  action,
}: {
  title: ReactNode
  lede?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {title}
        </h1>
        {lede && <p className="mt-3 max-w-prose text-ink-muted">{lede}</p>}
      </div>
      {action}
    </div>
  )
}
