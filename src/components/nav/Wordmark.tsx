/**
 * An insignia tile rather than a logotype: a brass chevron on regiment green.
 * It reads at 28px, which is the only size it is ever used at.
 */
export function Wordmark({ appName, href = '/dashboard' }: { appName: string; href?: string }) {
  return (
    <a href={href} className="flex shrink-0 items-center gap-2.5" aria-label={appName}>
      <span
        className="flex h-8 w-8 items-center justify-center rounded-[0.6rem] bg-brand-700"
        aria-hidden="true"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor">
          <path
            d="M3 12.5 10 6l7 6.5"
            className="text-brass-400"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 16.5 10 10l7 6.5"
            className="text-brand-300"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="font-display text-[0.95rem] leading-tight font-bold tracking-tight text-ink">
        {appName}
      </span>
    </a>
  )
}
