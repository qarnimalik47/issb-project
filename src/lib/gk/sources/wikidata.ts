/**
 * Wikidata adapter — structured facts, free and without an API key.
 *
 * Wikidata is CC0: its statements carry no attribution or share-alike
 * obligation, which is why the hard facts on a topic page (dates, people,
 * places, participants) come from here rather than from article prose. We
 * still record it as a source so a candidate can check a claim.
 */
import { getJson } from './http'
import type { GkFact } from '../../db/schema/gk'

const ENTITY_DATA = 'https://www.wikidata.org/wiki/Special:EntityData'
const API = 'https://www.wikidata.org/w/api.php'

/**
 * Properties worth putting in front of an ISSB candidate, in the order they
 * should read on the page. Anything not listed here is ignored — a dump of
 * every statement would bury the few facts that matter.
 */
const PROPERTIES: { id: string; label: string }[] = [
  // What the subject is — present on almost every item, so it is worth having
  // when little else is.
  { id: 'P31', label: 'Type' },
  // People
  { id: 'P569', label: 'Born' },
  { id: 'P19', label: 'Place of birth' },
  { id: 'P570', label: 'Died' },
  { id: 'P20', label: 'Place of death' },
  { id: 'P27', label: 'Citizenship' },
  { id: 'P39', label: 'Position held' },
  { id: 'P106', label: 'Occupation' },
  { id: 'P69', label: 'Educated at' },
  { id: 'P22', label: 'Father' },
  { id: 'P25', label: 'Mother' },
  { id: 'P26', label: 'Spouse' },
  { id: 'P40', label: 'Children' },
  { id: 'P3373', label: 'Siblings' },
  { id: 'P166', label: 'Awards' },
  { id: 'P102', label: 'Political party' },
  // Events and conflicts
  { id: 'P580', label: 'Start date' },
  { id: 'P582', label: 'End date' },
  { id: 'P585', label: 'Date' },
  { id: 'P710', label: 'Participants' },
  { id: 'P276', label: 'Location' },
  { id: 'P361', label: 'Part of' },
  { id: 'P1120', label: 'Deaths' },
  { id: 'P1344', label: 'Participant of' },
  { id: 'P828', label: 'Cause' },
  { id: 'P1542', label: 'Effect' },
  { id: 'P1269', label: 'Facet of' },
  { id: 'P155', label: 'Preceded by' },
  { id: 'P156', label: 'Followed by' },
  // Places, states and organisations
  { id: 'P571', label: 'Founded' },
  { id: 'P36', label: 'Capital' },
  { id: 'P37', label: 'Official language' },
  { id: 'P38', label: 'Currency' },
  { id: 'P122', label: 'Form of government' },
  { id: 'P35', label: 'Head of state' },
  { id: 'P6', label: 'Head of government' },
  { id: 'P17', label: 'Country' },
  { id: 'P2046', label: 'Area' },
  { id: 'P1082', label: 'Population' },
]

/** How many values to keep for a property that repeats (children, awards…). */
const MAX_VALUES_PER_PROPERTY = 4

type TimeValue = { time: string; precision: number }
type QuantityValue = { amount: string }
type EntityIdValue = { id: string }
type MonolingualValue = { text: string }

type Snak = {
  snaktype: string
  datatype?: string
  datavalue?: {
    type: string
    value: string | TimeValue | QuantityValue | EntityIdValue | MonolingualValue
  }
}

type Claim = { mainsnak: Snak; rank: string }

type Entity = {
  labels?: Record<string, { value: string }>
  descriptions?: Record<string, { value: string }>
  claims?: Record<string, Claim[]>
  sitelinks?: Record<string, { title: string }>
}

type EntityDataResponse = { entities: Record<string, Entity> }

/** Format a Wikidata time value at whatever precision it was recorded. */
export function formatTime(value: TimeValue): string {
  // e.g. "+1876-12-25T00:00:00Z", precision 11 = day, 10 = month, 9 = year.
  const match = /^([+-])(\d{4,})-(\d{2})-(\d{2})/.exec(value.time)
  if (!match) return value.time
  const [, sign, yearRaw, monthRaw, dayRaw] = match
  const year = Number(yearRaw)
  const bce = sign === '-'
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const yearText = bce ? `${year} BCE` : String(year)
  if (value.precision <= 9 || monthRaw === '00') return yearText
  const month = months[Number(monthRaw) - 1] ?? ''
  if (value.precision === 10 || dayRaw === '00') return `${month} ${yearText}`.trim()
  return `${Number(dayRaw)} ${month} ${yearText}`.trim()
}

function isTime(v: unknown): v is TimeValue {
  return typeof v === 'object' && v !== null && 'time' in v
}
function isEntityId(v: unknown): v is EntityIdValue {
  return typeof v === 'object' && v !== null && 'id' in v
}
function isQuantity(v: unknown): v is QuantityValue {
  return typeof v === 'object' && v !== null && 'amount' in v
}
function isMonolingual(v: unknown): v is MonolingualValue {
  return typeof v === 'object' && v !== null && 'text' in v
}

export type WikidataEntity = {
  id: string
  label: string
  description: string
  facts: GkFact[]
}

/** Fetch one entity and reduce it to the facts worth showing. */
export async function fetchEntity(qid: string): Promise<WikidataEntity | null> {
  const data = await getJson<EntityDataResponse>(`${ENTITY_DATA}/${encodeURIComponent(qid)}.json`)
  const entity = data?.entities?.[qid]
  if (!entity) return null

  // Collect the referenced item ids first so their labels resolve in one call
  // rather than one request per value.
  const referenced = new Set<string>()
  for (const { id } of PROPERTIES) {
    for (const claim of preferred(entity.claims?.[id] ?? [])) {
      const value = claim.mainsnak.datavalue?.value
      if (isEntityId(value)) referenced.add(value.id)
    }
  }
  const labels = await fetchLabels([...referenced])

  const facts: GkFact[] = []
  for (const { id, label } of PROPERTIES) {
    const claims = preferred(entity.claims?.[id] ?? [])
    if (claims.length === 0) continue
    const values: string[] = []
    for (const claim of claims.slice(0, MAX_VALUES_PER_PROPERTY)) {
      const value = claim.mainsnak.datavalue?.value
      if (value === undefined) continue
      if (typeof value === 'string') values.push(value)
      else if (isTime(value)) values.push(formatTime(value))
      else if (isEntityId(value)) values.push(labels.get(value.id) ?? value.id)
      else if (isQuantity(value)) values.push(formatQuantity(value.amount))
      else if (isMonolingual(value)) values.push(value.text)
    }
    if (values.length > 0) facts.push({ label, value: values.join(', ') })
  }

  return {
    id: qid,
    label: entity.labels?.en?.value ?? qid,
    description: entity.descriptions?.en?.value ?? '',
    facts,
  }
}

/** Deprecated statements are noise; a preferred rank wins when one is set. */
function preferred(claims: Claim[]): Claim[] {
  const live = claims.filter((c) => c.rank !== 'deprecated' && c.mainsnak.snaktype === 'value')
  const best = live.filter((c) => c.rank === 'preferred')
  return best.length > 0 ? best : live
}

function formatQuantity(amount: string): string {
  const n = Number(amount.replace('+', ''))
  if (!Number.isFinite(n)) return amount
  return n.toLocaleString('en-GB')
}

type LabelResponse = { entities: Record<string, { labels?: Record<string, { value: string }> }> }

async function fetchLabels(ids: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>()
  // wbgetentities accepts at most 50 ids per call.
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50)
    if (batch.length === 0) continue
    const url = `${API}?action=wbgetentities&ids=${batch.join('|')}&props=labels&languages=en&format=json&origin=*`
    const data = await getJson<LabelResponse>(url)
    for (const [id, entity] of Object.entries(data?.entities ?? {})) {
      const label = entity.labels?.en?.value
      if (label) out.set(id, label)
    }
  }
  return out
}

export const WIKIDATA_LICENSE = 'CC0 1.0'

export function wikidataUrl(qid: string): string {
  return `https://www.wikidata.org/wiki/${qid}`
}
