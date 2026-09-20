/**
 * Heuristic MCQ extraction from raw page text. Kept pure and dependency-free so
 * it is exhaustively unit-testable. Extraction is deliberately conservative and
 * assigns a confidence; EVERY item still requires human review before it goes
 * live (build prompt §4.6 / §2), so low-confidence output is flagged, never
 * silently dropped.
 */
import { createHash } from 'node:crypto'

export type ExtractedOption = { key: string; textEn: string }

export type ExtractedQuestion = {
  page: number
  stemEn: string
  options: ExtractedOption[]
  correctOption: string | null
  explanation: string | null
  contentHash: string
  confidence: number // 0..1
}

const OPTION_RE = /(?:^|\s)\(?([A-Da-d])[.)]\s+/g
// The letter must not run on into a word: without the lookahead, "Correct
// answer: (b)" matched "Correct a" and keyed the answer as A.
const ANSWER_RE =
  /(?:Ans(?:wer)?|Correct(?:\s+answer)?)\s*(?:is)?\s*[:.\-]?\s*\(?([A-Da-d])\)?(?![A-Za-z])/i
const QUESTION_SPLIT_RE = /(?:^|\n|\s)(\d{1,3})[.)]\s+/g

/**
 * Fresh instances for other modules (the HTML extractor). Never share the
 * constants above across modules: `g`-flagged regexes carry a mutable
 * `lastIndex`, and a shared instance leaks match state between callers.
 */
export const answerPattern = () => new RegExp(ANSWER_RE.source, ANSWER_RE.flags)
export const optionPattern = () => new RegExp(OPTION_RE.source, OPTION_RE.flags)

export function questionContentHash(stem: string, options: { textEn: string }[] = []): string {
  // Normalise each part independently so trailing/collapsed whitespace never
  // changes the hash — identical questions must dedup regardless of spacing.
  const norm = [stem, ...options.map((o) => o.textEn)]
    .map((s) => s.toLowerCase().replace(/\s+/g, ' ').trim())
    .join('|')
  return createHash('sha256').update(norm).digest('hex')
}

const contentHashOf = questionContentHash

/** Split a page's text into candidate question chunks by leading numbers. */
export function splitQuestions(pageText: string): string[] {
  const chunks: string[] = []
  const matches = [...pageText.matchAll(QUESTION_SPLIT_RE)]
  if (matches.length === 0) return pageText.trim() ? [pageText.trim()] : []
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i]!.index! + matches[i]![0]!.length
    const end = i + 1 < matches.length ? matches[i + 1]!.index! : pageText.length
    const chunk = pageText.slice(start, end).trim()
    if (chunk) chunks.push(chunk)
  }
  return chunks
}

/** Parse a single question chunk into structured fields. */
export function parseQuestionChunk(chunk: string, page: number): ExtractedQuestion {
  // Locate option markers.
  const markers: { key: string; index: number }[] = []
  for (const m of chunk.matchAll(OPTION_RE)) {
    markers.push({ key: m[1]!.toUpperCase(), index: m.index! })
  }

  let stemEn = chunk
  const options: ExtractedOption[] = []
  if (markers.length >= 2) {
    stemEn = chunk.slice(0, markers[0]!.index).trim()
    for (let i = 0; i < markers.length; i++) {
      const optStart = markers[i]!.index
      const optEnd = i + 1 < markers.length ? markers[i + 1]!.index : chunk.length
      const raw = chunk.slice(optStart, optEnd)
      const text = raw.replace(OPTION_RE, '').trim()
      // Strip a trailing answer annotation from the last option.
      options.push({ key: markers[i]!.key, textEn: text.replace(ANSWER_RE, '').trim() })
    }
  }

  const answerMatch = chunk.match(ANSWER_RE)
  const correctOption = answerMatch ? answerMatch[1]!.toUpperCase() : null

  // Confidence: needs a stem, >=2 options, and ideally an answer.
  let confidence = 0
  if (stemEn.length > 0) confidence += 0.3
  if (options.length >= 2) confidence += 0.4
  if (options.length >= 4) confidence += 0.1
  if (correctOption && options.some((o) => o.key === correctOption)) confidence += 0.2
  confidence = Math.min(1, Number(confidence.toFixed(2)))

  return {
    page,
    stemEn,
    options,
    correctOption,
    explanation: null,
    contentHash: contentHashOf(stemEn, options),
    confidence,
  }
}

/** Extract all questions from one page's text. */
export function extractQuestions(pageText: string, page: number): ExtractedQuestion[] {
  return splitQuestions(pageText)
    .map((chunk) => parseQuestionChunk(chunk, page))
    .filter((q) => q.stemEn.length > 3)
}
