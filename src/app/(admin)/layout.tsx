import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getT } from '@/lib/i18n'
import { env } from '@/lib/env'
import { SignOutButton } from '@/components/SignOutButton'
import { AdminShell } from '@/components/admin/shell/AdminShell'

/**
 * Admin area root.
 *
 * It sits in its own route group rather than inside the candidate shell: the
 * operator's tools want the full width of a desktop screen and a different
 * navigation model, and nesting them in the student layout meant every table
 * fought a reading column sized for prose.
 *
 * This is also the authorisation boundary — default deny, with content editors
 * admitted to the content screens only (the nav model filters what they see,
 * and each route re-checks its own role).
 */
export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'content_editor') redirect('/dashboard')
  const { t } = await getT()

  return (
    <AdminShell
      role={user.role}
      userName={user.name}
      userEmail={user.email}
      appEnv={env.APP_ENV}
      signOut={
        <SignOutButton
          label={t.common.signOut}
          className="text-xs font-medium text-brand-300 hover:text-brass-300 disabled:opacity-55"
        />
      }
    >
      {children}
    </AdminShell>
  )
}
