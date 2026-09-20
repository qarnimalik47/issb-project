import { redirect } from 'next/navigation'
import { getT } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/auth/session'
import { LoginForm } from '@/components/auth/AuthForms'

export default async function LoginPage() {
  if (await getCurrentUser()) redirect('/dashboard')
  const { t } = await getT()
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
        {t.auth.loginTitle}
      </h1>
      <LoginForm t={t} />
      <p className="text-center text-sm text-ink-muted">
        {t.auth.noAccount}{' '}
        <a href="/register" className="underline">
          {t.common.register}
        </a>
      </p>
    </div>
  )
}
