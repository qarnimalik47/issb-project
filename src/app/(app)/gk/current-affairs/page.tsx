import { listTopics } from '@/lib/gk/topics'
import { PageHeader } from '@/components/ui/PageHeader'
import { TopicGrid } from '@/components/gk/TopicGrid'

export const dynamic = 'force-dynamic'

export default async function CurrentAffairsPage() {
  const topics = await listTopics({ kind: 'current_affairs' })
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Current affairs"
        lede="Dossiers on the events a board is likely to raise: how each one started, how it developed, and where it stands now."
      />
      {topics.length === 0 ? (
        <p className="text-ink-muted">No dossiers yet. An editor adds them from the admin area.</p>
      ) : (
        <TopicGrid topics={topics} basePath="/gk/current-affairs" />
      )}
    </div>
  )
}
