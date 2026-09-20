import { listTopics } from '@/lib/gk/topics'
import { PageHeader } from '@/components/ui/PageHeader'
import { TopicGrid } from '@/components/gk/TopicGrid'

export const dynamic = 'force-dynamic'

export default async function GkTopicsPage() {
  const topics = await listTopics({ kind: 'gk' })
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="General knowledge"
        lede="The evergreen material a board expects you to have at your fingertips — Pakistan, its founders, its forces, and the world around it."
      />
      {topics.length === 0 ? (
        <p className="text-ink-muted">
          The library is empty. Run the seed to load the curated topics.
        </p>
      ) : (
        <TopicGrid topics={topics} basePath="/gk/topics" />
      )}
    </div>
  )
}
