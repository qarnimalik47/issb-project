import type { GkTopic } from '@/lib/db/schema/gk'
import { Card } from '@/components/ui/Card'
import { sectionLabel } from './TopicView'

/** Topics grouped under their section heading, so the library reads as a
 *  syllabus rather than a flat list. */
export function TopicGrid({ topics, basePath }: { topics: GkTopic[]; basePath: string }) {
  const bySection = new Map<string, GkTopic[]>()
  for (const topic of topics) {
    const list = bySection.get(topic.section) ?? []
    list.push(topic)
    bySection.set(topic.section, list)
  }

  return (
    <div className="flex flex-col gap-10">
      {[...bySection.entries()].map(([section, list]) => (
        <section key={section} className="flex flex-col gap-4">
          <h2 className="font-display text-lg font-semibold text-ink">{sectionLabel(section)}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((topic) => (
              <a key={topic.id} href={`${basePath}/${topic.slug}`} className="group">
                <Card className="flex h-full flex-col gap-2 transition-colors group-hover:border-brand-300">
                  <h3 className="font-display leading-snug font-semibold text-ink">
                    {topic.titleEn}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-ink-muted">
                    {topic.summaryEn}
                  </p>
                  <p className="mt-auto pt-2 text-xs text-ink-muted">
                    {topic.facts.length > 0 && `${topic.facts.length} facts`}
                    {topic.facts.length > 0 && topic.points.length > 0 && ' · '}
                    {topic.points.length > 0 && `${topic.points.length} sections`}
                  </p>
                </Card>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
