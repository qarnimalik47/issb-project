import { redirect } from 'next/navigation'
import { getT } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/auth/session'
import { toPublicUser } from '@/lib/auth/serialize'
import { ProfilePanel } from '@/components/ProfilePanel'

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const { t } = await getT()
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{t.profile.title}</h1>
      <ProfilePanel t={t} user={toPublicUser(user)} />
    </div>
  )
}
