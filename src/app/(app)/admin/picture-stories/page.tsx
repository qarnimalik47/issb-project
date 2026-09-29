import { getCurrentUser } from '@/lib/auth/session'
import { AdminWide } from '@/components/admin/AdminWide'
import { PictureStoryManager } from '@/components/admin/PictureStoryManager'

export const dynamic = 'force-dynamic'

export default async function AdminPictureStoriesPage() {
  const user = await getCurrentUser()
  return (
    <AdminWide>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Picture Story (TAT)
          </h1>
          <p className="max-w-prose text-sm text-ink-muted">
            Candidates see each picture for 30 seconds, then write a story in 3½ minutes with it
            hidden. Publishing a picture adds it to the next numbered Picture Story test.
          </p>
        </div>
        <PictureStoryManager canDelete={user?.role === 'admin'} />
      </div>
    </AdminWide>
  )
}
