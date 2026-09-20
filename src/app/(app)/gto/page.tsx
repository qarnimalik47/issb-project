/**
 * GTO outdoor tasks — explainers, principles, common mistakes and a fitness
 * plan. These physical tasks CANNOT be simulated in an app; we say so plainly
 * (build prompt §4.3 / §7).
 */
export default function GtoPage() {
  const tasks = [
    {
      name: 'Progressive Group Task (PGT)',
      principle:
        'Cross obstacles as a team using given helping material; observe rules (colour bars, out-of-bounds).',
      mistake: 'Ignoring rules to finish faster; dominating instead of cooperating.',
    },
    {
      name: 'Half Group Task (HGT)',
      principle: 'Same as PGT with a smaller group — your individual contribution is more visible.',
      mistake: 'Going quiet; not offering workable ideas.',
    },
    {
      name: 'Individual Obstacles',
      principle:
        'Attempt as many of the 10 obstacles as possible in time; points scale with difficulty.',
      mistake: 'Poor time management; skipping high-value obstacles.',
    },
    {
      name: 'Command Task',
      principle:
        'As commander, solve an obstacle using subordinates; give clear, confident briefings.',
      mistake: 'Vague orders; not involving subordinates.',
    },
    {
      name: 'Final Group Task',
      principle: 'A final cooperative obstacle — maintain team spirit and stamina.',
      mistake: 'Fatigue-driven irritability; loss of coordination.',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        GTO outdoor tasks
      </h1>
      <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-700 dark:bg-amber-950">
        <strong>Important:</strong> Outdoor GTO tasks are physical and group-based. They{' '}
        <strong>cannot be practised inside an app</strong>. Use these explainers to understand the
        principles and common mistakes, and follow the fitness plan to prepare physically.
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map((t) => (
          <div key={t.name} className="rounded-lg border border-line p-4">
            <div className="font-medium">{t.name}</div>
            <p className="mt-1 text-sm text-ink-muted">
              <strong>Principle:</strong> {t.principle}
            </p>
            <p className="text-sm text-red-600">
              <strong>Common mistake:</strong> {t.mistake}
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-lg border border-line p-4">
        <h2 className="font-display font-semibold text-ink">
          4-week fitness plan (build up gradually)
        </h2>
        <ul className="mt-2 list-inside list-disc text-sm text-ink-muted">
          <li>Daily: 20–30 min run, building from 2km to 5km.</li>
          <li>Bodyweight: push-ups, sit-ups, chin-ups — 3 sets, progressive reps.</li>
          <li>Agility: shuttle runs, rope climb practice where available.</li>
          <li>Rest 1 day/week; sleep 7–8 hours; hydrate well.</li>
          <li>Consult a doctor before starting any new fitness regime.</li>
        </ul>
      </section>
    </div>
  )
}
