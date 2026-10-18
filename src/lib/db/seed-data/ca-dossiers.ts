/**
 * Written dossiers for the current-affairs topics a board is most likely to
 * raise.
 *
 * These are hand-written in our own words from open reporting — BBC, Dawn,
 * ARY, Geo, The News, Reuters and the wire coverage they carry. No source text
 * is reproduced; the feeds supply the live headlines alongside each page and
 * the reader follows those links for the current position.
 *
 * ACCOUNT DATE. Each dossier is written to a stated date and says so in the
 * text, because a conflict summary with no date on it is the most misleading
 * thing a study aid can contain. Anything after that date is carried by the
 * "Recent coverage" links on the page, which refresh with the feeds.
 *
 * These are seeded with `origin: 'curated'`, so a re-gather refreshes their
 * facts, sources and coverage and leaves the writing intact.
 */
import type { CuratedTopic } from '../../gk/topics'

const ACCOUNT_DATE =
  'This account is written to early 2026. Check the linked coverage for anything since.'

export const CA_DOSSIERS: CuratedTopic[] = [
  {
    slug: 'iran-israel-conflict',
    coverageKeywords: ['Iran', 'Israel', 'Tehran'],
    kind: 'current_affairs',
    section: 'conflict',
    titleEn: 'Iran–Israel conflict',
    titleUr: 'ایران اسرائیل تنازع',
    summaryEn:
      'A hostility that ran for four decades through proxies and covert operations, and then broke into the open. Iran and Israel exchanged direct strikes on each other for the first time in 2024, and fought a short, intense air war in June 2025 that ended in a ceasefire rather than a settlement.',
    issbAngle:
      'The most likely single question in this area. Give the sequence calmly, note that Pakistan opposed the strikes on Iran while maintaining its Gulf relationships, and do not predict what happens next. A candidate who can explain why a ceasefire is not a peace is doing exactly what the board wants.',
    facts: [
      { label: 'Nature of the conflict', value: 'State-to-state, fought directly since 2024' },
      { label: 'Roots', value: 'The Iranian revolution of 1979' },
      { label: 'First direct Iranian strike on Israel', value: 'April 2024' },
      { label: 'Second Iranian missile barrage', value: 'October 2024' },
      { label: 'Open air war', value: 'June 2025, about twelve days' },
      { label: 'Ceasefire', value: 'Announced late June 2025' },
      { label: 'Iranian proxies', value: 'Hezbollah, the Houthis, Iraqi militias' },
      { label: 'Core Israeli concern', value: "Iran's nuclear programme and its proxy network" },
      { label: 'Core Iranian position', value: 'It does not recognise Israel' },
      { label: 'Status', value: 'Ceasefire holding, no settlement' },
    ],
    points: [
      {
        heading: 'Why the two are enemies',
        bullets: [
          'Before 1979 Iran and Israel had working relations. The revolution replaced that with a state doctrine that does not recognise Israel and supports armed groups opposed to it.',
          'Israel regards an Iranian nuclear weapon as an existential threat, and has acted for two decades to delay the programme by sabotage, cyber attack and the killing of scientists.',
          "Iran built a network of allied armed groups around Israel's borders — Hezbollah in Lebanon, militias in Syria and Iraq, the Houthis in Yemen, and support for Palestinian factions.",
          "For most of that period neither struck the other's territory directly. Both used proxies, covert operations and deniability.",
        ],
      },
      {
        heading: 'What Israel did',
        bullets: [
          'Years of covert action against the nuclear programme, including the Stuxnet cyber attack and the killing of nuclear scientists inside Iran.',
          'Repeated air strikes on Iranian personnel and weapons transfers in Syria.',
          'In April 2024 it struck an Iranian diplomatic compound in Damascus, killing senior Revolutionary Guard commanders — the strike that broke the unwritten rule and brought a direct Iranian response.',
          'Through 2024 it killed senior figures of Iran-aligned groups, including the Hamas political leader while he was in Tehran and the Hezbollah leader in Beirut.',
          'In June 2025 it opened a large air campaign against Iranian nuclear sites, air defences, missile production and senior military commanders.',
        ],
      },
      {
        heading: 'What Iran did',
        bullets: [
          'In April 2024 it launched its first direct attack on Israeli territory from its own soil — a large wave of drones and missiles, almost all intercepted by Israel and its partners.',
          'In October 2024 it fired a second, larger ballistic missile barrage after the killings of allied leaders.',
          'During the June 2025 war it fired repeated ballistic missile salvoes at Israeli cities and military sites, some of which got through the air defences.',
          'It has continued to enrich uranium well beyond the limits of the 2015 nuclear agreement, while maintaining that its programme is civil.',
        ],
      },
      {
        heading: 'How the June 2025 war ended',
        bullets: [
          'The United States joined with strikes on three Iranian nuclear facilities before a ceasefire was announced after about twelve days of fighting.',
          'Both sides declared success: Israel pointed to damage done to the nuclear programme and the command structure, Iran to having struck Israeli territory at scale and survived.',
          'The ceasefire stopped the exchange. It settled none of the underlying questions — the nuclear programme, the proxy network, or recognition.',
        ],
      },
      {
        heading: 'Where it stands',
        bullets: [
          'No peace process exists between them, and neither recognises the other.',
          "International inspection of Iran's nuclear sites has been a running dispute since the war, with access reduced.",
          'The proxy front is weakened but intact, and the risk of a further round has not gone away.',
          ACCOUNT_DATE,
        ],
      },
      {
        heading: 'Why it matters for Pakistan',
        bullets: [
          'Pakistan shares a long border with Iran and condemned the strikes on Iranian territory as a violation of sovereignty.',
          'It also maintains close relationships with Saudi Arabia and the Gulf states, where millions of Pakistanis work, so its position is a balancing act rather than an alignment.',
          'Any closure of the Strait of Hormuz would raise the price of the energy Pakistan imports almost immediately.',
        ],
      },
    ],
    timeline: [
      { date: '1979', event: 'The Iranian revolution ends relations between the two states.' },
      { date: '2010', event: 'The Stuxnet cyber attack damages Iranian enrichment equipment.' },
      {
        date: 'April 2024',
        event:
          'Israel strikes an Iranian compound in Damascus; Iran launches its first direct attack on Israel.',
      },
      {
        date: 'October 2024',
        event: 'Iran fires a second large ballistic missile barrage; Israel strikes back.',
      },
      {
        date: 'June 2025',
        event: 'Israel opens an air campaign against Iranian nuclear and military targets.',
      },
      {
        date: 'June 2025',
        event:
          'The United States strikes three nuclear sites; a ceasefire follows after about twelve days.',
      },
    ],
  },

  {
    slug: 'gaza-war',
    coverageKeywords: ['Gaza', 'Israel', 'Palestin', 'Hamas'],
    kind: 'current_affairs',
    section: 'conflict',
    titleEn: 'The war in Gaza',
    titleUr: 'غزہ کی جنگ',
    summaryEn:
      'The war that began with the Hamas attack on southern Israel on 7 October 2023 and the Israeli campaign in Gaza that followed. It is the deadliest phase of the Israeli–Palestinian conflict and has reshaped politics across the region.',
    issbAngle:
      "Handle with care and precision. State the facts of what happened, acknowledge the civilian toll, and give Pakistan's position — which has been consistent support for a Palestinian state and for humanitarian access. Avoid language that celebrates any killing; a board is watching your judgement, not your passion.",
    facts: [
      { label: 'Began', value: '7 October 2023' },
      { label: 'Trigger', value: 'The Hamas attack on southern Israel' },
      { label: 'Territory', value: 'The Gaza Strip' },
      { label: 'Displacement', value: "The large majority of Gaza's population" },
      { label: 'Mediators', value: 'Qatar, Egypt and the United States' },
      {
        label: 'Legal proceedings',
        value: 'Cases at the International Court of Justice and the International Criminal Court',
      },
      {
        label: "Pakistan's position",
        value: 'Supports a Palestinian state; does not recognise Israel',
      },
    ],
    points: [
      {
        heading: 'How it began',
        bullets: [
          'On 7 October 2023 Hamas and allied groups crossed from Gaza into southern Israel, killing about 1,200 people, most of them civilians, and taking around 250 hostages.',
          'Israel declared war and began an air campaign followed by a ground operation across the Gaza Strip.',
          'The stated Israeli objectives were the destruction of Hamas as a military and governing force and the return of the hostages.',
        ],
      },
      {
        heading: 'What the war has done to Gaza',
        bullets: [
          'Tens of thousands of Palestinians have been killed according to the health authorities in Gaza, the majority reported as women and children.',
          'Most of the population has been displaced, in many cases repeatedly, and much of the housing, hospital and water infrastructure has been destroyed.',
          'Aid access has been a constant dispute, with United Nations agencies repeatedly warning of famine conditions.',
        ],
      },
      {
        heading: 'How it widened',
        bullets: [
          'Hezbollah opened a front from Lebanon; Israel and Hezbollah fought a heavy exchange through 2024 that ended in a separate ceasefire.',
          'The Houthis in Yemen attacked shipping in the Red Sea in support of Gaza, disrupting a major world trade route.',
          'Iran and Israel exchanged direct strikes for the first time, which is a separate dossier in this library.',
        ],
      },
      {
        heading: 'Diplomacy and law',
        bullets: [
          'Qatar, Egypt and the United States have mediated repeated ceasefire and hostage-release negotiations, some of which produced temporary pauses.',
          'South Africa brought a case at the International Court of Justice alleging genocide; the court ordered provisional measures without ruling on the merits.',
          'The International Criminal Court prosecutor sought arrest warrants against both Israeli and Hamas figures.',
          ACCOUNT_DATE,
        ],
      },
      {
        heading: "Pakistan's position",
        bullets: [
          'Pakistan does not recognise Israel and has consistently supported a two-state settlement with East Jerusalem as the Palestinian capital.',
          'It has called for a ceasefire and humanitarian access at the United Nations and the OIC, and has sent relief consignments.',
          'The question for a candidate is usually what Pakistan can realistically do — the honest answer is diplomatic and humanitarian rather than military.',
        ],
      },
    ],
    timeline: [
      { date: '7 October 2023', event: 'Hamas attacks southern Israel; Israel declares war.' },
      { date: 'Late 2023', event: 'Israeli ground operations begin across Gaza.' },
      { date: '2024', event: 'The war widens to Lebanon and the Red Sea.' },
      { date: '2024–2025', event: 'Repeated mediated ceasefire and hostage negotiations.' },
    ],
  },

  {
    slug: '2022-russian-invasion-of-ukraine',
    coverageKeywords: ['Ukraine', 'Russia', 'Moscow', 'Kyiv'],
    kind: 'current_affairs',
    section: 'conflict',
    titleEn: 'The war in Ukraine',
    titleUr: 'یوکرین کی جنگ',
    summaryEn:
      'Russia invaded Ukraine in February 2022 after eight years of conflict in the east. It became the largest war in Europe since 1945, settled into attritional fighting along a long front, and has reordered European security and world energy and grain markets.',
    issbAngle:
      'Useful for questions about sovereignty, alliances and the limits of international law. Pakistan abstained on the United Nations votes and has kept a neutral line — explaining why a country dependent on imported energy and IMF support takes that position is a mature answer.',
    facts: [
      { label: 'Invasion began', value: '24 February 2022' },
      { label: 'Earlier phase', value: 'Crimea annexed and the Donbas war began in 2014' },
      { label: 'Russian stated aims', value: 'Preventing NATO enlargement; demands over Donbas' },
      {
        label: 'Ukrainian position',
        value: 'Restoration of its internationally recognised borders',
      },
      { label: 'NATO enlargement since', value: 'Finland and Sweden joined' },
      { label: 'Main Western support', value: 'Weapons, finance and sanctions rather than troops' },
      { label: "Pakistan's UN position", value: 'Abstained on the principal resolutions' },
      { label: 'Status', value: 'Ongoing, with no agreed settlement' },
    ],
    points: [
      {
        heading: 'How it started',
        bullets: [
          'Russia annexed Crimea in 2014 and backed armed separatists in the Donbas, producing eight years of low-level war.',
          'In February 2022 Russia invaded on several axes, including a drive on Kyiv that failed within weeks against Ukrainian resistance.',
          'Russia stated its aims in terms of NATO enlargement and the status of the Donbas; Ukraine and its partners characterised the invasion as an attempt to end Ukrainian independence.',
        ],
      },
      {
        heading: 'How it has been fought',
        bullets: [
          'After the failure at Kyiv the war moved east and south and became attritional — artillery, drones, minefields and fortified lines.',
          'Ukraine recovered territory around Kharkiv and Kherson in 2022; a major counter-offensive in 2023 achieved much less.',
          'Long-range strikes have hit Ukrainian power infrastructure and Russian refineries, ports and airbases.',
          'Drones have changed the character of the fighting more than any other single factor.',
        ],
      },
      {
        heading: 'Consequences beyond the war',
        bullets: [
          'Finland and Sweden abandoned long-standing neutrality and joined NATO — the opposite of the stated Russian aim.',
          'Europe cut its dependence on Russian gas at considerable cost; energy prices rose worldwide.',
          'Grain and fertiliser exports were disrupted, raising food prices in importing countries including Pakistan.',
          'Extensive sanctions were imposed on Russia, which redirected trade towards China, India and others.',
          ACCOUNT_DATE,
        ],
      },
      {
        heading: 'Where Pakistan stands',
        bullets: [
          'Pakistan abstained rather than voting to condemn, in line with a long-standing preference not to take sides between major powers.',
          'It has been affected mainly through energy and food prices and through pressure on its balance of payments.',
        ],
      },
    ],
    timeline: [
      { date: '2014', event: 'Russia annexes Crimea; war begins in the Donbas.' },
      { date: '24 February 2022', event: 'Russia invades Ukraine.' },
      { date: 'Late 2022', event: 'Ukraine recovers territory around Kharkiv and Kherson.' },
      { date: '2023', event: 'The Ukrainian counter-offensive achieves limited gains.' },
      { date: '2023–2024', event: 'Finland and then Sweden join NATO.' },
    ],
  },

  {
    slug: 'afghanistan-under-the-taliban',
    coverageKeywords: ['Afghan', 'Taliban', 'Kabul'],
    kind: 'current_affairs',
    section: 'pakistan',
    titleEn: 'Afghanistan under the Taliban',
    titleUr: 'طالبان کے تحت افغانستان',
    summaryEn:
      'The Taliban returned to power in August 2021 as the United States withdrew. No country has formally recognised the government; the economy contracted sharply; and for Pakistan the central issue has become militant attacks launched from Afghan soil.',
    issbAngle:
      'This is a Pakistan question more than an Afghanistan question. Be ready to explain why relations with a government Pakistan was once assumed to be close to have deteriorated — the answer is the TTP, the border and refugees, not ideology.',
    facts: [
      { label: 'Taliban returned to power', value: 'August 2021' },
      { label: 'Trigger', value: 'The United States withdrawal' },
      { label: 'Recognition', value: 'No state has extended formal recognition' },
      { label: 'Border with Pakistan', value: 'The Durand Line, about 2,600 km' },
      {
        label: 'Main Pakistani concern',
        value: 'Attacks by the Tehrik-i-Taliban Pakistan from Afghan territory',
      },
      { label: 'Afghan refugees in Pakistan', value: 'Several million over four decades' },
      { label: "Women's education", value: 'Secondary and higher education for girls suspended' },
    ],
    points: [
      {
        heading: 'What happened in 2021',
        bullets: [
          'The Doha agreement of 2020 set a timetable for the American withdrawal; the Afghan government and army collapsed far faster than expected as it proceeded.',
          'Kabul fell in August 2021 without a final battle, and the evacuation that followed was chaotic and deadly.',
          'The Taliban formed a government drawn from their own movement rather than the broad-based administration many had expected.',
        ],
      },
      {
        heading: 'Since then',
        bullets: [
          'Aid that had funded most of the state budget was cut and central bank reserves were frozen, producing a severe economic contraction and a humanitarian emergency.',
          'Girls have been barred from secondary and higher education and women from most employment, which is the principal obstacle to recognition.',
          'Security inside the country improved against the previous insurgency but Islamic State Khorasan has carried out major attacks.',
        ],
      },
      {
        heading: 'Why relations with Pakistan soured',
        bullets: [
          'Pakistan expected a friendly government; instead the Tehrik-i-Taliban Pakistan regrouped and attacks inside Pakistan rose sharply after 2021.',
          'Pakistan says the TTP operates from Afghan territory; the Taliban government denies responsibility and objects to Pakistani strikes across the border.',
          'Pakistan began large-scale deportation of undocumented Afghan nationals, which strained relations further and drew criticism from aid agencies.',
          'The Durand Line remains disputed by Kabul, and border crossings have been closed repeatedly.',
          ACCOUNT_DATE,
        ],
      },
    ],
    timeline: [
      { date: '2020', event: 'The Doha agreement sets the American withdrawal timetable.' },
      { date: 'August 2021', event: 'Kabul falls; the Taliban return to power.' },
      { date: '2022–2023', event: 'TTP attacks inside Pakistan increase sharply.' },
      { date: '2023', event: 'Pakistan begins deporting undocumented Afghan nationals.' },
    ],
  },

  {
    slug: 'india-pakistan-relations',
    coverageKeywords: ['India', 'Kashmir', 'Delhi'],
    kind: 'current_affairs',
    section: 'diplomacy',
    titleEn: 'India–Pakistan relations',
    titleUr: 'پاک بھارت تعلقات',
    summaryEn:
      'Relations have been cold since 2019 — no high commissioners, almost no trade, and periodic military exchanges. Kashmir remains the core dispute, and both sides are nuclear-armed, which is what makes every incident consequential.',
    issbAngle:
      "The single most sensitive interview topic there is. State positions factually, never use abusive language about India or Indians, and be able to say what you think a responsible officer's attitude to a neighbour should be. Measured firmness is the register that works.",
    facts: [
      { label: 'Core dispute', value: 'Jammu and Kashmir' },
      { label: 'Framework agreement', value: 'The Simla Agreement, 1972' },
      { label: 'Water treaty', value: 'The Indus Waters Treaty, 1960' },
      {
        label: 'Diplomatic status since 2019',
        value: 'Missions downgraded; no high commissioners',
      },
      { label: 'Trade', value: 'Largely suspended since 2019' },
      { label: 'Both states', value: 'Nuclear-armed' },
      { label: 'Ceasefire on the Line of Control', value: 'Recommitted in 2021' },
    ],
    points: [
      {
        heading: 'How the relationship got here',
        bullets: [
          'The Pulwama attack of February 2019 was followed by Indian air strikes at Balakot and a Pakistani response in which an Indian aircraft was downed and its pilot captured and returned.',
          'In August 2019 India revoked the special constitutional status of the territory it administers in Jammu and Kashmir. Pakistan downgraded diplomatic relations and suspended trade.',
          'A renewed commitment to the Line of Control ceasefire in 2021 reduced firing substantially, and is the one thing that has worked.',
        ],
      },
      {
        heading: 'What each side says',
        bullets: [
          'Pakistan holds that Kashmir is a disputed territory whose future should be settled according to the wishes of its people, and raises it at the United Nations and the OIC.',
          'India holds that Kashmir is an internal matter and that dialogue requires an end to cross-border militancy.',
          'Both positions have been stable for years, which is why there has been no process rather than a failed one.',
        ],
      },
      {
        heading: 'What still functions',
        bullets: [
          'The Indus Waters Treaty has survived every conflict since 1960, though India has sought to renegotiate parts of it and disputes over specific hydropower projects have gone to arbitration.',
          'The Kartarpur corridor for Sikh pilgrims has remained open — a rare example of cooperation.',
          'Both sides exchange lists of nuclear installations each January under a 1988 agreement, without fail.',
          ACCOUNT_DATE,
        ],
      },
    ],
    timeline: [
      {
        date: 'February 2019',
        event: 'The Pulwama attack, the Balakot strike and the Pakistani response.',
      },
      {
        date: 'August 2019',
        event: 'India revokes the special status of the territory it administers.',
      },
      { date: 'February 2021', event: 'Both armies recommit to the Line of Control ceasefire.' },
    ],
  },

  {
    slug: 'pakistani-taliban',
    coverageKeywords: ['TTP', 'militant', 'Peshawar', 'Waziristan'],
    kind: 'current_affairs',
    section: 'defence',
    titleEn: 'Militancy in Pakistan and the TTP',
    titleUr: 'پاکستان میں عسکریت پسندی',
    summaryEn:
      'The Tehrik-i-Taliban Pakistan is an umbrella of militant groups fighting the Pakistani state. Largely broken by operations between 2014 and 2017, it regrouped after the Taliban took Kabul in 2021, and attacks on security forces have risen since.',
    issbAngle:
      'Expect to be asked what you would do about it as an officer. The answer worth giving combines the military element with the rest — development in the affected districts, policing, and the reason the National Action Plan was written as a twenty-point plan rather than an operation.',
    facts: [
      { label: 'Formed', value: '2007' },
      {
        label: 'Major operations against it',
        value: 'Rah-e-Rast 2009; Zarb-e-Azb 2014; Radd-ul-Fasaad 2017',
      },
      { label: 'Policy framework', value: 'The National Action Plan, 2014' },
      {
        label: 'Trigger for the National Action Plan',
        value: 'The Army Public School attack, Peshawar, December 2014',
      },
      { label: 'Resurgence', value: 'After the Taliban took Kabul in 2021' },
      { label: 'Most affected areas', value: 'Khyber Pakhtunkhwa and Balochistan' },
      { label: 'Other groups', value: 'Islamic State Khorasan; Baloch separatist groups' },
    ],
    points: [
      {
        heading: 'The first campaign',
        bullets: [
          'The TTP emerged in 2007 from groups in the tribal districts and carried out attacks across the country for years.',
          'Operation Zarb-e-Azb in North Waziristan from June 2014 and Radd-ul-Fasaad from 2017 cleared the areas it held and broke its command structure; many fighters crossed into Afghanistan.',
          'The attack on the Army Public School in Peshawar in December 2014, in which around 150 people were killed, most of them children, produced the National Action Plan and a political consensus that had not existed before.',
          'Violence fell substantially between 2015 and 2020.',
        ],
      },
      {
        heading: 'Why it came back',
        bullets: [
          'After the Taliban took Kabul in 2021, TTP fighters gained freedom of movement and a number of imprisoned militants were released.',
          'Talks between the Pakistani state and the TTP in 2021 and 2022 broke down, and the group formally ended its ceasefire.',
          'Attacks on police and military targets in Khyber Pakhtunkhwa and on security forces in Balochistan have risen since, and 2023 onwards has been among the deadliest periods in a decade.',
          ACCOUNT_DATE,
        ],
      },
      {
        heading: 'What the response involves',
        bullets: [
          'Military and intelligence-led operations against militant networks, and strikes on positions across the border that Afghanistan protests.',
          'The unfinished parts of the National Action Plan — police capacity, prosecution, madrassa reform, counter-financing and countering the narrative.',
          'Development and administration in the districts merged into Khyber Pakhtunkhwa in 2018, where the writ of the state is still being built.',
        ],
      },
    ],
    timeline: [
      { date: '2007', event: 'The TTP is formed.' },
      { date: 'December 2014', event: 'The Army Public School attack in Peshawar.' },
      { date: '2014–2017', event: 'Operations Zarb-e-Azb and Radd-ul-Fasaad.' },
      { date: '2021', event: 'The Taliban take Kabul; the TTP regroups.' },
      { date: '2022', event: 'Talks collapse and the TTP ends its ceasefire.' },
    ],
  },

  {
    slug: 'insurgency-in-balochistan',
    coverageKeywords: ['Baloch', 'Quetta', 'Gwadar'],
    kind: 'current_affairs',
    section: 'pakistan',
    titleEn: 'Balochistan',
    titleUr: 'بلوچستان',
    summaryEn:
      "Pakistan's largest province by area and smallest by population, rich in gas, minerals and coastline, and the site of a long-running separatist insurgency alongside deep grievances about development, representation and missing persons.",
    issbAngle:
      "Answer this as a Pakistani officer would have to: acknowledge the grievances as real, reject violence as the answer, and talk about what would actually change things. Dismissing the province's complaints as foreign-sponsored is the answer that goes down worst.",
    facts: [
      { label: 'Share of national area', value: 'The largest province' },
      { label: 'Share of national population', value: 'The smallest of the four provinces' },
      { label: 'Capital', value: 'Quetta' },
      {
        label: 'Main resources',
        value: 'Natural gas at Sui; copper and gold at Reko Diq; coastline',
      },
      { label: 'Main port project', value: 'Gwadar, the southern end of CPEC' },
      {
        label: 'Armed groups',
        value: 'Baloch separatist organisations; sectarian and jihadist groups',
      },
      {
        label: 'Periods of insurgency',
        value: 'Five since 1948, the current one since the mid-2000s',
      },
    ],
    points: [
      {
        heading: 'The grievances',
        bullets: [
          'Gas has been produced at Sui since the 1950s while many parts of the province remained unconnected to it — the example cited more than any other.',
          'Human development indicators are the lowest in the country, and the province has the weakest health and education provision.',
          'Enforced disappearances and the treatment of families campaigning about them are a serious and continuing grievance.',
          'Decisions about large projects have often been taken without meaningful consent from those affected, which is the argument made about Gwadar and about mining.',
        ],
      },
      {
        heading: 'The violence',
        bullets: [
          'Separatist groups attack security forces, infrastructure, and workers from other provinces, including attacks on Chinese nationals working on CPEC projects.',
          'Sectarian attacks, particularly on the Hazara community in Quetta, have killed large numbers over two decades.',
          'The state has responded with military and paramilitary operations; the conflict has not been resolved by either side.',
          ACCOUNT_DATE,
        ],
      },
      {
        heading: 'What would change it',
        bullets: [
          'Local employment and procurement on the large projects, so the benefit is visible in the province rather than exported from it.',
          'Resolution of the missing persons question through the courts, which is the single grievance that generates most new alienation.',
          'Political rather than administrative settlement — engagement with elected Baloch leaders rather than intermediaries.',
        ],
      },
    ],
  },

  {
    slug: 'pakistan-and-the-imf',
    coverageKeywords: ['IMF', 'rupee', 'inflation', 'economy'],
    kind: 'current_affairs',
    section: 'economy',
    titleEn: 'Pakistan and the IMF',
    titleUr: 'پاکستان اور آئی ایم ایف',
    summaryEn:
      'Pakistan has entered more IMF programmes than almost any other member. The 2022–23 crisis took reserves to the edge of default before a stabilisation programme; the pattern of stabilise, relapse, return is the thing to understand rather than any single package.',
    issbAngle:
      'A frequent interview question, and one where candidates repeat slogans. The good answer explains the mechanism — why a country that imports more than it exports and taxes too little must keep borrowing — and names one structural change rather than blaming a government.',
    facts: [
      { label: 'IMF programmes since 1958', value: 'More than twenty' },
      { label: 'Crisis point', value: '2022–23, with reserves covering only weeks of imports' },
      {
        label: 'Usual conditions',
        value: 'Revenue measures, energy tariffs, a market exchange rate',
      },
      { label: 'Largest export sector', value: 'Textiles' },
      { label: 'Largest inflow of foreign exchange', value: 'Remittances' },
      {
        label: 'Structural issue',
        value: 'Narrow tax base and a persistent current account deficit',
      },
    ],
    points: [
      {
        heading: 'Why it keeps happening',
        bullets: [
          'Imports of energy, machinery and food consistently exceed exports, so foreign exchange leaves faster than it arrives.',
          'Tax revenue is low as a share of the economy, and much of what is collected comes from a narrow set of already-documented taxpayers.',
          'Losses in the power sector and in state-owned enterprises absorb borrowing that would otherwise fund development.',
          'When reserves fall far enough, the only lender available on the required scale is the IMF, and its conditions follow.',
        ],
      },
      {
        heading: 'What the conditions do',
        bullets: [
          'Raising energy tariffs and removing subsidies closes the fiscal gap but raises prices immediately, which is why programmes are politically costly.',
          'A market-determined exchange rate ends the drain on reserves from defending an overvalued rupee, at the cost of imported inflation.',
          'Revenue measures broaden the tax net in principle; in practice they have often fallen again on those already paying.',
          ACCOUNT_DATE,
        ],
      },
      {
        heading: 'What would break the cycle',
        bullets: [
          'Exports beyond textiles — information technology services have grown quickly from a small base and require little imported input.',
          'Bringing retail, property and agriculture properly into the tax net rather than raising rates on manufacturing and salaries.',
          'Reducing the energy sector losses that consume much of the fiscal space each year.',
        ],
      },
    ],
  },

  {
    slug: 'red-sea-shipping-crisis',
    coverageKeywords: ['Houthi', 'Suez', 'shipping'],
    kind: 'current_affairs',
    section: 'economy',
    titleEn: 'The Red Sea shipping crisis',
    titleUr: 'بحیرۂ احمر کا بحران',
    summaryEn:
      'Houthi attacks on merchant shipping from late 2023 pushed much of the traffic that would have used the Suez Canal round the Cape of Good Hope instead, adding time and cost to trade between Asia and Europe.',
    issbAngle:
      'A good example of how a regional conflict becomes a global economic problem through geography. It pairs naturally with the straits and canals topic in the general knowledge library.',
    facts: [
      { label: 'Began', value: 'Late 2023' },
      { label: 'Chokepoint affected', value: 'Bab-el-Mandeb, and therefore the Suez Canal' },
      { label: 'Alternative route', value: 'Around the Cape of Good Hope' },
      { label: 'Added voyage time', value: 'Roughly ten to fourteen days to Europe from Asia' },
      { label: 'Stated Houthi justification', value: 'Support for Palestinians in Gaza' },
      { label: 'Naval responses', value: 'Multinational escort and strike operations' },
    ],
    points: [
      {
        heading: 'What happened',
        bullets: [
          'The Houthis began attacking merchant vessels in the Red Sea with missiles and drones, saying they were acting in support of Gaza.',
          'Major shipping lines suspended Red Sea transits and rerouted around southern Africa, adding thousands of miles to each voyage.',
          'Freight rates and insurance costs rose sharply, and Egypt lost a large share of Suez Canal revenue.',
          'Multinational naval operations escorted shipping and struck launch sites, without restoring normal traffic.',
          ACCOUNT_DATE,
        ],
      },
      {
        heading: 'Why it matters here',
        bullets: [
          'Pakistan imports most of its energy and much of its machinery by sea, so freight costs feed directly into domestic prices.',
          'It is the clearest recent demonstration of why chokepoints matter, and why alternative overland routes are argued for.',
        ],
      },
    ],
  },

  {
    slug: 'syrian-civil-war',
    coverageKeywords: ['Syria', 'Damascus'],
    kind: 'current_affairs',
    section: 'conflict',
    titleEn: 'Syria after Assad',
    titleUr: 'اسد کے بعد شام',
    summaryEn:
      'A civil war that began with protests in 2011, killed hundreds of thousands and displaced half the population, and ended with the collapse of the Assad government in December 2024 after more than half a century of family rule.',
    issbAngle:
      'Useful for questions about how civil wars end and what follows. The sober point is that the fall of a government is the start of the reconstruction problem, not the end of it.',
    facts: [
      { label: 'Began', value: '2011, with protests during the Arab Spring' },
      { label: 'Assad family rule', value: 'From 1971 to 2024' },
      { label: 'Government collapsed', value: 'December 2024' },
      { label: 'Displacement', value: 'Roughly half the pre-war population' },
      { label: 'External backers of the government', value: 'Russia and Iran' },
      { label: 'Other actors', value: 'Turkiye, the United States, Kurdish forces, Islamic State' },
      {
        label: 'Chemical weapons',
        value: 'Used during the war, confirmed by international investigators',
      },
    ],
    points: [
      {
        heading: 'The war',
        bullets: [
          'Protests in 2011 were met with force and escalated into an armed conflict involving dozens of factions.',
          "Russian and Iranian intervention from 2015 turned the war in the government's favour, and by 2020 most populated areas were back under its control.",
          'Islamic State seized large areas in 2014 and was defeated over several years by separate coalitions.',
          'Millions of refugees left, principally to Turkiye, Lebanon and Jordan, and onward to Europe.',
        ],
      },
      {
        heading: 'The collapse',
        bullets: [
          'In late 2024 an offensive from the north-west advanced quickly against an army that did not fight, and the government fell within days.',
          'Assad left the country; decades of rule ended without the final battle most observers had expected.',
          'A transitional administration took over, facing sanctions, a destroyed economy, armed factions and the question of what happens to returning refugees.',
          ACCOUNT_DATE,
        ],
      },
    ],
    timeline: [
      { date: '2011', event: 'Protests begin and are met with force.' },
      { date: '2014', event: 'Islamic State seizes large areas of Syria and Iraq.' },
      { date: '2015', event: 'Russian intervention turns the war for the government.' },
      { date: 'December 2024', event: 'The Assad government collapses.' },
    ],
  },
]
