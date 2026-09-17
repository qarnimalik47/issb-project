import { getT } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/auth/session'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const { t } = await getT()
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">
        {t.common.dashboard}
        {user ? ` — ${user.name}` : ''}
      </h1>

      {user && !user.emailVerifiedAt && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
          {t.profile.emailUnverified} —{' '}
          <a href="/verify" className="underline">
            {t.auth.verify}
          </a>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {['Verbal', 'Non-Verbal', 'Mechanical', 'GK'].map((name) => (
          <div
            key={name}
            className="rounded-lg border border-neutral-200 p-4 text-sm dark:border-neutral-800"
          >
            <div className="font-medium">{name}</div>
            <div className="mt-1 text-neutral-500">Practice tests arrive in Phase 3.</div>
          </div>
        ))}
      </div>
    </div>
  )
}
