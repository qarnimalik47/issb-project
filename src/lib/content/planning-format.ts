/**
 * How a Group Planning Exercise is laid out inside a `questions` row.
 *
 * There is no dedicated column for a scenario's parts, so they are packed into
 * the fields a written item already has — and unpacked again for the admin
 * editor. Build and parse live side by side so the two cannot drift:
 *
 *   stem_en         title ¶ briefing ¶ standing instruction
 *   stem_ur         the same, in Urdu (optional)
 *   explanation_en  problems ¶ model plan ¶ closing note — for reviewers
 *   media_id        the map / model-room sketch (optional)
 *
 * The seeded scenarios (seed-data/gpe-items.ts) and the ones an admin writes
 * go through the same functions, so both kinds edit the same way.
 */

export type PlanningParts = {
  titleEn: string
  titleUr?: string | null
  /** The narrative the GTO reads out: situation, resources, clock. */
  narrativeEn: string
  narrativeUr?: string | null
  /** The simultaneous problems, for the reviewer. */
  problems: string[]
  /** One defensible priority order, with reasons. */
  modelPlan: string[]
}

/** The instruction is identical in every exercise, so it lives here once. */
export const PLANNING_TASK_EN =
  'Write your own plan. List the problems in the order you would deal with them, say who goes where and with what, and give your reason for that order. Do not add resources that are not mentioned above.'

export const PLANNING_TASK_UR =
  'اپنا منصوبہ تحریر کریں۔ مسائل کو اُسی ترتیب سے لکھیں جس ترتیب سے آپ اُنہیں حل کریں گے، بتائیں کہ کون کہاں اور کن وسائل کے ساتھ جائے گا، اور اپنی ترتیب کی وجہ بیان کریں۔ اوپر بیان کیے گئے وسائل کے علاوہ کوئی نیا وسیلہ فرض نہ کریں۔'

const PROBLEMS_HEAD = 'Problems present in the narrative:'
const PLAN_HEAD = 'One defensible plan:'
const CLOSING =
  'This is one workable order, not the only one. A plan that reaches the same ends in a different order, with reasons given, is equally good.'

/** Paragraph breaks inside a narrative collapse to single newlines so ¶ stays a separator. */
function tidy(text: string): string {
  return text
    .trim()
    .replace(/\r\n?/g, '\n')
    .replace(/\n{2,}/g, '\n')
}

export function planningStemEn(p: Pick<PlanningParts, 'titleEn' | 'narrativeEn'>): string {
  return [p.titleEn.trim(), tidy(p.narrativeEn), PLANNING_TASK_EN].join('\n\n')
}

/** Null when there is no Urdu narrative: half a translation is worse than none. */
export function planningStemUr(p: Pick<PlanningParts, 'titleUr' | 'narrativeUr'>): string | null {
  if (!p.narrativeUr?.trim()) return null
  return [(p.titleUr ?? '').trim(), tidy(p.narrativeUr), PLANNING_TASK_UR].join('\n\n')
}

export function planningExplanation(p: Pick<PlanningParts, 'problems' | 'modelPlan'>): string {
  const list = (xs: string[]) =>
    xs
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x, i) => `${i + 1}. ${x}`)
      .join('\n')
  return [
    `${PROBLEMS_HEAD}\n${list(p.problems)}`,
    `${PLAN_HEAD}\n${list(p.modelPlan)}`,
    CLOSING,
  ].join('\n\n')
}

/** Split a stem back into title and narrative. Tolerates a stem with no standing instruction. */
function splitStem(stem: string | null | undefined, task: string) {
  if (!stem?.trim()) return { title: '', narrative: '' }
  const parts = stem.replace(/\r\n?/g, '\n').split('\n\n')
  if (parts.length > 1 && parts[parts.length - 1]!.trim() === task) parts.pop()
  // Older sample items are a single paragraph with no title: it is all briefing.
  if (parts.length === 1) return { title: '', narrative: parts[0]!.trim() }
  const [title = '', ...rest] = parts
  return { title: title.trim(), narrative: rest.join('\n').trim() }
}

function numbered(block: string | undefined): string[] {
  if (!block) return []
  return block
    .split('\n')
    .map((l) => l.replace(/^\s*\d+[.)]\s*/, '').trim())
    .filter(Boolean)
}

export function parsePlanning(row: {
  stemEn: string
  stemUr: string | null
  explanationEn: string | null
}): PlanningParts {
  const en = splitStem(row.stemEn, PLANNING_TASK_EN)
  const ur = splitStem(row.stemUr, PLANNING_TASK_UR)
  const expl = (row.explanationEn ?? '').replace(/\r\n?/g, '\n')
  const section = (head: string) => {
    const start = expl.indexOf(head)
    if (start < 0) return undefined
    const body = expl.slice(start + head.length)
    const end = body.indexOf('\n\n')
    return end < 0 ? body : body.slice(0, end)
  }
  return {
    titleEn: en.title,
    narrativeEn: en.narrative,
    titleUr: ur.title || null,
    narrativeUr: ur.narrative || null,
    problems: numbered(section(PROBLEMS_HEAD)),
    modelPlan: numbered(section(PLAN_HEAD)),
  }
}
