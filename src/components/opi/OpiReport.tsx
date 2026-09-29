import type { OpiResult } from '@/lib/opi/score'
import { describeResult } from '@/lib/opi/score'
import { Card, Panel } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'

/**
 * The OPI result: type, traits, officer-like-quality factors and a candour
 * check. Server-rendered — nothing here is interactive.
 */
export function OpiReport({ result, takenAt }: { result: OpiResult; takenAt: Date }) {
  const { profile, traits, olq, reliability } = describeResult(result)

  return (
    <div className="flex flex-col gap-6">
      <Panel className="flex flex-col gap-3">
        <p className="text-sm text-brand-200">
          Your personality type ·{' '}
          {takenAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-display text-4xl font-bold tracking-tight text-white">
            {profile.name}
          </h2>
          <span className="font-mono text-2xl text-brass-300">
            {result.code}-{result.variant === 'Steady' ? 'S' : 'R'}
          </span>
        </div>
        <p className="text-lg text-brand-50">{profile.tagline}</p>
        <p className="max-w-prose text-brand-100">{profile.summary}</p>
        <p className="text-sm text-brand-200">
          {result.variant === 'Steady'
            ? 'Steady variant: composed under pressure and quick to recover from setbacks.'
            : 'Reactive variant: feels pressure and setbacks keenly; composure is worth practising.'}
        </p>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="font-display text-lg font-semibold text-ink">Strengths</h3>
          <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-ink">
            {profile.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="font-display text-lg font-semibold text-ink">Watch out for</h3>
          <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-ink">
            {profile.watchOuts.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <h3 className="font-display text-lg font-semibold text-ink">At the board</h3>
        <p className="mt-2 text-sm text-ink">{profile.atTheBoard}</p>
      </Card>

      <section className="flex flex-col gap-3">
        <h3 className="font-display text-xl font-semibold text-ink">Your five traits</h3>
        {traits.map((t) => {
          const towardsHigh = t.score >= 50
          const pct = towardsHigh ? t.score : 100 - t.score
          return (
            <Card key={t.key} className="flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-medium text-ink">{t.label}</h4>
                <span className="text-sm text-ink-muted tabular-nums">
                  {pct}% {towardsHigh ? t.high : t.low}
                </span>
              </div>
              <div dir="ltr" className="flex items-center gap-3 text-xs text-ink-muted">
                <span className="w-20 text-end">{t.low}</span>
                <div className="relative h-2 flex-1 rounded-pill bg-sunk">
                  <div className="absolute inset-y-0 left-1/2 w-px bg-line-strong" />
                  <div
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-brand-600 shadow"
                    style={{ left: `${t.score}%` }}
                    aria-hidden
                  />
                </div>
                <span className="w-20">{t.high}</span>
              </div>
              <p className="text-sm text-ink">{t.text}</p>
            </Card>
          )
        })}
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold text-ink">Officer-like qualities</h3>
          <p className="text-sm text-ink-muted">
            How your traits line up with the four factors the board groups its qualities into. An
            indication for practice only.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {olq.map((f) => (
            <Card key={f.key} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="font-medium text-ink">{f.label}</h4>
                <span className="font-display text-xl font-bold text-ink tabular-nums">
                  {f.score}
                </span>
              </div>
              <Progress
                value={f.score}
                label={`${f.label} ${f.score} out of 100`}
                tone={f.score < 45 ? 'brass' : 'green'}
              />
              <p className="text-xs text-ink-muted">{f.qualities}</p>
            </Card>
          ))}
        </div>
      </section>

      <Card className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-semibold text-ink">
            How reliable were your answers?
          </h3>
          <Badge
            tone={reliability === 'good' ? 'green' : reliability === 'fair' ? 'brass' : 'flare'}
          >
            {reliability === 'good'
              ? 'Consistent'
              : reliability === 'fair'
                ? 'Mostly consistent'
                : 'Inconsistent'}
          </Badge>
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink-muted">Consistency</dt>
            <dd className="font-medium text-ink tabular-nums">
              {Math.round(result.consistency * 100)}%
              <span className="ms-2 font-normal text-ink-muted">
                paired statements answered the same way
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-ink-muted">Candour index</dt>
            <dd className="font-medium text-ink tabular-nums">
              {result.candour}
              <span className="ms-2 font-normal text-ink-muted">
                lower is more candid; above 70 reads as &ldquo;faking good&rdquo;
              </span>
            </dd>
          </div>
        </dl>
        {result.flags.length > 0 ? (
          <ul className="list-disc space-y-1 ps-5 text-sm text-flare-600">
            {result.flags.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink">
            No warning signs. The real OPI is read the same way — for honest, consistent answers,
            not for a &ldquo;perfect&rdquo; profile.
          </p>
        )}
      </Card>

      <p className="text-xs text-ink-muted">
        Built on the public-domain IPIP Big-Five markers. This is a self-knowledge and practice
        tool, not a clinical assessment and not the board&rsquo;s own scoring.
      </p>
    </div>
  )
}
