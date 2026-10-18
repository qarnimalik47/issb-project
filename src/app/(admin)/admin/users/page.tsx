import type { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth/session'
import { UsersManager } from '@/components/admin/UsersManager'

export const metadata: Metadata = { title: 'Users · Admin' }
export const dynamic = 'force-dynamic'

export default async function Page() {
  // Passed down so the drawer can withhold the actions an admin must not take
  // against their own account; the API refuses them regardless.
  const user = await getCurrentUser()
  return <UsersManager currentUserId={user?.id ?? ''} />
}
