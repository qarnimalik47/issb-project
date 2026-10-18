import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { countTopicsByKind, listTopics } from '@/lib/gk/topics'
import { sectionLabel } from '@/components/gk/sectionLabel'
import { dueCount } from '@/lib/gk/flashcards'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, Panel } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export const dynamic = 'force-dynamic'

export default async function GkPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const [counts, due, gkTopics, caTopics] = await Promise.all([
    countTopicsByKind(),
    dueCount(user.id),
    listTopics({ kind: 'gk' }),
    listTopics({ kind: 'current_affairs' }),
  ])

  /* The three largest sections of each library, so the cards say what is
     actually inside rather than only how much of it there is. */
  const topSections = (list: { section: string }[]) => {
    const counts = new Map<string, number>()
    for (const t of list) counts.set(t.section, (counts.get(t.section) ?? 0) + 1)
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([s]) => sectionLabel(s))
  }

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="General knowledge and current affairs"
        lede="Two libraries and one deck. The knowledge stays put; the affairs are refreshed as events move."
      />

      {due > 0 && (
        <Panel className="rise flex flex-wrap items-center justify-between gap-5">
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
        <Card className="rise lift flex flex-col gap-4" style={{ '--i': 1 } as React.CSSProperties}>
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-ink">General knowledge</h2>
            <Badge tone="green">{counts.gk} topics</Badge>
          </div>
          <p className="leading-relaxed text-ink-muted">
            The board itself, Pakistan, its founders, the armed forces, Islamic studies and the
            world. Each topic is a page of short points you can revise in a few minutes.
          </p>
          <p className="text-sm text-ink-muted">{topSections(gkTopics).join(' · ')}</p>
          <div className="mt-auto pt-1">
            <ButtonLink href="/gk/topics">Open the library</ButtonLink>
          </div>
        </Card>

        <Card className="rise lift flex flex-col gap-4" style={{ '--i': 2 } as React.CSSProperties}>
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-ink">Current affairs</h2>
            <Badge tone="brass">{counts.current_affairs} dossiers</Badge>
          </div>
          <p className="leading-relaxed text-ink-muted">
            Conflicts, diplomacy and the economy. Each dossier covers how it started, how it
            developed and where it stands, with every source listed.
          </p>
          <p className="text-sm text-ink-muted">{topSections(caTopics).join(' · ')}</p>
          <div className="mt-auto pt-1">
            <ButtonLink href="/gk/current-affairs">Open the dossiers</ButtonLink>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href="/gk/flashcards"
          className="rise lift rounded-card border border-line bg-surface p-5 shadow-card hover:border-brand-300"
          style={{ '--i': 3 } as React.CSSProperties}
        >
          <h3 className="font-display font-semibold text-ink">Flashcards</h3>
          <p className="mt-1.5 text-sm text-ink-muted">
            Every topic generates cards. {due > 0 ? `${due} due now.` : 'Nothing due right now.'}
          </p>
        </a>
        <a
          href="/gk/digest"
          className="rise lift rounded-card border border-line bg-surface p-5 shadow-card hover:border-brand-300"
          style={{ '--i': 4 } as React.CSSProperties}
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
