import { GkDrafts } from '@/components/admin/GkDrafts'
import { GatherTopicPanel } from '@/components/admin/GatherTopicPanel'
import { PageHeader } from '@/components/ui/PageHeader'

export default function AdminGkPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="General knowledge and current affairs"
        lede="Gather a dossier from the free knowledge sources, or review the headlines waiting for approval."
      />
      <GatherTopicPanel />
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Headlines awaiting review</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Refine each draft into an original summary and ISSB angle, then approve. Nothing
            publishes automatically.
          </p>
        </div>
        <GkDrafts />
      </section>
    </div>
  )
}
