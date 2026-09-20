/**
 * Shared class strings for the exam UI, following the `inputCls`/`btnCls`
 * convention in AuthForms.tsx. Colours come from the semantic tokens in
 * globals.css (surface / raised / line / ink), so light and dark mode are
 * handled once here rather than as `dark:` pairs in every component.
 */

/**
 * The one focus style. Every interactive element in the exam uses it — the app
 * otherwise has no visible focus styling, which makes keyboard use guesswork.
 */
export const focusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface'

const btnBase = `inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`

export const btnPrimary = `${btnBase} bg-brand-700 text-white hover:bg-brand-800 dark:bg-brand-500 dark:text-brand-950 dark:hover:bg-brand-400`
export const btnSecondary = `${btnBase} border border-line bg-raised text-ink hover:bg-surface`
export const btnGhost = `${btnBase} text-ink-muted hover:bg-surface hover:text-ink`
export const btnLarge = 'px-6 py-3 text-base'

export const card = 'rounded-card border border-line bg-raised shadow-card'

export const kbd =
  'inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-line bg-surface px-1.5 font-mono text-xs text-ink-muted'

export const eyebrow = 'text-xs font-medium tracking-wide text-ink-muted uppercase'
