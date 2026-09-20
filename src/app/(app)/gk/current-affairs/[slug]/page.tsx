import { notFound } from 'next/navigation'
import { getTopicBySlug } from '@/lib/gk/topics'
import { TopicView } from '@/components/gk/TopicView'

export const dynamic = 'force-dynamic'

export default async function CurrentAffairsTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const topic = await getTopicBySlug('current_affairs', slug)
  if (!topic || topic.status !== 'published') notFound()
  return (
    <div className="flex flex-col gap-6">
      <a
        href="/gk/current-affairs"
        className="text-sm text-ink-muted underline underline-offset-4 hover:text-ink"
      >
        Back to current affairs
      </a>
      <TopicView topic={topic} />
    </div>
  )
}
