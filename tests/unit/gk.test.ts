import { describe, it, expect } from 'vitest'
import { parseRss } from '../../src/lib/gk/articles'

describe('parseRss', () => {
  it('extracts items with titles and links', () => {
    const xml = `<?xml version="1.0"?><rss><channel>
      <item><title>First headline</title><link>https://ex.com/1</link><pubDate>Mon, 01 Sep 2026 10:00:00 GMT</pubDate></item>
      <item><title><![CDATA[Second & headline]]></title><link>https://ex.com/2</link></item>
    </channel></rss>`
    const items = parseRss(xml)
    expect(items).toHaveLength(2)
    expect(items[0]!.title).toBe('First headline')
    expect(items[0]!.link).toBe('https://ex.com/1')
    expect(items[1]!.title).toContain('Second')
  })

  it('handles Atom entries with href links', () => {
    const xml = `<feed><entry><title>Atom item</title><link href="https://ex.com/a"/></entry></feed>`
    const items = parseRss(xml)
    expect(items[0]!.title).toBe('Atom item')
    expect(items[0]!.link).toBe('https://ex.com/a')
  })

  it('returns empty for non-feed input', () => {
    expect(parseRss('<html><body>not a feed</body></html>')).toEqual([])
  })
})
