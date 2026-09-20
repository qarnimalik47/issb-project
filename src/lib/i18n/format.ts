/**
 * Minimal placeholder interpolation for dictionary strings.
 *
 * Several exam strings are parameterised ("Question {n} / {total}"), and Urdu
 * word order differs from English, so the values cannot simply be concatenated
 * around a fixed English skeleton the way the rest of the app does it.
 *
 * An unknown placeholder is left verbatim rather than blanked: a visible
 * `{total}` in the UI is an obvious bug, whereas a silently empty string looks
 * like real (but wrong) content.
 */
export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  )
}
