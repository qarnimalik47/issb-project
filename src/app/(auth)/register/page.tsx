import { redirect } from 'next/navigation'
import { getT } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/auth/session'
import { RegisterForm } from '@/components/auth/AuthForms'

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect('/dashboard')
  const { t } = await getT()
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
        {t.auth.registerTitle}
      </h1>
      <RegisterForm t={t} />
      <p className="text-center text-sm text-ink-muted">
        {t.auth.haveAccount}{' '}
        <a href="/login" className="underline">
          {t.common.signIn}
        </a>
      </p>
    </div>
  )
}
