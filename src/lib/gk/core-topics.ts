/**
 * The current-affairs topics worth having in the library for an ISSB
 * candidate, used by `npm run gk:gather:core`.
 *
 * Chosen for what a board actually raises: the conflicts a candidate will be
 * asked to comment on, the organisations Pakistan belongs to, the agreements
 * that define its neighbourhood, and the economic bodies whose decisions reach
 * the front page. Each entry is the name the encyclopedia uses, because that
 * is what the search resolves against.
 */
export type CoreTopic = { query: string; section: string }

/** Subjects the curated GK library already covers in more depth — Kashmir,
 *  CPEC, the Indus Waters Treaty, the economy — are deliberately absent. */
export const CORE_CURRENT_AFFAIRS: CoreTopic[] = [
  // Conflicts a candidate will be asked to discuss
  { query: 'Iran–Israel conflict', section: 'conflict' },
  { query: 'Gaza war', section: 'conflict' },
  { query: 'Russian invasion of Ukraine', section: 'conflict' },
  { query: 'War in Afghanistan (2001–2021)', section: 'conflict' },
  { query: 'Insurgency in Balochistan', section: 'conflict' },
  { query: 'South China Sea disputes', section: 'conflict' },
  { query: 'Syrian civil war', section: 'conflict' },

  // Pakistan
  { query: 'Gwadar Port', section: 'pakistan' },
  { query: 'Line of Control', section: 'pakistan' },
  { query: 'Durand Line', section: 'pakistan' },
  { query: '2022 Pakistan floods', section: 'pakistan' },

  // Diplomacy and blocs
  { query: 'Shanghai Cooperation Organisation', section: 'organisations' },
  { query: 'Organisation of Islamic Cooperation', section: 'organisations' },
  { query: 'South Asian Association for Regional Cooperation', section: 'organisations' },
  { query: 'United Nations Security Council', section: 'organisations' },
  { query: 'North Atlantic Treaty Organization', section: 'organisations' },
  { query: 'BRICS', section: 'organisations' },
  { query: 'Belt and Road Initiative', section: 'diplomacy' },
  { query: 'Economic Cooperation Organization', section: 'organisations' },

  // Economy and global systems
  { query: 'International Monetary Fund', section: 'economy' },
  { query: 'World Trade Organization', section: 'economy' },
  { query: 'Financial Action Task Force', section: 'economy' },
  { query: 'OPEC', section: 'economy' },
  { query: 'Sustainable Development Goals', section: 'economy' },

  // Strategic geography and defence
  { query: 'Strait of Hormuz', section: 'defence' },
  { query: 'Strait of Malacca', section: 'defence' },
  { query: 'Siachen conflict', section: 'defence' },
  { query: 'Nuclear proliferation', section: 'defence' },
  { query: 'Climate change', section: 'diplomacy' },
]
