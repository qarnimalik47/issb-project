import type { GkTopic } from '@/lib/db/schema/gk'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { sectionLabel } from './sectionLabel'

/**
 * One topic, read-only.
 *
 * The order is the order a candidate needs it in: what this is, the checkable
 * facts, the points to speak from, how it unfolded, how to handle it in the
 * interview, and finally where every claim came from. Provenance is part of
 * the page, not a footnote — a candidate who cannot check a fact should not
 * repeat it at a board.
 *
 * Longer topics run past a screen, so a contents rail sits alongside on wide
 * displays. It is plain anchor links: no scroll-spy, nothing that moves by
 * itself while you are trying to read.
 */
export function TopicView({ topic }: { topic: GkTopic }) {
  const dateFmt = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' })

  const anchors: { id: string; label: string }[] = []
  if (topic.facts.length > 0) anchors.push({ id: 'facts', label: 'Facts to know' })
  for (const group of topic.points)
    anchors.push({ id: anchorId(group.heading), label: group.heading })
  if (topic.timeline.length > 0) anchors.push({ id: 'timeline', label: 'How it unfolded' })
  if (topic.issbAngle) anchors.push({ id: 'issb-angle', label: 'Discussing this at ISSB' })
  if (topic.coverage.length > 0) anchors.push({ id: 'coverage', label: 'Recent coverage' })
  if (topic.sources.length > 0) anchors.push({ id: 'sources', label: 'Sources' })

  let step = 0
  const next = () => ({ '--i': Math.min(step++, 10) }) as React.CSSProperties

  return (
    <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_14rem]">
      <article className="flex max-w-3xl flex-col gap-10">
        <header className="rise" style={next()}>
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
          {topic.titleUr && (
            <p dir="rtl" className="mt-2 text-lg text-ink-muted">
              {topic.titleUr}
            </p>
          )}
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">{topic.summaryEn}</p>
          <Meta topic={topic} />
        </header>

        {topic.facts.length > 0 && (
          <section id="facts" className="rise scroll-mt-28" style={next()}>
            <SectionHeading>Facts to know</SectionHeading>
            <dl className="mt-4 overflow-hidden rounded-card border border-line shadow-card">
              {topic.facts.map((fact, i) => (
                <div
                  key={`${fact.label}-${i}`}
                  className="flex flex-col gap-1 border-b border-line px-4 py-3 last:border-b-0 odd:bg-surface even:bg-sunk/60 sm:flex-row sm:gap-6"
                >
                  <dt className="shrink-0 text-sm text-ink-muted sm:w-48">{fact.label}</dt>
                  <dd className="m-0 text-sm font-medium text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {topic.points.map((group) => (
          <section
            key={group.heading}
            id={anchorId(group.heading)}
            className="rise scroll-mt-28"
            style={next()}
          >
            <SectionHeading>{group.heading}</SectionHeading>
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
          <section id="timeline" className="rise scroll-mt-28" style={next()}>
            <SectionHeading>How it unfolded</SectionHeading>
            <ol className="mt-5 flex flex-col">
              {topic.timeline.map((entry, i) => (
                <li key={i} className="flex gap-4 border-s-2 border-line ps-6 pb-6 last:pb-0">
                  <span
                    className="-ms-[1.9rem] mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-canvas bg-brand-600"
                    aria-hidden="true"
                  />
                  <div className="-ms-2">
                    <div className="font-display text-sm font-semibold text-ink">{entry.date}</div>
                    <p className="mt-1 leading-relaxed text-ink-muted">{entry.event}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {topic.issbAngle && (
          <Card
            id="issb-angle"
            className="rise scroll-mt-28 border-brass-200 bg-brass-50 dark:border-brass-700 dark:bg-brass-900/30"
            style={next()}
          >
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-brass-500" aria-hidden="true" />
              <h2 className="font-display text-lg font-semibold text-ink">
                Discussing this at ISSB
              </h2>
            </div>
            <p className="mt-3 leading-relaxed text-ink-muted">{topic.issbAngle}</p>
          </Card>
        )}

        {topic.coverage.length > 0 && (
          <section id="coverage" className="rise scroll-mt-28" style={next()}>
            <SectionHeading>Recent coverage</SectionHeading>
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
          <footer
            id="sources"
            className="rise scroll-mt-28 border-t border-line pt-6"
            style={next()}
          >
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
                The written sections were drafted from these sources by {topic.narrativeModel}.
                Check anything you plan to state as fact at a board.
              </p>
            )}
          </footer>
        )}
      </article>

      {anchors.length > 2 && (
        <aside className="hidden xl:block">
          <nav className="sticky top-28 flex flex-col gap-3" aria-label="On this page">
            <p className="text-xs font-semibold tracking-wide text-ink-muted">On this page</p>
            <ul className="flex flex-col border-s border-line">
              {anchors.map((a) => (
                <li key={a.id}>
                  <a
                    href={`#${a.id}`}
                    className="-ms-px block border-s-2 border-transparent py-1.5 ps-4 text-sm text-ink-muted transition-colors hover:border-brass-500 hover:text-ink"
                  >
                    {a.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-lg font-semibold text-ink">{children}</h2>
}

/** A line of counts, so the size of a topic is visible before scrolling it. */
function Meta({ topic }: { topic: GkTopic }) {
  const parts: string[] = []
  if (topic.facts.length) parts.push(`${topic.facts.length} facts`)
  if (topic.points.length) parts.push(`${topic.points.length} sections`)
  if (topic.timeline.length) parts.push(`${topic.timeline.length} dated events`)
  const bullets = topic.points.reduce((n, g) => n + g.bullets.length, 0)
  if (bullets) parts.push(`${bullets} points`)
  if (parts.length === 0) return null
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted">
      {parts.map((part, i) => (
        <span key={part} className="flex items-center gap-2">
          {i > 0 && <span className="h-0.5 w-0.5 rounded-full bg-line-strong" aria-hidden="true" />}
          {part}
        </span>
      ))}
    </div>
  )
}

function anchorId(heading: string): string {
  return (
    'h-' +
    heading
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  )
}
