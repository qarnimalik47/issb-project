import { getT } from '@/lib/i18n'
import { ForgotForm } from '@/components/auth/AuthForms'

export default async function ForgotPasswordPage() {
  const { t } = await getT()
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
        {t.auth.forgotTitle}
      </h1>
      <ForgotForm t={t} />
      <p className="text-center text-sm text-ink-muted">
        <a href="/login" className="underline">
          {t.common.signIn}
        </a>
      </p>
    </div>
  )
}
