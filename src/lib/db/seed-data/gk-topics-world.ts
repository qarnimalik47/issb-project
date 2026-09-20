/**
 * World affairs, organisations and general knowledge.
 *
 * Deliberately excludes anything that changes with an election or a
 * appointment — current office holders belong in the gathered current-affairs
 * library, which is refreshed, not in a seed file that ages silently.
 */
import type { CuratedTopic } from '../../gk/topics'

export const WORLD_TOPICS: CuratedTopic[] = [
  {
    slug: 'the-united-nations',
    kind: 'gk',
    section: 'world',
    titleEn: 'The United Nations',
    titleUr: 'اقوامِ متحدہ',
    summaryEn:
      "The principal international organisation, its six organs and the specialised agencies most often asked about — together with Pakistan's long record as a contributor of peacekeepers.",
    issbAngle:
      "Pakistan's peacekeeping record is the detail worth having ready: it is one of the largest troop contributors in the organisation's history, which is a concrete answer to what the country contributes internationally.",
    facts: [
      { label: 'Founded', value: '24 October 1945' },
      { label: 'Headquarters', value: 'New York' },
      { label: 'Members', value: '193' },
      { label: 'Pakistan joined', value: '30 September 1947' },
      { label: 'Principal organs', value: 'Six' },
      { label: 'Security Council members', value: '15 — five permanent, ten elected' },
      { label: 'Permanent members', value: 'United States, United Kingdom, France, Russia, China' },
      { label: 'International Court of Justice', value: 'The Hague' },
      { label: 'Official languages', value: 'Arabic, Chinese, English, French, Russian, Spanish' },
      { label: 'UN Day', value: '24 October' },
    ],
    points: [
      {
        heading: 'The six organs',
        bullets: [
          'General Assembly — every member has one vote.',
          'Security Council — responsible for international peace and security; its permanent members hold a veto.',
          'Economic and Social Council.',
          'Trusteeship Council — suspended since 1994, its work complete.',
          'International Court of Justice, seated at The Hague.',
          'Secretariat, headed by the Secretary-General.',
        ],
      },
      {
        heading: 'Agencies and where they sit',
        bullets: [
          'WHO, ILO and WTO in Geneva; UNESCO in Paris; FAO in Rome; IAEA in Vienna.',
          'The IMF and the World Bank are in Washington DC; UNICEF is in New York.',
          'Knowing four or five headquarters accurately is better than guessing at a dozen.',
        ],
      },
      {
        heading: 'Pakistan and the UN',
        bullets: [
          "Pakistan has been among the largest contributors of personnel to United Nations peacekeeping missions over the organisation's history.",
          'Pakistani troops have served in missions across Africa, the Balkans and elsewhere, and a number have died on those deployments.',
          'Pakistan has served several terms as a non-permanent member of the Security Council.',
        ],
      },
    ],
  },

  {
    slug: 'international-organisations',
    kind: 'gk',
    section: 'world',
    titleEn: 'International organisations',
    titleUr: 'بین الاقوامی تنظیمیں',
    summaryEn:
      'The blocs and organisations Pakistan belongs to or deals with, when each was founded and where each is based.',
    issbAngle:
      'Learn the ones Pakistan is actually in first — OIC, SCO, SAARC, ECO, D-8 — and be able to say what each is for. Being able to explain why SAARC has achieved little is a better answer than listing its members.',
    facts: [
      { label: 'OIC founded', value: '1969, at Rabat' },
      { label: 'OIC headquarters', value: 'Jeddah' },
      { label: 'OIC members', value: '57' },
      { label: 'SAARC founded', value: '1985, at Dhaka' },
      { label: 'SAARC headquarters', value: 'Kathmandu' },
      { label: 'SAARC members', value: 'Eight' },
      { label: 'SCO founded', value: '2001, at Shanghai' },
      { label: 'Pakistan joined SCO', value: '2017, as a full member' },
      { label: 'ECO headquarters', value: 'Tehran' },
      { label: 'D-8 founded', value: '1997, headquartered at Istanbul' },
      { label: 'NATO founded', value: '1949, headquartered at Brussels' },
      { label: 'ASEAN founded', value: '1967, headquartered at Jakarta' },
      { label: 'OPEC founded', value: '1960, headquartered at Vienna' },
    ],
    points: [
      {
        heading: 'Where Pakistan sits',
        bullets: [
          'The Organisation of Islamic Cooperation is the largest body of Muslim-majority states and the main forum in which Pakistan raises Kashmir.',
          'The Shanghai Cooperation Organisation brought Pakistan and India in as full members in 2017; its focus is regional security and connectivity.',
          'SAARC has been effectively stalled by India–Pakistan relations, which is the honest answer when asked about its performance.',
          'The Economic Cooperation Organisation links Pakistan with Iran, Turkiye and the Central Asian states.',
        ],
      },
      {
        heading: 'Blocs to recognise',
        bullets: [
          'NATO is a collective defence alliance; an attack on one member is treated as an attack on all.',
          'ASEAN is a South East Asian economic and political grouping, often cited as what SAARC might have been.',
          'BRICS and the G20 are the groupings through which large developing economies coordinate.',
        ],
      },
    ],
  },

  {
    slug: 'straits-and-canals',
    kind: 'gk',
    section: 'world',
    titleEn: 'Strategic straits and canals',
    titleUr: 'اہم آبنائے اور نہریں',
    summaryEn:
      'The narrow passages through which a large share of world trade and energy moves. Each is a chokepoint, which is exactly why they appear in strategic discussion.',
    issbAngle:
      'A favourite because it tests whether you understand geography as strategy. Hormuz is the one to know properly — a very large share of seaborne oil passes through it, which is why any tension in the Gulf moves oil prices worldwide.',
    facts: [
      { label: 'Strait of Hormuz', value: 'Persian Gulf to the Gulf of Oman' },
      { label: 'Strait of Malacca', value: 'Indian Ocean to the South China Sea' },
      { label: 'Bab-el-Mandeb', value: 'Red Sea to the Gulf of Aden' },
      { label: 'Suez Canal', value: 'Mediterranean to the Red Sea; opened 1869' },
      { label: 'Panama Canal', value: 'Atlantic to the Pacific; opened 1914' },
      { label: 'Bosphorus', value: 'Black Sea to the Sea of Marmara' },
      { label: 'Strait of Gibraltar', value: 'Atlantic to the Mediterranean' },
      { label: 'Palk Strait', value: 'Between India and Sri Lanka' },
    ],
    points: [
      {
        heading: 'Why they matter',
        bullets: [
          'A chokepoint concentrates traffic into a narrow space, so closing it — or threatening to — has an effect out of all proportion to its size.',
          "Hormuz carries a very large share of the world's seaborne oil, which is why Gulf tension is immediately a global economic event.",
          'Malacca is the shortest sea route between the Indian Ocean and East Asia, and the reason alternative overland routes such as CPEC are argued for.',
          'The Suez Canal removes the voyage round Africa; a blockage there disrupts European supply chains within days.',
        ],
      },
    ],
  },

  {
    slug: 'world-geography-basics',
    kind: 'gk',
    section: 'geography',
    titleEn: 'World geography — the basics',
    titleUr: 'دنیا کا جغرافیہ',
    summaryEn:
      'Continents, oceans, the largest and highest of things, and the handful of superlatives that recur in every general knowledge paper.',
    issbAngle:
      'Pure recall, answered quickly. If you are unsure of a figure, give the fact without the number — naming Everest as the highest peak is correct even if you cannot recall the metres.',
    facts: [
      { label: 'Continents', value: 'Seven' },
      { label: 'Oceans', value: 'Five' },
      { label: 'Largest ocean', value: 'Pacific' },
      { label: 'Smallest ocean', value: 'Arctic' },
      { label: 'Highest mountain', value: 'Everest, 8,849 metres' },
      { label: 'Second highest', value: 'K2, 8,611 metres, in Pakistan' },
      { label: 'Largest hot desert', value: 'Sahara' },
      { label: 'Largest country by area', value: 'Russia' },
      { label: 'Smallest country', value: 'Vatican City' },
      {
        label: 'Longest rivers',
        value: 'The Nile and the Amazon, depending on how each is measured',
      },
      { label: 'Largest freshwater lake by area', value: 'Lake Superior' },
      { label: 'Deepest ocean point', value: 'The Mariana Trench' },
    ],
    points: [
      {
        heading: 'Lines and zones',
        bullets: [
          "The Equator divides the hemispheres; the Tropics of Cancer and Capricorn mark the limits of the sun's overhead path.",
          'The Prime Meridian runs through Greenwich; the International Date Line runs roughly opposite it.',
          'The Tropic of Cancer passes through the northern edge of South Asia, which is why the region has a monsoon climate.',
        ],
      },
    ],
  },

  {
    slug: 'science-and-space-basics',
    kind: 'gk',
    section: 'science',
    titleEn: 'Science and space — the basics',
    titleUr: 'سائنس اور خلا',
    summaryEn:
      "Everyday science facts that appear in general knowledge papers, and Pakistan's own space and atomic institutions.",
    issbAngle:
      'Boards are checking general awareness, not testing you as a scientist. Know what SUPARCO and the PAEC are and what they do — those are the ones connected to the country rather than to a textbook.',
    facts: [
      { label: 'SUPARCO founded', value: '1961' },
      { label: 'SUPARCO stands for', value: 'Space and Upper Atmosphere Research Commission' },
      { label: "Pakistan's first satellite", value: 'Badr-1, launched 1990' },
      { label: 'PAEC founded', value: '1956' },
      { label: 'Planets in the solar system', value: 'Eight' },
      { label: 'Largest planet', value: 'Jupiter' },
      { label: 'Closest planet to the sun', value: 'Mercury' },
      { label: 'Speed of light', value: 'About 300,000 kilometres per second' },
      { label: 'Normal human body temperature', value: 'About 37 degrees Celsius' },
      { label: 'Blood groups', value: 'A, B, AB and O, each positive or negative' },
      { label: 'Units of electric current', value: 'Ampere' },
    ],
    points: [
      {
        heading: "Pakistan's institutions",
        bullets: [
          'SUPARCO is the national space agency, established in 1961 and among the earliest in Asia.',
          "Badr-1, launched in 1990, was Pakistan's first satellite; communications and remote-sensing satellites have followed.",
          'The Pakistan Atomic Energy Commission runs the civil nuclear power programme alongside its research role.',
          'Dr Abdus Salam, a Pakistani physicist, shared the Nobel Prize in Physics in 1979.',
        ],
      },
    ],
  },

  {
    slug: 'pakistan-in-sport',
    kind: 'gk',
    section: 'world',
    titleEn: 'Pakistan in sport',
    titleUr: 'کھیلوں میں پاکستان',
    summaryEn:
      "The achievements that come up in general knowledge questions — Olympic hockey, the 1992 cricket World Cup, a long run of squash dominance, and the country's first individual Olympic gold.",
    issbAngle:
      'Light ground, often used to open an interview and settle you. Have one achievement you can talk about with genuine interest; a flat recital of results tells a board nothing about you.',
    facts: [
      { label: 'National game', value: 'Field hockey' },
      { label: 'Olympic hockey golds', value: '1960, 1968 and 1984' },
      { label: 'Hockey World Cups', value: '1971, 1978, 1982 and 1994' },
      { label: 'Cricket World Cup', value: 'Won in 1992' },
      { label: 'T20 World Cup', value: 'Won in 2009' },
      { label: 'Champions Trophy', value: 'Won in 2017' },
      { label: 'Squash greats', value: 'Jahangir Khan and Jansher Khan' },
      { label: 'First individual Olympic gold', value: 'Arshad Nadeem, javelin, Paris 2024' },
    ],
    points: [
      {
        heading: 'Worth knowing properly',
        bullets: [
          'Pakistan won the first Hockey World Cup in 1971 and has won it four times in all — the record the country held longest.',
          "Jahangir Khan's unbeaten run in squash through the 1980s is among the longest winning streaks in any professional sport.",
          "Arshad Nadeem's javelin gold at Paris 2024 was Pakistan's first Olympic gold in an individual event.",
        ],
      },
    ],
  },
]
