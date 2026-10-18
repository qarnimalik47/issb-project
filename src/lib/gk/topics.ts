/**
 * Topic pages: the GK library (curated, seeded once) and current-affairs
 * dossiers (gathered from free sources on demand).
 *
 * A gather is idempotent by slug: asking for the same topic again refreshes
 * the same row instead of creating a second copy, which is what keeps one
 * topic's information in one place for every user.
 */
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { db } from '../db/index'
import {
  flashcards,
  gkArticles,
  gkTopics,
  type GkCoverage,
  type GkFact,
  type GkSource,
  type GkTopic,
} from '../db/schema/gk'
import { childLogger } from '../logger/index'
import { fetchEntity, wikidataUrl, WIKIDATA_LICENSE } from './sources/wikidata'
import {
  fetchBackground,
  fetchSectionHeadings,
  fetchSummary,
  searchArticle,
  WIKIPEDIA_LICENSE,
} from './sources/wikipedia'
import { writeNarrative } from './narrative'

const log = childLogger('gk-topics')

export type TopicKind = 'gk' | 'current_affairs'

/** Sections a topic can belong to, per kind. Used for grouping and filters. */
export const GK_SECTIONS = [
  'pakistan',
  'personalities',
  'defence',
  'history',
  'geography',
  'islamic',
  'world',
  'science',
] as const

export const CURRENT_AFFAIRS_SECTIONS = [
  'conflict',
  'pakistan',
  'diplomacy',
  'economy',
  'organisations',
  'defence',
] as const

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

// --- Reading ----------------------------------------------------------------

export async function listTopics(opts: {
  kind: TopicKind
  section?: string
  q?: string
  limit?: number
}): Promise<GkTopic[]> {
  const conds = [eq(gkTopics.kind, opts.kind), eq(gkTopics.status, 'published')]
  if (opts.section) conds.push(eq(gkTopics.section, opts.section))
  if (opts.q) {
    const like = `%${opts.q}%`
    conds.push(or(ilike(gkTopics.titleEn, like), ilike(gkTopics.summaryEn, like))!)
  }
  return db
    .select()
    .from(gkTopics)
    .where(and(...conds))
    .orderBy(gkTopics.section, gkTopics.titleEn)
    .limit(opts.limit ?? 200)
}

export async function getTopicBySlug(kind: TopicKind, slug: string): Promise<GkTopic | null> {
  const [row] = await db
    .select()
    .from(gkTopics)
    .where(and(eq(gkTopics.kind, kind), eq(gkTopics.slug, slug)))
    .limit(1)
  return row ?? null
}

export async function countTopicsByKind(): Promise<Record<TopicKind, number>> {
  const rows = await db
    .select({ kind: gkTopics.kind, count: sql<number>`count(*)`.mapWith(Number) })
    .from(gkTopics)
    .where(eq(gkTopics.status, 'published'))
    .groupBy(gkTopics.kind)
  const out: Record<TopicKind, number> = { gk: 0, current_affairs: 0 }
  for (const r of rows) out[r.kind] = r.count
  return out
}

// --- Gathering --------------------------------------------------------------

export type GatherResult = {
  topic: GkTopic
  usedNarrative: boolean
  cardsCreated: number
}

/**
 * Build or refresh a current-affairs dossier from the free sources.
 *
 * Order matters: Wikipedia resolves what the topic is actually called and
 * which Wikidata item it maps to, Wikidata supplies the facts (CC0, so they
 * can be shown as-is), and the narrative is written from scratch against both.
 * Any single source failing degrades the result rather than the request.
 */
export async function gatherTopic(opts: {
  query: string
  kind?: TopicKind
  section: string
}): Promise<GatherResult> {
  const kind: TopicKind = opts.kind ?? 'current_affairs'
  const title = (await searchArticle(opts.query)) ?? opts.query
  const summary = await fetchSummary(title)
  if (!summary) {
    throw new Error(
      `No encyclopedia article matched "${opts.query}". Try the full name of the event, person or organisation.`,
    )
  }

  const sources: GkSource[] = []
  const retrievedAt = new Date().toISOString()
  sources.push({
    name: 'Wikipedia',
    url: summary.url,
    license: WIKIPEDIA_LICENSE,
    retrievedAt,
  })

  let facts: GkFact[] = []
  if (summary.wikibaseId) {
    const entity = await fetchEntity(summary.wikibaseId)
    if (entity) {
      facts = entity.facts
      sources.push({
        name: 'Wikidata',
        url: wikidataUrl(summary.wikibaseId),
        license: WIKIDATA_LICENSE,
        retrievedAt,
      })
    }
  }

  const existingKeywords =
    (await getTopicBySlug(kind, slugify(summary.title)))?.coverageKeywords ?? []

  const [background, sectionHeadings, coverage] = await Promise.all([
    fetchBackground(summary.title),
    fetchSectionHeadings(summary.title),
    findCoverage(summary.title, existingKeywords),
  ])

  const narrative = await writeNarrative({
    title: summary.title,
    description: summary.description,
    facts,
    background: background || summary.extract,
    sectionHeadings,
    headlines: coverage.map((c) => c.headline),
  })

  const slug = slugify(summary.title)

  /* If this topic was written by hand, a gather refreshes its facts, sources
     and coverage and leaves the writing alone. Losing an afternoon's editorial
     work to a routine refresh is not a trade worth making. */
  const existing = await getTopicBySlug(kind, slug)
  const curated = existing?.origin === 'curated'

  const values = {
    kind,
    slug,
    titleEn: summary.title,
    section: opts.section,
    // Without a provider the description is all we can honestly say; the facts
    // and timeline below carry the substance.
    summaryEn: curated
      ? existing.summaryEn
      : (narrative?.summary ?? summary.description ?? summary.title),
    issbAngle: curated ? existing.issbAngle : (narrative?.issbAngle ?? null),
    facts: curated && facts.length === 0 ? existing.facts : facts,
    points: curated ? existing.points : (narrative?.points ?? []),
    timeline: curated ? existing.timeline : (narrative?.timeline ?? []),
    // Curated topics keep their own citations and gain the gathered ones.
    sources: curated ? mergeSources(existing.sources, sources) : sources,
    coverage,
    origin: curated ? 'curated' : 'gathered',
    narrativeModel: curated ? existing.narrativeModel : (narrative?.model ?? null),
    status: 'published' as const,
    lastGatheredAt: new Date(),
    updatedAt: new Date(),
  }

  const [topic] = await db
    .insert(gkTopics)
    .values(values)
    .onConflictDoUpdate({ target: [gkTopics.kind, gkTopics.slug], set: values })
    .returning()

  if (!topic) throw new Error('Failed to save the topic')

  const cardsCreated = await rebuildTopicFlashcards(topic)
  log.info(
    { slug, facts: facts.length, narrative: Boolean(narrative), cardsCreated },
    'topic gathered',
  )
  return { topic, usedNarrative: Boolean(narrative), cardsCreated }
}

/** Existing citations first, then any gathered one not already listed. */
function mergeSources(existing: GkSource[], gathered: GkSource[]): GkSource[] {
  const seen = new Set(existing.map((s) => s.url))
  return [...existing, ...gathered.filter((s) => !seen.has(s.url))]
}

/**
 * Published headlines already in the digest that mention this topic.
 *
 * Headline and link only — the body of a news article is never stored or
 * shown. Matching is deliberately simple: the distinctive words of the title
 * against the headline text. A title like "The war in Gaza" has exactly one
 * word worth searching on, so stopwords are dropped before anything else.
 */
const STOPWORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'from',
  'that',
  'this',
  'under',
  'after',
  'into',
  'war',
  'wars',
  'crisis',
  'conflict',
  'relations',
  'affairs',
  'issue',
])

export function coverageKeywords(title: string): string[] {
  const words = title
    .split(/[\s—–\-(),]+/)
    .map((w) => w.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w.toLowerCase()))
  const unique = [...new Set(words)]
  return unique.length > 0 ? unique.slice(0, 4) : [title]
}

async function findCoverage(title: string, extra: string[] = []): Promise<GkCoverage[]> {
  /* Explicit keywords replace the title-derived ones rather than adding to
     them. A dossier that names its own terms has done so precisely because the
     title is too broad — appending "Pakistan" back in would undo that. */
  const keywords = (extra.length > 0 ? extra : coverageKeywords(title)).slice(0, 5)
  if (keywords.length === 0) return []
  const matches = keywords.map((k) => ilike(gkArticles.headline, `%${k}%`))

  /* Pull a wide candidate set and rank it here rather than taking whatever the
     database returns first. Matching any single keyword is too loose — a topic
     keyed on "Iran, Israel" otherwise picks up any story mentioning Israel,
     however irrelevant. Earlier keywords are the more specific ones, so they
     weigh more, and a headline matching two keywords outranks one matching a
     single common word. */
  const rows = await db
    .select({
      headline: gkArticles.headline,
      url: gkArticles.sourceUrl,
      sourceName: gkArticles.sourceName,
      date: gkArticles.publishedDate,
    })
    .from(gkArticles)
    .where(and(eq(gkArticles.status, 'published'), or(...matches)!))
    .orderBy(desc(gkArticles.publishedDate))
    .limit(40)

  const scored = rows
    .filter((r) => r.url)
    .map((r) => {
      const headline = r.headline.toLowerCase()
      let score = 0
      keywords.forEach((k, i) => {
        if (headline.includes(k.toLowerCase())) score += keywords.length - i
      })
      return { row: r, score }
    })
    .sort((a, b) => b.score - a.score || (b.row.date ?? '').localeCompare(a.row.date ?? ''))

  return scored.slice(0, 6).map(({ row }) => ({
    headline: row.headline,
    url: row.url!,
    sourceName: row.sourceName ?? 'Source',
    date: row.date ?? undefined,
  }))
}

/**
 * Re-attach recent coverage to every published topic.
 *
 * Run after ingesting feeds: the dossiers are written once but the headlines
 * beneath them should move with the news, and recomputing is far cheaper than
 * re-gathering every topic from the sources.
 */
export async function refreshAllCoverage(): Promise<{ updated: number; withCoverage: number }> {
  const rows = await db
    .select({
      id: gkTopics.id,
      titleEn: gkTopics.titleEn,
      keywords: gkTopics.coverageKeywords,
    })
    .from(gkTopics)
    .where(eq(gkTopics.status, 'published'))

  let withCoverage = 0
  for (const row of rows) {
    const coverage = await findCoverage(row.titleEn, row.keywords ?? [])
    if (coverage.length > 0) withCoverage++
    await db.update(gkTopics).set({ coverage }).where(eq(gkTopics.id, row.id))
  }
  return { updated: rows.length, withCoverage }
}

// --- Flashcards -------------------------------------------------------------

const MAX_CARDS_PER_TOPIC = 14

/**
 * Regenerate a topic's cards from its facts and timeline.
 *
 * Only facts make good cards: they have one short, checkable answer. Narrative
 * bullets do not — "Origin: a long rivalry since 1979" has no single right
 * answer to grade yourself against, so it stays on the page and out of the
 * deck. Existing cards for the topic are replaced, which also removes the
 * per-user SM-2 state for them; that is the honest behaviour when the
 * underlying fact may have changed.
 */
export async function rebuildTopicFlashcards(topic: GkTopic): Promise<number> {
  await db.delete(flashcards).where(eq(flashcards.topicId, topic.id))

  const deck = topic.kind === 'gk' ? 'General knowledge' : 'Current affairs'
  const rows: (typeof flashcards.$inferInsert)[] = []

  for (const fact of topic.facts) {
    if (rows.length >= MAX_CARDS_PER_TOPIC) break
    if (fact.value.length > 120) continue
    rows.push({
      deck,
      frontEn: `${topic.titleEn} — ${fact.label.toLowerCase()}?`,
      backEn: fact.value,
      topic: topic.section,
      topicId: topic.id,
      status: 'published',
    })
  }

  for (const entry of topic.timeline) {
    if (rows.length >= MAX_CARDS_PER_TOPIC) break
    rows.push({
      deck,
      frontEn: `${topic.titleEn} — what happened in ${entry.date}?`,
      backEn: entry.event,
      topic: topic.section,
      topicId: topic.id,
      status: 'published',
    })
  }

  if (rows.length === 0) return 0
  await db.insert(flashcards).values(rows)
  return rows.length
}

// --- Curated topics ---------------------------------------------------------

export type CuratedTopic = {
  slug: string
  kind: TopicKind
  section: string
  titleEn: string
  titleUr?: string
  summaryEn: string
  summaryUr?: string
  issbAngle?: string
  facts?: GkFact[]
  points?: { heading: string; bullets: string[] }[]
  timeline?: { date: string; event: string }[]
  sources?: GkSource[]
  /** Words to match news headlines on, when the title is too generic. */
  coverageKeywords?: string[]
}

/**
 * Insert or refresh a hand-written topic. Used by the seed so the GK library
 * ships with the platform rather than waiting on a gather.
 */
export async function upsertCuratedTopic(topic: CuratedTopic): Promise<GkTopic> {
  /* Hand-written topics and gathered ones can describe the same subject. When
     they do, the writing wins and the gathered facts, sources and coverage are
     kept — a dossier written by hand should not lose its structured data just
     because the seed ran again. */
  const existing = await getTopicBySlug(topic.kind, topic.slug)

  const values = {
    kind: topic.kind,
    slug: topic.slug,
    titleEn: topic.titleEn,
    titleUr: topic.titleUr ?? null,
    section: topic.section,
    summaryEn: topic.summaryEn,
    summaryUr: topic.summaryUr ?? null,
    issbAngle: topic.issbAngle ?? null,
    facts: topic.facts ?? existing?.facts ?? [],
    points: topic.points ?? [],
    timeline: topic.timeline ?? [],
    sources: mergeSources(topic.sources ?? [], existing?.sources ?? []),
    coverage: existing?.coverage ?? [],
    coverageKeywords: topic.coverageKeywords ?? existing?.coverageKeywords ?? [],
    origin: 'curated',
    narrativeModel: null,
    status: 'published' as const,
    updatedAt: new Date(),
  }
  const [row] = await db
    .insert(gkTopics)
    .values(values)
    .onConflictDoUpdate({ target: [gkTopics.kind, gkTopics.slug], set: values })
    .returning()
  if (!row) throw new Error(`Failed to upsert topic ${topic.slug}`)
  return row
}
