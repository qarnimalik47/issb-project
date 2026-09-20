/**
 * Wikipedia adapter — free, no API key.
 *
 * Wikipedia prose is CC BY-SA, which carries a share-alike obligation, so its
 * text is NEVER stored as our published copy. It is used for three things
 * only: to resolve what a topic is actually called, to find its Wikidata id,
 * and as background handed to the narrative writer, which must produce
 * original wording. The link and licence are always recorded.
 */
import { getJson } from './http'

const REST = 'https://en.wikipedia.org/api/rest_v1'
const API = 'https://en.wikipedia.org/w/api.php'

export const WIKIPEDIA_LICENSE = 'CC BY-SA 4.0'

type SearchResponse = { query?: { search?: { title: string; snippet: string }[] } }

/** Resolve a free-text topic name to the article Wikipedia actually has. */
export async function searchArticle(query: string): Promise<string | null> {
  const url = `${API}?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=1&format=json&origin=*`
  const data = await getJson<SearchResponse>(url)
  return data?.query?.search?.[0]?.title ?? null
}

type SummaryResponse = {
  title?: string
  description?: string
  extract?: string
  wikibase_item?: string
  content_urls?: { desktop?: { page?: string } }
  type?: string
}

export type WikipediaSummary = {
  title: string
  description: string
  extract: string
  wikibaseId: string | null
  url: string
}

export async function fetchSummary(title: string): Promise<WikipediaSummary | null> {
  const url = `${REST}/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`
  const data = await getJson<SummaryResponse>(url)
  if (!data?.title) return null
  // A disambiguation page has no facts of its own.
  if (data.type === 'disambiguation') return null
  return {
    title: data.title,
    description: data.description ?? '',
    extract: data.extract ?? '',
    wikibaseId: data.wikibase_item ?? null,
    url:
      data.content_urls?.desktop?.page ??
      `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title.replace(/ /g, '_'))}`,
  }
}

type ExtractResponse = {
  query?: { pages?: Record<string, { extract?: string }> }
}

/**
 * Plain-text background for the narrative writer. Capped because the whole
 * point is a briefing, not a copy of the article, and a long prompt costs more
 * without making the bullets better.
 */
export async function fetchBackground(title: string, maxChars = 6000): Promise<string> {
  const url = `${API}?action=query&prop=extracts&explaintext=1&redirects=1&titles=${encodeURIComponent(title)}&format=json&origin=*`
  const data = await getJson<ExtractResponse>(url)
  const pages = data?.query?.pages ?? {}
  const first = Object.values(pages)[0]
  const text = first?.extract ?? ''
  return text.slice(0, maxChars)
}

type SectionsResponse = { parse?: { sections?: { line: string; toclevel: number }[] } }

/** Top-level section headings, used as a sanity check on coverage. */
export async function fetchSectionHeadings(title: string): Promise<string[]> {
  const url = `${API}?action=parse&prop=sections&page=${encodeURIComponent(title)}&format=json&origin=*`
  const data = await getJson<SectionsResponse>(url)
  return (data?.parse?.sections ?? [])
    .filter((s) => s.toclevel === 1)
    .map((s) => s.line)
    .filter(
      (line) =>
        !/^(references|external links|see also|notes|further reading|bibliography)$/i.test(line),
    )
    .slice(0, 12)
}
