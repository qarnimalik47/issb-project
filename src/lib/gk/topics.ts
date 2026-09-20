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

  const [background, sectionHeadings, coverage] = await Promise.all([
    fetchBackground(summary.title),
    fetchSectionHeadings(summary.title),
    findCoverage(summary.title),
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
  const values = {
    kind,
    slug,
    titleEn: summary.title,
    section: opts.section,
    // Without a provider the description is all we can honestly say; the facts
    // and timeline below carry the substance.
    summaryEn: narrative?.summary ?? summary.description ?? summary.title,
    issbAngle: narrative?.issbAngle ?? null,
    facts,
    points: narrative?.points ?? [],
    timeline: narrative?.timeline ?? [],
    sources,
    coverage,
    origin: 'gathered',
    narrativeModel: narrative?.model ?? null,
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

/**
 * Published headlines already in the digest that mention this topic. Headline
 * and link only — the body of a news article is never stored or shown.
 */
async function findCoverage(title: string): Promise<GkCoverage[]> {
  const keyword = title.split(/[\s—–-]+/).find((w) => w.length > 4) ?? title
  const rows = await db
    .select({
      headline: gkArticles.headline,
      url: gkArticles.sourceUrl,
      sourceName: gkArticles.sourceName,
      date: gkArticles.publishedDate,
    })
    .from(gkArticles)
    .where(and(eq(gkArticles.status, 'published'), ilike(gkArticles.headline, `%${keyword}%`)))
    .orderBy(desc(gkArticles.publishedDate))
    .limit(6)
  return rows
    .filter((r) => r.url)
    .map((r) => ({
      headline: r.headline,
      url: r.url!,
      sourceName: r.sourceName ?? 'Source',
      date: r.date ?? undefined,
    }))
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
}

/**
 * Insert or refresh a hand-written topic. Used by the seed so the GK library
 * ships with the platform rather than waiting on a gather.
 */
export async function upsertCuratedTopic(topic: CuratedTopic): Promise<GkTopic> {
  const values = {
    kind: topic.kind,
    slug: topic.slug,
    titleEn: topic.titleEn,
    titleUr: topic.titleUr ?? null,
    section: topic.section,
    summaryEn: topic.summaryEn,
    summaryUr: topic.summaryUr ?? null,
    issbAngle: topic.issbAngle ?? null,
    facts: topic.facts ?? [],
    points: topic.points ?? [],
    timeline: topic.timeline ?? [],
    sources: topic.sources ?? [],
    coverage: [],
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
