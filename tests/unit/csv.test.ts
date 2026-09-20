import { describe, it, expect } from 'vitest'
import { parseCsv, csvCell } from '../../src/lib/import/csv'

const fields = (text: string) => parseCsv(text).records.map((r) => r.fields)

describe('parseCsv', () => {
  it('reads simple rows', () => {
    expect(fields('a,b,c\n1,2,3\n')).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ])
  })

  it('keeps commas and doubled quotes inside quoted fields', () => {
    expect(fields('"Lahore, Punjab","He said ""go"""')).toEqual([
      ['Lahore, Punjab', 'He said "go"'],
    ])
  })

  it('keeps newlines inside quoted fields and reports the starting line of each record', () => {
    const r = parseCsv('h1,h2\n"line one\nline two",x\nlast,y')
    expect(r.records.map((x) => x.fields)).toEqual([
      ['h1', 'h2'],
      ['line one\nline two', 'x'],
      ['last', 'y'],
    ])
    expect(r.records.map((x) => x.line)).toEqual([1, 2, 4])
  })

  it('handles CRLF, lone CR and a missing trailing newline', () => {
    expect(fields('a,b\r\nc,d\re,f')).toEqual([
      ['a', 'b'],
      ['c', 'd'],
      ['e', 'f'],
    ])
  })

  it('strips a UTF-8 BOM and keeps Urdu text intact', () => {
    const bom = String.fromCharCode(0xfeff)
    expect(fields(`${bom}stem_ur\nپاکستان کا دارالحکومت`)).toEqual([
      ['stem_ur'],
      ['پاکستان کا دارالحکومت'],
    ])
  })

  it('skips blank lines but keeps empty fields', () => {
    expect(fields('a,,c\n\n,b,\n')).toEqual([
      ['a', '', 'c'],
      ['', 'b', ''],
    ])
  })

  it('returns ragged rows as-is for the caller to report', () => {
    expect(fields('a,b,c\n1,2\n1,2,3,4')).toEqual([
      ['a', 'b', 'c'],
      ['1', '2'],
      ['1', '2', '3', '4'],
    ])
  })

  it('reports an unterminated quote instead of throwing', () => {
    const r = parseCsv('a,b\n"never closed,x\ny,z')
    expect(r.records.map((x) => x.fields)).toEqual([['a', 'b']])
    expect(r.errors).toEqual([{ line: 2, message: 'A quoted field is never closed' }])
  })

  it('reads an empty file as no records', () => {
    expect(parseCsv('')).toEqual({ records: [], errors: [] })
  })
})

describe('csvCell', () => {
  it('quotes only when needed and round-trips', () => {
    expect(csvCell('plain')).toBe('plain')
    const tricky = 'a, "b"\nc'
    expect(fields(csvCell(tricky))).toEqual([[tricky]])
  })
})
