import { describe, it, expect } from 'vitest'
import { sniffImage } from '../../src/lib/media/image'

function png(width: number, height: number): Uint8Array {
  const b = new Uint8Array(33)
  b.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0)
  b.set([0, 0, 0, 13], 8)
  b.set(
    [...'IHDR'].map((c) => c.charCodeAt(0)),
    12,
  )
  const v = new DataView(b.buffer)
  v.setUint32(16, width)
  v.setUint32(20, height)
  return b
}

function jpeg(width: number, height: number): Uint8Array {
  // SOI, an APP0 segment (length 16) to walk past, then SOF0 with the size.
  const b = new Uint8Array(2 + 18 + 19)
  b.set([0xff, 0xd8], 0)
  b.set([0xff, 0xe0, 0x00, 0x10], 2)
  const sof = 2 + 18
  b.set([0xff, 0xc0, 0x00, 0x11, 0x08], sof)
  const v = new DataView(b.buffer)
  v.setUint16(sof + 5, height)
  v.setUint16(sof + 7, width)
  return b
}

function riff(chunk: string, body: number[]): Uint8Array {
  const b = new Uint8Array(40)
  b.set(
    [...'RIFF'].map((c) => c.charCodeAt(0)),
    0,
  )
  b.set(
    [...'WEBP'].map((c) => c.charCodeAt(0)),
    8,
  )
  b.set(
    [...chunk].map((c) => c.charCodeAt(0)),
    12,
  )
  b.set(body, 20)
  return b
}

describe('sniffImage', () => {
  it('reads PNG dimensions', () => {
    expect(sniffImage(png(640, 480))).toEqual({
      mime: 'image/png',
      ext: 'png',
      width: 640,
      height: 480,
    })
  })

  it('walks JPEG segments to the frame header', () => {
    expect(sniffImage(jpeg(800, 600))).toMatchObject({
      mime: 'image/jpeg',
      width: 800,
      height: 600,
    })
  })

  it('reads lossy, lossless and extended WebP', () => {
    // VP8: tag(3) + start code, then 14-bit LE width/height (300×200).
    const lossy = riff('VP8 ', [
      0,
      0,
      0,
      0x9d,
      0x01,
      0x2a,
      300 & 0xff,
      300 >> 8,
      200 & 0xff,
      200 >> 8,
    ])
    expect(sniffImage(lossy)).toMatchObject({ mime: 'image/webp', width: 300, height: 200 })

    // VP8L: 0x2F then (w-1) | (h-1) << 14 as LE bits → 100×50.
    const bits = 99 | (49 << 14)
    const lossless = riff('VP8L', [
      0x2f,
      bits & 0xff,
      (bits >> 8) & 0xff,
      (bits >> 16) & 0xff,
      bits >>> 24,
    ])
    expect(sniffImage(lossless)).toMatchObject({ width: 100, height: 50 })

    // VP8X: flags(4) then 24-bit LE (w-1), (h-1) → 1024×768.
    const ext = riff('VP8X', [0, 0, 0, 0, 1023 & 0xff, 1023 >> 8, 0, 767 & 0xff, 767 >> 8, 0])
    expect(sniffImage(ext)).toMatchObject({ width: 1024, height: 768 })
  })

  it('refuses SVG — it can carry script and would run on our origin', () => {
    const svg = new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"><script/></svg>')
    expect(sniffImage(svg)).toBeNull()
  })

  it('refuses GIF', () => {
    expect(sniffImage(new TextEncoder().encode('GIF89a\u0001\u0000\u0001\u0000'))).toBeNull()
  })

  it('returns null for truncated input instead of throwing', () => {
    expect(sniffImage(png(10, 10).subarray(0, 20))).toBeNull()
    expect(sniffImage(jpeg(10, 10).subarray(0, 12))).toBeNull()
    expect(sniffImage(new Uint8Array([0x52, 0x49, 0x46, 0x46]))).toBeNull()
    expect(sniffImage(new Uint8Array())).toBeNull()
  })

  it('rejects zero-sized images', () => {
    expect(sniffImage(png(0, 10))).toBeNull()
  })
})
