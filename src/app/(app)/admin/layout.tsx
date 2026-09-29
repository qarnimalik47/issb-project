import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'

/** Admin area guard: only content editors and admins may enter. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'content_editor') redirect('/dashboard')
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line pb-3 text-sm">
        <span className="font-semibold">Admin</span>
        <a href="/admin" className="text-ink-muted hover:text-ink dark:hover:text-white">
          Dashboard
        </a>
        <a href="/admin/questions" className="text-ink-muted hover:text-ink dark:hover:text-white">
          Questions
        </a>
        <a
          href="/admin/questions/import"
          className="text-ink-muted hover:text-ink dark:hover:text-white"
        >
          Bulk import
        </a>
        <a
          href="/admin/picture-stories"
          className="text-ink-muted hover:text-ink dark:hover:text-white"
        >
          Picture Story
        </a>
        <a href="/admin/planning" className="text-ink-muted hover:text-ink dark:hover:text-white">
          Military Planning
        </a>
        <a href="/admin/import" className="text-ink-muted hover:text-ink dark:hover:text-white">
          PDF Import
        </a>
        <a href="/admin/sources" className="text-ink-muted hover:text-ink dark:hover:text-white">
          Sources
        </a>
        <a href="/admin/gk" className="text-ink-muted hover:text-ink dark:hover:text-white">
          Current Affairs
        </a>
      </div>
      {children}
    </div>
  )
}
