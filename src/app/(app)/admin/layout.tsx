import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'

/** Admin area guard: only content editors and admins may enter. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'content_editor') redirect('/dashboard')
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 border-b border-neutral-200 pb-3 text-sm dark:border-neutral-800">
        <span className="font-semibold">Admin</span>
        <a
          href="/admin/import"
          className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          PDF Import
        </a>
        <a
          href="/admin/gk"
          className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          Current Affairs
        </a>
      </div>
      {children}
    </div>
  )
}
