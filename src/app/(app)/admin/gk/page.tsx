import { GkDrafts } from '@/components/admin/GkDrafts'

export default function AdminGkPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Current affairs — editorial review</h1>
      <p className="text-sm text-neutral-500">
        Refine each draft into an original summary and ISSB angle, then approve. Nothing publishes
        automatically.
      </p>
      <GkDrafts />
    </div>
  )
}
