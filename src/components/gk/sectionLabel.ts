/** Human-readable names for topic sections, shared by server and client views. */
const SECTION_LABELS: Record<string, string> = {
  pakistan: 'Pakistan',
  personalities: 'Personalities',
  defence: 'Defence',
  history: 'History',
  geography: 'Geography',
  islamic: 'Islamic studies',
  world: 'World',
  science: 'Science and technology',
  conflict: 'Conflicts and wars',
  diplomacy: 'Diplomacy',
  economy: 'Economy',
  organisations: 'Organisations',
}

export function sectionLabel(section: string): string {
  return SECTION_LABELS[section] ?? section
}
