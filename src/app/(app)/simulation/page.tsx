import { db } from '@/lib/db'
import { testTypes } from '@/lib/db/schema/content'
import { inArray } from 'drizzle-orm'
import { getLocale } from '@/lib/i18n'
import { PSYCH_DAY_ORDER } from '@/lib/sim/config'

export const dynamic = 'force-dynamic'

export default async function SimulationPage() {
  const locale = await getLocale()
  const codes = PSYCH_DAY_ORDER.map((s) => s.code)
  const rows = await db.select().from(testTypes).where(inArray(testTypes.code, codes))
  const byCode = new Map(rows.map((r) => [r.code, r]))

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Full simulation — Psychologist day</h1>
      <p className="text-sm text-neutral-500">
        Take the full battery in the real order and timing. Afterwards, view your consolidated
        insights report.
      </p>
      <ol className="flex flex-col gap-2">
        {PSYCH_DAY_ORDER.map((step, i) => {
          const tt = byCode.get(step.code)
          if (!tt) return null
          const href =
            step.kind === 'objective' ? `/practice/${tt.id}` : `/written/${tt.id}?mode=typed`
          return (
            <li
              key={step.code}
              className="flex items-center justify-between rounded-md border border-neutral-200 p-3 dark:border-neutral-800"
            >
              <span>
                {i + 1}. {locale === 'ur' ? tt.nameUr : tt.nameEn}
              </span>
              <a
                href={href}
                className="rounded bg-neutral-900 px-3 py-1 text-sm text-white dark:bg-white dark:text-neutral-900"
              >
                Start
              </a>
            </li>
          )
        })}
      </ol>
      <a
        href="/insights"
        className="w-fit rounded-md border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-700"
      >
        View consolidated report
      </a>
    </div>
  )
}
