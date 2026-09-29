import { getCurrentUser } from '@/lib/auth/session'
import { AdminWide } from '@/components/admin/AdminWide'
import { PlanningManager } from '@/components/admin/PlanningManager'

export const dynamic = 'force-dynamic'

export default async function AdminPlanningPage() {
  const user = await getCurrentUser()
  return (
    <AdminWide>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Military Planning (GPE)
          </h1>
          <p className="max-w-prose text-sm text-ink-muted">
            Each scenario is a briefing with an optional map. Candidates read it and write their own
            plan in 10 minutes. The problems and model plan are only for reviewers and the AI
            marker.
          </p>
        </div>
        <PlanningManager canDelete={user?.role === 'admin'} />
      </div>
    </AdminWide>
  )
}
