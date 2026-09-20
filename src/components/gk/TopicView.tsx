import type { GkTopic } from '@/lib/db/schema/gk'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

/**
 * One topic, read-only.
 *
 * The order is the order a candidate needs it in: what this is, the checkable
 * facts, the points to speak from, how it unfolded, how to handle it in the
 * interview, and finally where every claim came from. Provenance is part of
 * the page, not a footnote — a candidate who cannot check a fact should not
 * repeat it at a board.
 */
export function TopicView({ topic }: { topic: GkTopic }) {
  const dateFmt = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' })
  return (
    <article className="flex max-w-3xl flex-col gap-10">
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="neutral">{sectionLabel(topic.section)}</Badge>
          {topic.origin === 'gathered' && topic.lastGatheredAt && (
            <span className="text-xs text-ink-muted">
              Updated {dateFmt.format(new Date(topic.lastGatheredAt))}
            </span>
          )}
        </div>
        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {topic.titleEn}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-muted">{topic.summaryEn}</p>
      </header>

      {topic.facts.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Facts to know</h2>
          <dl className="mt-4 overflow-hidden rounded-card border border-line">
            {topic.facts.map((fact, i) => (
              <div
                key={`${fact.label}-${i}`}
                className="flex flex-col gap-1 border-b border-line bg-surface px-4 py-3 last:border-b-0 sm:flex-row sm:gap-6"
              >
                <dt className="shrink-0 text-sm text-ink-muted sm:w-44">{fact.label}</dt>
                <dd className="m-0 text-sm font-medium text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {topic.points.map((group) => (
        <section key={group.heading}>
          <h2 className="font-display text-lg font-semibold text-ink">{group.heading}</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {group.bullets.map((bullet, i) => (
              <li key={i} className="flex gap-3 text-ink-muted">
                <span
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brass-500"
                  aria-hidden="true"
                />
                <span className="leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {topic.timeline.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">How it unfolded</h2>
          <ol className="mt-4 flex flex-col">
            {topic.timeline.map((entry, i) => (
              <li key={i} className="flex gap-4 border-s border-line ps-5 pb-5 last:pb-0">
                <div className="-ms-[1.6rem] mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600" />
                <div className="-ms-1">
                  <div className="font-display text-sm font-semibold text-ink">{entry.date}</div>
                  <p className="mt-1 leading-relaxed text-ink-muted">{entry.event}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {topic.issbAngle && (
        <Card className="border-brass-200 bg-brass-50 dark:border-brass-700 dark:bg-brass-900/30">
          <h2 className="font-display text-lg font-semibold text-ink">Discussing this at ISSB</h2>
          <p className="mt-2.5 leading-relaxed text-ink-muted">{topic.issbAngle}</p>
        </Card>
      )}

      {topic.coverage.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Recent coverage</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {topic.coverage.map((item) => (
              <li key={item.url} className="text-sm">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink underline underline-offset-4 hover:text-brand-700"
                >
                  {item.headline}
                </a>
                <span className="text-ink-muted"> — {item.sourceName}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {topic.sources.length > 0 && (
        <footer className="border-t border-line pt-6">
          <h2 className="font-display text-sm font-semibold text-ink">Sources</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {topic.sources.map((source) => (
              <li key={source.url} className="text-sm text-ink-muted">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-ink"
                >
                  {source.name}
                </a>
                <span> · {source.license}</span>
                <span> · retrieved {dateFmt.format(new Date(source.retrievedAt))}</span>
              </li>
            ))}
          </ul>
          {topic.narrativeModel && (
            <p className="mt-3 text-xs leading-relaxed text-ink-muted">
              The written sections were drafted from these sources by {topic.narrativeModel}. Check
              anything you plan to state as fact at a board.
            </p>
          )}
        </footer>
      )}
    </article>
  )
}

const SECTION_LABELS: Record<string, string> = {
  pakistan: 'Pakistan',
  personalities: 'Personalities',
  defence: 'Defence',
  history: 'History',
  geography: 'Geography',
  islamic: 'Islamic studies',
  world: 'World',
  science: 'Science and technology',
  conflict: 'Conflicts and wars',
  diplomacy: 'Diplomacy',
  economy: 'Economy',
  organisations: 'Organisations',
}

export function sectionLabel(section: string): string {
  return SECTION_LABELS[section] ?? section
}
