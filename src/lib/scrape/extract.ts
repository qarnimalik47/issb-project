/**
 * Pull MCQs out of a fetched HTML page. DOM-first: prep sites put options in
 * <ol>/<ul>/<table> markup, and that grouping is unrecoverable from a flat text
 * dump. Pages with no recognisable structure fall back to the same text
 * heuristics the PDF importer uses.
 *
 * Every item carries a confidence, with scrape-specific penalties for site
 * furniture, links and oversized options, and a hard cap when the question
 * depends on a figure (third-party figures are never downloaded, so such an
 * item is unanswerable as extracted). Low-confidence items are still returned
 * — nothing is silently dropped; a human reviews everything.
 *
 * Pure: HTML in, items out. No network, no DB — re-running extraction after
 * tuning these heuristics costs zero requests.
 */
import * as cheerio from 'cheerio'
import { answerPattern, extractQuestions } from '../import/parse'

export type ScrapedItem = {
  stemEn: string
  options: { key: string; textEn: string }[]
  correctOption: string | null
  explanation: string | null
  confidence: number
  hasFigure: boolean
}

export type Extraction = {
  items: ScrapedItem[]
  /** Set when the page is a login/paywall interstitial; nothing is staged. */
  interstitial: string | null
}

const STRIP =
  'script,style,noscript,template,nav,header,footer,aside,form,iframe,svg,button,[role=navigation],[aria-hidden=true]'
const LETTERS = 'ABCDEFGH'
const OPTION_PREFIX = /^\s*\(?([A-Ha-h])\s*[.):\]]\s*/
const QUESTION_NUMBER = /^\s*(?:Q(?:uestion)?\s*)?\d{1,3}\s*[.):-]\s*/i
const URL_IN_TEXT = /(https?:\/\/|www\.)\S+/i
const FURNITURE =
  /\b(click here|read more|share (this|on)|comments?|advertisement|sponsored|download (the )?app)\b/i
const EXPLANATION = /explanation\s*[:.-]\s*([\s\S]+)/i
const INTERSTITIALS = [
  'sign in to continue',
  'log in to continue',
  'login to continue',
  'login to view',
  'log in to view',
  'subscribe to view',
  'subscribe to continue',
  'subscribe to unlock',
  'members only',
  'premium members',
  'create a free account to',
]

const clean = (s: string) => s.replace(/\s+/g, ' ').trim()

function score(q: Omit<ScrapedItem, 'confidence'>): ScrapedItem {
  let c = 0
  if (q.stemEn) c += 0.3
  if (q.options.length >= 2) c += 0.4
  if (q.options.length >= 4) c += 0.1
  if (q.correctOption && q.options.some((o) => o.key === q.correctOption)) c += 0.2
  if (URL_IN_TEXT.test(q.stemEn)) c -= 0.3
  if (FURNITURE.test(q.stemEn)) c -= 0.3
  if (q.options.some((o) => o.textEn.length > 200)) c -= 0.2
  if (q.stemEn.length < 10) c -= 0.2
  if (q.hasFigure) c = Math.min(c, 0.4)
  return { ...q, confidence: Math.max(0, Math.min(1, Math.round(c * 100) / 100)) }
}

type $ = cheerio.CheerioAPI
type Node = Parameters<$>[0]

/** The nearest earlier sibling that has text — usually the question stem. */
function stemElementBefore($: $, el: Node) {
  let prev = $(el).prev()
  while (prev.length) {
    if (clean(prev.text())) return prev
    prev = prev.prev()
  }
  return null
}

/** Text of up to `n` following siblings — where "Answer: C" callouts live. */
function textAfter($: $, el: Node, n: number): string {
  const parts: string[] = []
  let next = $(el).next()
  for (let i = 0; i < n && next.length; i++) {
    parts.push(next.text())
    next = next.next()
  }
  return clean(parts.join(' \n '))
}

function optionsFrom(texts: string[]) {
  // Honour explicit letters ("(c) Lahore") when every option has one.
  const explicit = texts.map((t) => OPTION_PREFIX.exec(t)?.[1]?.toUpperCase() ?? null)
  const useExplicit = explicit.every(Boolean) && new Set(explicit).size === explicit.length
  return texts.map((t, i) => ({
    key: useExplicit ? explicit[i]! : LETTERS[i]!,
    textEn: clean(t.replace(OPTION_PREFIX, '')),
  }))
}

function answerIn(text: string): string | null {
  return answerPattern().exec(text)?.[1]?.toUpperCase() ?? null
}

function fromLists($: $): ScrapedItem[] {
  const items: ScrapedItem[] = []
  $('ol, ul').each((_, list) => {
    const lis = $(list).children('li')
    if (lis.length < 2 || lis.length > LETTERS.length) return
    const texts = lis.map((_, li) => clean($(li).text())).get()
    if (texts.some((t) => !t || t.length > 300)) return
    const stemEl = stemElementBefore($, list)
    if (!stemEl) return
    const stemEn = clean(stemEl.text()).replace(QUESTION_NUMBER, '')
    if (stemEn.length < 5) return

    const options = optionsFrom(texts)
    let correctOption: string | null = null
    lis.each((i, li) => {
      const marker = `${$(li).attr('class') ?? ''} ${$(li).attr('data-correct') ?? ''}`
      if (/\b(correct|right-answer)\b|true/i.test(marker)) correctOption = options[i]!.key
    })
    const after = textAfter($, list, 3)
    correctOption ??= answerIn(after)
    const explanation = EXPLANATION.exec(after)?.[1]?.trim() ?? null
    const hasFigure =
      stemEl.find('img').length > 0 ||
      $(list).find('img').length > 0 ||
      stemEl.is('img, figure') ||
      stemEl.prev().is('img, figure')

    items.push(score({ stemEn, options, correctOption, explanation, hasFigure }))
  })
  return items
}

/** Tables whose rows are "A | option text". */
function fromTables($: $): ScrapedItem[] {
  const items: ScrapedItem[] = []
  $('table').each((_, table) => {
    const rows = $(table)
      .find('tr')
      .map((_, tr) => [
        $(tr)
          .children('td,th')
          .map((_, td) => clean($(td).text()))
          .get(),
      ])
      .get() as string[][]
    const optionRows = rows.filter((r) => r.length >= 2 && /^\(?[A-Ha-h][.)]?$/.test(r[0]!))
    if (optionRows.length < 2) return
    const stemEl = stemElementBefore($, table) ?? $(table).find('caption')
    const stemEn = stemEl ? clean(stemEl.text()).replace(QUESTION_NUMBER, '') : ''
    if (stemEn.length < 5) return
    const options = optionRows.map((r) => ({
      key: r[0]!.replace(/[^A-Ha-h]/g, '').toUpperCase(),
      textEn: r.slice(1).join(' '),
    }))
    const after = textAfter($, table, 3)
    items.push(
      score({
        stemEn,
        options,
        correctOption: answerIn(after),
        explanation: EXPLANATION.exec(after)?.[1]?.trim() ?? null,
        hasFigure: $(table).find('img').length > 0,
      }),
    )
  })
  return items
}

/** Block-aware plain text, for the heuristic fallback. */
function blockText($: $): string {
  $('br').replaceWith('\n')
  $('p, div, li, h1, h2, h3, h4, h5, h6, tr, section, article').each((_, el) => {
    $(el).append('\n')
  })
  return $('body')
    .text()
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
}

export function extractFromHtml(html: string): Extraction {
  const $ = cheerio.load(html)
  $(STRIP).remove()
  const bodyText = clean($('body').text()).toLowerCase()

  let items = [...fromLists($), ...fromTables($)]
  if (items.length === 0) {
    items = extractQuestions(blockText($), 1).map((q) =>
      score({
        stemEn: q.stemEn,
        options: q.options,
        correctOption: q.correctOption,
        explanation: q.explanation,
        hasFigure: false,
      }),
    )
  }

  // A login or paywall page may still contain a teaser question or two; if
  // that is all there is, skip the page rather than stage the teaser.
  const interstitial =
    items.length < 2 ? (INTERSTITIALS.find((p) => bodyText.includes(p)) ?? null) : null
  return { items: interstitial ? [] : items, interstitial }
}
