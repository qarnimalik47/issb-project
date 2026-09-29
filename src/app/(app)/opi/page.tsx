import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getLocale } from '@/lib/i18n'
import { getOpiState } from '@/lib/opi/service'
import { TYPE_PROFILES } from '@/lib/opi/profiles'
import { PageHeader } from '@/components/ui/PageHeader'
import { OpiPlayer } from '@/components/opi/OpiPlayer'

export const dynamic = 'force-dynamic'

export default async function OpiPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const locale = await getLocale()
  const { history } = await getOpiState(user.id)

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Personality test (OPI)"
        lede="The board's psychologist uses a long self-report inventory to see who you are and whether you answer honestly. This practice version gives you your personality type, your five core traits and how they line up with officer-like qualities."
      />
      <OpiPlayer locale={locale} />
      {history.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-lg font-semibold text-ink">Your past results</h2>
          <ul className="flex flex-col divide-y divide-line rounded-card border border-line bg-surface">
            {history.map((h) => (
              <li key={h.id}>
                <a
                  href={`/opi/result/${h.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-sunk"
                >
                  <span className="font-medium text-ink">
                    {TYPE_PROFILES[h.code]?.name ?? h.code}{' '}
                    <span className="font-mono text-sm text-ink-muted">
                      {h.code}-{h.variant === 'Steady' ? 'S' : 'R'}
                    </span>
                  </span>
                  <span className="text-sm text-ink-muted">
                    {h.takenAt.toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
