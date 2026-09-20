/**
 * A small RFC-4180 CSV reader for question imports. Hand-rolled to stay
 * dependency-lean; spreadsheets export exactly this dialect.
 *
 * Handles quoted fields containing commas, doubled quotes ("") and embedded
 * newlines; CRLF, LF and lone-CR line endings; a leading UTF-8 BOM (Excel adds
 * one); and a trailing newline. Each record carries the 1-based line it starts
 * on, so errors can point at the row the author sees in their editor even when
 * earlier fields span several lines.
 *
 * It never throws on malformed input: an unterminated quote is reported as an
 * error on the record where it began, and ragged rows are left for the caller
 * to report per row.
 */
export type CsvRecord = { line: number; fields: string[] }
export type CsvResult = { records: CsvRecord[]; errors: { line: number; message: string }[] }

export function parseCsv(input: string): CsvResult {
  const text = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input
  const records: CsvRecord[] = []
  const errors: CsvResult['errors'] = []

  let fields: string[] = []
  let field = ''
  let inQuotes = false
  let line = 1
  let recordLine = 1
  let fieldStarted = false
  let i = 0

  const endField = () => {
    fields.push(field)
    field = ''
    fieldStarted = false
  }
  const endRecord = () => {
    endField()
    // Skip blank lines entirely (a lone empty field).
    if (!(fields.length === 1 && fields[0] === '')) records.push({ line: recordLine, fields })
    fields = []
  }

  while (i < text.length) {
    const c = text[i]!
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i++
        continue
      }
      if (c === '\n' || (c === '\r' && text[i + 1] !== '\n')) line++
      field += c
      i++
      continue
    }

    if (c === '"' && !fieldStarted) {
      inQuotes = true
      fieldStarted = true
      i++
      continue
    }
    if (c === ',') {
      endField()
      i++
      continue
    }
    if (c === '\r' || c === '\n') {
      endRecord()
      i += c === '\r' && text[i + 1] === '\n' ? 2 : 1
      line++
      recordLine = line
      continue
    }
    field += c
    fieldStarted = true
    i++
  }

  if (inQuotes) {
    errors.push({ line: recordLine, message: 'A quoted field is never closed' })
    fields = []
    field = ''
  } else if (field !== '' || fields.length > 0 || fieldStarted) {
    endRecord()
  }
  return { records, errors }
}

/** Quote one value for CSV output (used to build the downloadable template). */
export function csvCell(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}
