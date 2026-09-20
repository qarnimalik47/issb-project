/**
 * Answered-so-far bar. The track is a flex row with the fill as its first
 * child, so the fill grows from the start edge in both directions — right to
 * left in Urdu — with no `left-0` positioning to get wrong.
 */
export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className="flex h-1.5 w-full overflow-hidden rounded-pill bg-line"
    >
      <div
        className="rounded-pill bg-brand-600 transition-[width] duration-300 ease-(--ease-exam) dark:bg-brand-400"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
