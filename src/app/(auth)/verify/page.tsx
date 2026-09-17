import { redirect } from 'next/navigation'
import { getT } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/auth/session'
import { VerifyForm } from '@/components/auth/AuthForms'

export default async function VerifyPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.emailVerifiedAt) redirect('/dashboard')
  const { t } = await getT()
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">{t.auth.verifyTitle}</h1>
      <VerifyForm t={t} />
    </div>
  )
}
