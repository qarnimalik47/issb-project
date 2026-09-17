/**
 * PDF → per-page text extraction using pdf-parse, then MCQ extraction. Runs in
 * the background worker (never in a request). Reports per-page results so
 * failures are visible rather than silently swallowed (build prompt §4.6).
 */
import { PDFParse } from 'pdf-parse'
import { extractQuestions, type ExtractedQuestion } from './parse'

export type PageResult =
  | { page: number; ok: true; questions: ExtractedQuestion[]; textLength: number }
  | { page: number; ok: false; error: string }

export type ParseReport = {
  totalPages: number
  pages: PageResult[]
  questions: ExtractedQuestion[]
}

/** Extract text per page using pdf-parse v2's PDFParse class. */
async function extractPages(buffer: Buffer): Promise<string[]> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) })
  try {
    const result = await parser.getText()
    return result.pages
      .slice()
      .sort((a, b) => a.num - b.num)
      .map((p) => p.text)
  } finally {
    await parser.destroy()
  }
}

export async function parsePdf(buffer: Buffer): Promise<ParseReport> {
  const pages = await extractPages(buffer)
  const pageResults: PageResult[] = []
  const allQuestions: ExtractedQuestion[] = []

  pages.forEach((text, i) => {
    const page = i + 1
    try {
      const questions = extractQuestions(text, page)
      pageResults.push({ page, ok: true, questions, textLength: text.length })
      allQuestions.push(...questions)
    } catch (err) {
      pageResults.push({
        page,
        ok: false,
        error: err instanceof Error ? err.message : 'parse error',
      })
    }
  })

  return { totalPages: pages.length, pages: pageResults, questions: allQuestions }
}
