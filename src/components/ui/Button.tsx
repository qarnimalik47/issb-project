import type { ComponentProps } from 'react'
import { cn } from './cn'

/**
 * Green is the structural action (start, save, continue). Brass is reserved for
 * the one action on a screen that is time-sensitive — a resume, a due revision.
 * If two brass buttons appear on one screen, one of them is wrong.
 */
type Variant = 'primary' | 'brass' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-pill font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-55'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400',
  brass: 'bg-brass-500 text-brand-950 hover:bg-brass-400',
  outline: 'border border-line-strong bg-surface text-ink hover:bg-sunk',
  ghost: 'text-ink-muted hover:bg-sunk hover:text-ink',
  danger: 'bg-flare-500 text-white hover:bg-flare-600',
}

const SIZES: Record<Size, string> = {
  sm: 'px-3.5 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra?: string) {
  return cn(BASE, VARIANTS[variant], SIZES[size], extra)
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ComponentProps<'button'> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...props} />
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ComponentProps<'a'> & { variant?: Variant; size?: Size }) {
  return <a className={buttonClass(variant, size, className)} {...props} />
}
