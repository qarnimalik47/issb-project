import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { countTopicsByKind } from '@/lib/gk/topics'
import { dueCount } from '@/lib/gk/flashcards'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, Panel } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export const dynamic = 'force-dynamic'

export default async function GkPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const [counts, due] = await Promise.all([countTopicsByKind(), dueCount(user.id)])

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="General knowledge and current affairs"
        lede="Two libraries and one deck. The knowledge stays put; the affairs are refreshed as events move."
      />

      {due > 0 && (
        <Panel className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-brass-400" aria-hidden="true" />
              <span className="text-sm font-medium text-brand-200">Revision</span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold text-white">
              {due} {due === 1 ? 'card is' : 'cards are'} due today
            </h2>
            <p className="mt-2 text-brand-100">
              Spaced repetition puts a card back in front of you just before you would forget it.
            </p>
          </div>
          <ButtonLink href="/gk/flashcards" variant="brass" size="lg">
            Start revision
          </ButtonLink>
        </Panel>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-ink">General knowledge</h2>
            <Badge tone="neutral">{counts.gk} topics</Badge>
          </div>
          <p className="leading-relaxed text-ink-muted">
            Pakistan, its founders, the armed forces, geography and world basics. Each topic is a
            page of short points you can revise in a few minutes.
          </p>
          <div className="mt-auto pt-1">
            <ButtonLink href="/gk/topics">Open the library</ButtonLink>
          </div>
        </Card>

        <Card className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-ink">Current affairs</h2>
            <Badge tone="neutral">{counts.current_affairs} dossiers</Badge>
          </div>
          <p className="leading-relaxed text-ink-muted">
            Conflicts, diplomacy and the economy. Each dossier covers how it started, how it
            developed and where it stands, with every source listed.
          </p>
          <div className="mt-auto pt-1">
            <ButtonLink href="/gk/current-affairs">Open the dossiers</ButtonLink>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href="/gk/flashcards"
          className="rounded-card border border-line bg-surface p-5 transition-colors hover:border-brand-300"
        >
          <h3 className="font-display font-semibold text-ink">Flashcards</h3>
          <p className="mt-1.5 text-sm text-ink-muted">
            Every topic generates cards. {due > 0 ? `${due} due now.` : 'Nothing due right now.'}
          </p>
        </a>
        <a
          href="/gk/digest"
          className="rounded-card border border-line bg-surface p-5 transition-colors hover:border-brand-300"
        >
          <h3 className="font-display font-semibold text-ink">Daily digest</h3>
          <p className="mt-1.5 text-sm text-ink-muted">
            Approved headlines with an ISSB angle on each.
          </p>
        </a>
      </div>
    </div>
  )
}
