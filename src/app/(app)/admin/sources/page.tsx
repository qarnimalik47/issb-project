import { getCurrentUser } from '@/lib/auth/session'
import { AdminWide } from '@/components/admin/AdminWide'
import { SourcesManager } from '@/components/admin/SourcesManager'

export const dynamic = 'force-dynamic'

export default async function SourcesPage() {
  const user = await getCurrentUser()
  return (
    <AdminWide>
      <div className="flex max-w-5xl flex-col gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Content sources
          </h1>
          <p className="text-sm text-ink-muted">
            Sites the question scraper may read from. Everything it finds lands in review — nothing
            is published automatically.
          </p>
        </div>
        {user?.role === 'admin' ? (
          <SourcesManager />
        ) : (
          <p className="text-sm text-ink-muted">Only administrators can manage sources.</p>
        )}
      </div>
    </AdminWide>
  )
}
