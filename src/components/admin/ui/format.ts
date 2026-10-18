/**
 * Formatting used across the admin screens.
 *
 * Kept in one place because an operator comparing two screens must see the same
 * number written the same way — a figure that is "PKR 12,000" here and "12000"
 * there costs a second of doubt every time.
 */

/** Minor units to a currency string. Prices are stored in cents/paisa. */
export function money(cents: number, currency = 'PKR'): string {
  const value = cents / 100
  try {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency,
      maximumFractionDigits: value >= 1000 ? 0 : 2,
    }).format(value)
  } catch {
    return `${currency} ${value.toFixed(2)}`
  }
}

/** 1,284 · 12.9K · 4.2M — for tiles where the exact digit does not matter. */
export function compact(n: number): string {
  if (Math.abs(n) < 10_000) return n.toLocaleString('en-GB')
  return new Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

export function count(n: number): string {
  return n.toLocaleString('en-GB')
}

export function usd(amount: number): string {
  return `$${amount < 1 ? amount.toFixed(4).replace(/0+$/, '').replace(/\.$/, '') : amount.toFixed(2)}`
}

export function percent(fraction: number, digits = 1): string {
  return `${(fraction * 100).toFixed(digits)}%`
}

export function bytes(n: number): string {
  if (n < 1024) return `${n} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = n / 1024
  let i = 0
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i++
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[i]}`
}

export function date(value: string | Date | null | undefined): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function dateTime(value: string | Date | null | undefined): string {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** "3 days ago" — for recency, where the exact timestamp is noise. */
export function relative(value: string | Date | null | undefined): string {
  if (!value) return 'never'
  const then = new Date(value).getTime()
  const seconds = Math.round((Date.now() - then) / 1000)
  if (seconds < 60) return 'just now'
  const steps: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, 'minute'],
    [3600, 'hour'],
    [86_400, 'day'],
    [604_800, 'week'],
    [2_592_000, 'month'],
    [31_536_000, 'year'],
  ]
  const fmt = new Intl.RelativeTimeFormat('en-GB', { numeric: 'auto' })
  let chosen: [number, Intl.RelativeTimeFormatUnit] = steps[0]!
  for (const step of steps) {
    if (seconds >= step[0]) chosen = step
  }
  return fmt.format(-Math.round(seconds / chosen[0]), chosen[1])
}

export function duration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86_400)
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  return `${Math.floor(seconds / 86_400)}d ${Math.floor((seconds % 86_400) / 3600)}h`
}

/** Signed change between two periods, as a fraction. Null when there is no base. */
export function change(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null
  return (current - previous) / previous
}
