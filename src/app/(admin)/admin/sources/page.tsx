import { getCurrentUser } from '@/lib/auth/session'
import { ScreenHeader } from '@/components/admin/ui/Primitives'
import { SourcesManager } from '@/components/admin/SourcesManager'

export const dynamic = 'force-dynamic'

export default async function SourcesPage() {
  const user = await getCurrentUser()
  return (
    <div className="max-w-5xl">
      <ScreenHeader
        title="Content sources"
        lede="Sites the question scraper may read from. Everything it finds lands in review — nothing is published automatically."
      />
      {user?.role === 'admin' ? (
        <SourcesManager />
      ) : (
        <p className="text-sm text-ink-muted">Only administrators can manage sources.</p>
      )}
    </div>
  )
}
