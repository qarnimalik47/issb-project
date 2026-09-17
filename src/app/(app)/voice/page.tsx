import { db } from '@/lib/db'
import { testTypes } from '@/lib/db/schema/content'
import { inArray } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

function Card({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <a
      href={href}
      className="rounded-lg border border-neutral-200 p-4 hover:border-neutral-400 dark:border-neutral-800"
    >
      <div className="font-medium">{title}</div>
      <div className="mt-1 text-sm text-neutral-500">{desc}</div>
    </a>
  )
}

export default async function VoiceHubPage() {
  const rows = await db
    .select()
    .from(testTypes)
    .where(inArray(testTypes.code, ['lecturette', 'gpe', 'group_discussion']))
  const byCode = new Map(rows.map((r) => [r.code, r]))
  const gpe = byCode.get('gpe')
  const gd = byCode.get('group_discussion')

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Voice & interview practice</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          title="Lecturette"
          desc="2 min prep, 2 min talk — feedback on structure, timing, fillers."
          href="/voice/lecturette"
        />
        <Card
          title="Mock interview"
          desc="Questions generated from your PIQ, with follow-ups."
          href="/interview"
        />
        <Card
          title="PIQ builder"
          desc="Fill your Personal Information Questionnaire."
          href="/piq"
        />
        {gpe && (
          <Card
            title="Group Planning Exercise"
            desc="Scenario + plan with rubric feedback."
            href={`/written/${gpe.id}?mode=typed`}
          />
        )}
        {gd && (
          <Card
            title="Group Discussion"
            desc="Topic banks & spoken practice."
            href={`/written/${gd.id}?mode=typed`}
          />
        )}
        <Card title="GTO outdoor tasks" desc="Explainers, principles & fitness plan." href="/gto" />
      </div>
    </div>
  )
}
