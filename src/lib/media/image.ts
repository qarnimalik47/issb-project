/**
 * Identify an uploaded image from its bytes — never from its filename or the
 * browser-supplied type, both of which the uploader controls.
 *
 * Only PNG, JPEG and WebP are recognised. SVG is refused on purpose: it is
 * XML that can carry script, and served from our own origin it is a stored-XSS
 * vector. GIF is refused because no figure needs animation. Dimensions are
 * read from the headers so the player can reserve the figure's space before it
 * loads. Hand-rolled because the project is deliberately dependency-lean; any
 * malformed or truncated input yields null rather than throwing.
 */
export type SniffedImage = {
  mime: 'image/png' | 'image/jpeg' | 'image/webp'
  ext: 'png' | 'jpg' | 'webp'
  width: number
  height: number
}

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

function startsWith(buf: Uint8Array, bytes: number[], offset = 0): boolean {
  if (buf.length < offset + bytes.length) return false
  return bytes.every((b, i) => buf[offset + i] === b)
}

function ascii(buf: Uint8Array, offset: number, length: number): string {
  if (buf.length < offset + length) return ''
  return String.fromCharCode(...buf.subarray(offset, offset + length))
}

function sniffPng(buf: Uint8Array): SniffedImage | null {
  // Signature, then the IHDR chunk: length(4) "IHDR"(4) width(4) height(4).
  if (buf.length < 24 || ascii(buf, 12, 4) !== 'IHDR') return null
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
  return {
    mime: 'image/png',
    ext: 'png',
    width: view.getUint32(16),
    height: view.getUint32(20),
  }
}

/** Walk JPEG segments to the first start-of-frame marker, which carries the size. */
function sniffJpeg(buf: Uint8Array): SniffedImage | null {
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
  let i = 2
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) {
      i++
      continue
    }
    const marker = buf[i + 1]!
    // Fill bytes and markers without a length field.
    if (marker === 0xff) {
      i++
      continue
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2
      continue
    }
    const length = view.getUint16(i + 2)
    if (length < 2) return null
    // SOF0–SOF15, excluding DHT (C4), JPG (C8) and DAC (CC).
    const isSof = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)
    if (isSof) {
      return {
        mime: 'image/jpeg',
        ext: 'jpg',
        height: view.getUint16(i + 5),
        width: view.getUint16(i + 7),
      }
    }
    i += 2 + length
  }
  return null
}

function sniffWebp(buf: Uint8Array): SniffedImage | null {
  if (buf.length < 30) return null
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
  const chunk = ascii(buf, 12, 4)
  const result = (width: number, height: number): SniffedImage => ({
    mime: 'image/webp',
    ext: 'webp',
    width,
    height,
  })
  if (chunk === 'VP8 ') {
    // Lossy: 3-byte frame tag, start code 9D 01 2A, then 14-bit dimensions.
    if (!startsWith(buf, [0x9d, 0x01, 0x2a], 23)) return null
    return result(view.getUint16(26, true) & 0x3fff, view.getUint16(28, true) & 0x3fff)
  }
  if (chunk === 'VP8L') {
    // Lossless: signature byte 0x2F, then width-1 and height-1 as 14-bit fields.
    if (buf[20] !== 0x2f) return null
    const bits = view.getUint32(21, true)
    return result((bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1)
  }
  if (chunk === 'VP8X') {
    // Extended: 24-bit little-endian canvas width-1 and height-1.
    const w = buf[24]! | (buf[25]! << 8) | (buf[26]! << 16)
    const h = buf[27]! | (buf[28]! << 8) | (buf[29]! << 16)
    return result(w + 1, h + 1)
  }
  return null
}

export function sniffImage(input: Uint8Array): SniffedImage | null {
  try {
    let found: SniffedImage | null = null
    if (startsWith(input, PNG_SIGNATURE)) found = sniffPng(input)
    else if (startsWith(input, [0xff, 0xd8, 0xff])) found = sniffJpeg(input)
    else if (ascii(input, 0, 4) === 'RIFF' && ascii(input, 8, 4) === 'WEBP')
      found = sniffWebp(input)
    if (!found || found.width <= 0 || found.height <= 0) return null
    return found
  } catch {
    return null
  }
}
