import { listTopics } from '@/lib/gk/topics'
import { PageHeader } from '@/components/ui/PageHeader'
import { TopicLibrary, type LibraryTopic } from '@/components/gk/TopicLibrary'

export const dynamic = 'force-dynamic'

export default async function CurrentAffairsPage() {
  const topics = await listTopics({ kind: 'current_affairs' })
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
        title="Current affairs"
        lede="Dossiers on the events a board is likely to raise: how each one started, how it developed, and where it stands now."
      />
      {items.length === 0 ? (
        <p className="text-ink-muted">No dossiers yet. An editor adds them from the admin area.</p>
      ) : (
        <TopicLibrary topics={items} basePath="/gk/current-affairs" accent="brass" />
      )}
    </div>
  )
}
