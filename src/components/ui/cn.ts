/** Join conditional class names. Last-wins merging is deliberately not done —
 *  variants below are written so they never collide on the same property. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
