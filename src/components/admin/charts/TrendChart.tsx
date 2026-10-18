'use client'

import { useId, useMemo, useState } from 'react'
import { cn } from '@/components/ui/cn'

/**
 * The one time-series chart the admin panel uses.
 *
 * An HTML chart is interactive by default, so this ships a crosshair and a
 * tooltip rather than pretending to be a picture: the axis carries the shape,
 * the hover carries the values, and only the last point is directly labelled.
 * One series takes no legend — the title already names it; two get a legend and
 * direct end labels, so identity never rests on colour alone.
 */
export type Series = {
  label: string
  points: { date: string; value: number }[]
  /** Slot 1 and slot 2 of the validated categorical palette. */
  slot?: 1 | 2
  /** Draw a wash beneath the line. Only sensible for a single series. */
  area?: boolean
}

const PAD = { top: 16, right: 16, bottom: 22, left: 44 }

/**
 * Round tick values. The step never drops below 1 because every series here is
 * counted in whole units (people, jobs, minor currency units) — fractional
 * ticks on an all-zero day produced two "Rs 0.01" labels one above the other.
 */
function niceTicks(max: number): number[] {
  if (max <= 0) return [0, 1]
  const raw = max / 3
  const mag = 10 ** Math.floor(Math.log10(raw))
  const candidate = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? mag * 10
  const step = Math.max(1, candidate)
  const ticks: number[] = []
  for (let v = 0; v <= max + step * 0.001; v += step) ticks.push(v)
  return ticks
}

export function TrendChart({
  series,
  height = 220,
  formatValue = (n: number) => n.toLocaleString('en-GB'),
  className,
}: {
  series: Series[]
  height?: number
  formatValue?: (n: number) => string
  className?: string
}) {
  const uid = useId().replace(/[:]/g, '')
  const [hover, setHover] = useState<number | null>(null)
  const width = 720
  const length = series[0]?.points.length ?? 0

  const { ticks, max, xFor, yFor } = useMemo(() => {
    const peak = Math.max(1, ...series.flatMap((s) => s.points.map((p) => p.value)))
    const t = niceTicks(peak)
    const top = t[t.length - 1] ?? peak
    return {
      ticks: t,
      max: top,
      xFor: (i: number) =>
        PAD.left + (length <= 1 ? 0 : (i / (length - 1)) * (width - PAD.left - PAD.right)),
      yFor: (v: number) => PAD.top + (1 - v / top) * (height - PAD.top - PAD.bottom),
    }
  }, [series, length, height])

  if (length === 0) {
    return (
      <p className="py-10 text-center text-sm text-ink-muted">Nothing recorded in this window.</p>
    )
  }

  const colourFor = (s: Series) => `var(--chart-${s.slot ?? 1})`
  const labels = series[0]!.points.map((p) => p.date)
  const active = hover ?? length - 1

  return (
    <figure className={cn('m-0', className)}>
      {series.length > 1 && (
        <figcaption className="mb-2 flex flex-wrap items-center gap-4">
          {series.map((s) => (
            <span key={s.label} className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
              <span
                className="h-0.5 w-4 rounded-pill"
                style={{ backgroundColor: colourFor(s) }}
                aria-hidden="true"
              />
              {s.label}
            </span>
          ))}
        </figcaption>
      )}

      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full touch-none"
          style={{ height }}
          role="img"
          aria-label={`${series.map((s) => s.label).join(' and ')} over ${length} days`}
          onMouseLeave={() => setHover(null)}
          onMouseMove={(e) => {
            const box = e.currentTarget.getBoundingClientRect()
            const x = ((e.clientX - box.left) / box.width) * width
            const ratio = (x - PAD.left) / (width - PAD.left - PAD.right)
            setHover(Math.max(0, Math.min(length - 1, Math.round(ratio * (length - 1)))))
          }}
        >
          <defs>
            {series.map((s) => (
              <linearGradient
                key={s.label}
                id={`${uid}-${s.label.replace(/\W/g, '')}`}
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor={colourFor(s)} stopOpacity="0.16" />
                <stop offset="100%" stopColor={colourFor(s)} stopOpacity="0.01" />
              </linearGradient>
            ))}
          </defs>

          {/* Recessive hairline grid — solid, never dashed. */}
          {ticks.map((t, i) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={width - PAD.right}
                y1={yFor(t)}
                y2={yFor(t)}
                stroke="var(--chart-grid)"
                strokeWidth="1"
              />
              {(i === 0 || formatValue(t) !== formatValue(ticks[i - 1]!)) && (
                <text
                  x={PAD.left - 8}
                  y={yFor(t) + 4}
                  textAnchor="end"
                  className="fill-ink-muted text-[11px] tabular-nums"
                >
                  {formatValue(t)}
                </text>
              )}
            </g>
          ))}

          {series.map((s) => {
            const line = s.points
              .map((p, i) => `${i === 0 ? 'M' : 'L'}${xFor(i)},${yFor(p.value)}`)
              .join(' ')
            return (
              <g key={s.label}>
                {s.area && (
                  <path
                    d={`${line} L${xFor(length - 1)},${yFor(0)} L${xFor(0)},${yFor(0)} Z`}
                    fill={`url(#${uid}-${s.label.replace(/\W/g, '')})`}
                  />
                )}
                <path
                  d={line}
                  fill="none"
                  stroke={colourFor(s)}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Only the last point is marked; a dot per day is noise. */}
                <circle
                  cx={xFor(length - 1)}
                  cy={yFor(s.points[length - 1]!.value)}
                  r="4"
                  fill={colourFor(s)}
                  stroke="var(--surface)"
                  strokeWidth="2"
                />
              </g>
            )
          })}

          {hover !== null && (
            <g>
              <line
                x1={xFor(hover)}
                x2={xFor(hover)}
                y1={PAD.top}
                y2={height - PAD.bottom}
                stroke="var(--line-strong)"
                strokeWidth="1"
              />
              {series.map((s) => (
                <circle
                  key={s.label}
                  cx={xFor(hover)}
                  cy={yFor(s.points[hover]!.value)}
                  r="4.5"
                  fill={colourFor(s)}
                  stroke="var(--surface)"
                  strokeWidth="2"
                />
              ))}
            </g>
          )}

          {/* First and last day only — a tick per day is unreadable at this width. */}
          <text x={PAD.left} y={height - 4} className="fill-ink-muted text-[11px]">
            {labels[0]}
          </text>
          <text
            x={width - PAD.right}
            y={height - 4}
            textAnchor="end"
            className="fill-ink-muted text-[11px]"
          >
            {labels[length - 1]}
          </text>
        </svg>

        {/* Tooltip lives in HTML so it inherits type and never clips the SVG. */}
        <div
          className="pointer-events-none absolute top-2 rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-card"
          style={{
            left: `${(xFor(active) / width) * 100}%`,
            transform: active > length / 2 ? 'translateX(-105%)' : 'translateX(5%)',
          }}
        >
          <p className="font-medium text-ink">{labels[active]}</p>
          {series.map((s) => (
            <p key={s.label} className="mt-1 flex items-center gap-1.5 text-ink-muted">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: colourFor(s) }}
                aria-hidden="true"
              />
              {s.label}
              <span className="ml-1 font-semibold text-ink tabular-nums">
                {formatValue(s.points[active]!.value)}
              </span>
            </p>
          ))}
        </div>
      </div>

      {/* The values are never gated behind the hover. */}
      <details className="mt-3">
        <summary className="cursor-pointer text-xs text-ink-muted hover:text-ink">
          View as table
        </summary>
        <div className="mt-2 max-h-56 overflow-y-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="pb-1 text-left font-medium text-ink-muted">Date</th>
                {series.map((s) => (
                  <th key={s.label} className="pb-1 text-right font-medium text-ink-muted">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {labels.map((d, i) => (
                <tr key={d}>
                  <td className="py-0.5 text-ink-muted">{d}</td>
                  {series.map((s) => (
                    <td key={s.label} className="py-0.5 text-right text-ink tabular-nums">
                      {formatValue(s.points[i]!.value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <span className="sr-only">Peak value {formatValue(max)}.</span>
    </figure>
  )
}
