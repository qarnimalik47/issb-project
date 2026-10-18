import { listTopics } from '@/lib/gk/topics'
import { PageHeader } from '@/components/ui/PageHeader'
import { TopicLibrary, type LibraryTopic } from '@/components/gk/TopicLibrary'

export const dynamic = 'force-dynamic'

export default async function GkTopicsPage() {
  const topics = await listTopics({ kind: 'gk' })
  const items: LibraryTopic[] = topics.map((t) => ({
    id: t.id,
    slug: t.slug,
    title: t.titleEn,
    summary: t.summaryEn,
    section: t.section,
    facts: t.facts.length,
    sections: t.points.length,
    dated: t.timeline.length,
  }))

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="General knowledge"
        lede="The evergreen material a board expects you to have at your fingertips — the board itself, Pakistan, its founders, its forces, and the world around it."
      />
      {items.length === 0 ? (
        <p className="text-ink-muted">
          The library is empty. Run the seed to load the curated topics.
        </p>
      ) : (
        <TopicLibrary topics={items} basePath="/gk/topics" />
      )}
    </div>
  )
}
