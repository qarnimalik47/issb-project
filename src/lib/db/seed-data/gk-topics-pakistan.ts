/**
 * Pakistan: administration, economy, external relations and further
 * personalities.
 *
 * Volatile figures — GDP, reserves, population to the nearest million, who
 * holds which office — are deliberately absent. They age within months, and a
 * candidate who quotes a stale number at a board is worse placed than one who
 * describes the structure correctly and says the current figure should be
 * checked.
 */
import type { CuratedTopic } from '../../gk/topics'

export const PAKISTAN_TOPICS: CuratedTopic[] = [
  {
    slug: 'how-pakistan-is-governed',
    kind: 'gk',
    section: 'pakistan',
    titleEn: 'How Pakistan is governed',
    titleUr: 'پاکستان کا نظامِ حکومت',
    summaryEn:
      'The institutions of the federation — parliament, the executive, the judiciary and the bodies that run elections and the civil service — and how they relate to one another.',
    issbAngle:
      'Know the structure rather than the personalities. If asked about civil–military relations, the mature answer describes the constitutional position and the role each institution is meant to play, without editorialising about individuals.',
    facts: [
      { label: 'Form of state', value: 'Federal parliamentary republic' },
      { label: 'Parliament', value: 'Bicameral — National Assembly and Senate' },
      { label: 'National Assembly', value: 'Directly elected, five-year term' },
      {
        label: 'Senate',
        value: 'Provinces equally represented, six-year terms, half elected every three years',
      },
      { label: 'Head of state', value: 'The President, elected by an electoral college' },
      { label: 'Head of government', value: 'The Prime Minister' },
      { label: 'Highest court', value: 'The Supreme Court of Pakistan' },
      { label: 'Provincial courts', value: 'A High Court in each province' },
      { label: 'Elections run by', value: 'The Election Commission of Pakistan' },
      { label: 'Federal units', value: 'Four provinces and the Islamabad Capital Territory' },
    ],
    points: [
      {
        heading: 'The legislature',
        bullets: [
          'The National Assembly is elected directly and is where a government must command a majority.',
          "The Senate gives every province equal representation regardless of population, which is the federation's main safeguard for the smaller provinces.",
          'A money bill originates in the National Assembly; most other legislation must pass both houses.',
        ],
      },
      {
        heading: 'Executive and judiciary',
        bullets: [
          "The Prime Minister and cabinet are responsible to the National Assembly; the President's role is largely ceremonial under the present constitution.",
          'Each province has its own assembly, chief minister and governor, with subjects devolved substantially after the Eighteenth Amendment.',
          'The judiciary runs from the district courts through the High Courts to the Supreme Court, with the Federal Shariat Court on questions of conformity with Islamic injunctions.',
        ],
      },
      {
        heading: 'The permanent state',
        bullets: [
          'The civil service is recruited through the Central Superior Services examination conducted by the Federal Public Service Commission.',
          'The Election Commission is a constitutional body responsible for the electoral rolls, delimitation and the conduct of elections.',
          'Caretaker governments administer the country between the dissolution of an assembly and a general election.',
        ],
      },
    ],
  },

  {
    slug: 'provinces-of-pakistan',
    kind: 'gk',
    section: 'pakistan',
    titleEn: 'The provinces and territories',
    titleUr: 'صوبے اور علاقے',
    summaryEn:
      'The four provinces, their capitals and what each is known for, together with the Islamabad Capital Territory, Azad Jammu and Kashmir, and Gilgit-Baltistan.',
    issbAngle:
      'Candidates are often asked about their own province, and then about one they have never visited. Knowing one distinguishing fact about each — a crop, an industry, a range, a port — is enough to answer well.',
    facts: [
      { label: 'Punjab capital', value: 'Lahore' },
      { label: 'Sindh capital', value: 'Karachi' },
      { label: 'Khyber Pakhtunkhwa capital', value: 'Peshawar' },
      { label: 'Balochistan capital', value: 'Quetta' },
      { label: 'Largest province by area', value: 'Balochistan' },
      { label: 'Largest province by population', value: 'Punjab' },
      { label: 'Azad Jammu and Kashmir capital', value: 'Muzaffarabad' },
      { label: 'Gilgit-Baltistan capital', value: 'Gilgit' },
      { label: 'Federal capital', value: 'Islamabad' },
      { label: 'KP merger with tribal districts', value: 'Twenty-fifth Amendment, 2018' },
    ],
    points: [
      {
        heading: 'What each is known for',
        bullets: [
          'Punjab — the agricultural heartland and the most populous province, with the canal system that feeds most of the country.',
          'Sindh — Karachi, the largest city and the main port, alongside the lower Indus and its long history.',
          'Khyber Pakhtunkhwa — the frontier with Afghanistan, the Khyber Pass, and the districts merged into the province in 2018.',
          'Balochistan — the largest province by area and the least populous, with Gwadar, substantial mineral and gas resources including Sui, and long-running development challenges.',
        ],
      },
      {
        heading: 'The other units',
        bullets: [
          'Azad Jammu and Kashmir has its own president, prime minister and legislative assembly.',
          'Gilgit-Baltistan has an elected assembly and borders China at the Khunjerab Pass.',
          'Islamabad Capital Territory is administered federally.',
        ],
      },
    ],
  },

  {
    slug: 'pakistan-economy',
    kind: 'gk',
    section: 'pakistan',
    titleEn: "Pakistan's economy",
    titleUr: 'پاکستان کی معیشت',
    summaryEn:
      'The structure of the economy — what it grows, what it exports, where its foreign exchange comes from, and the recurring problems that bring it back to the IMF.',
    issbAngle:
      'One of the commonest interview subjects, and one where balance matters. Name the structural problem — a narrow export base and a narrow tax base — rather than blaming a government, and offer one thing you would do about it.',
    facts: [
      { label: 'Main crops', value: 'Wheat, cotton, rice, sugarcane, maize' },
      { label: 'Largest export sector', value: 'Textiles' },
      { label: 'Major foreign exchange source', value: 'Remittances from overseas Pakistanis' },
      { label: 'Central bank', value: 'State Bank of Pakistan' },
      { label: 'Tax authority', value: 'Federal Board of Revenue' },
      { label: 'Fiscal year', value: '1 July to 30 June' },
      { label: 'Main ports', value: 'Karachi, Port Qasim and Gwadar' },
      { label: 'Largest gas field', value: 'Sui, in Balochistan' },
      { label: 'Major dams', value: 'Tarbela and Mangla' },
    ],
    points: [
      {
        heading: 'What the economy rests on',
        bullets: [
          'Agriculture employs a large share of the workforce and supplies the raw cotton that the textile industry depends on.',
          'Textiles dominate exports, which leaves earnings exposed to one sector and one set of buyers.',
          'Remittances from Pakistanis working abroad are among the largest single sources of foreign exchange.',
        ],
      },
      {
        heading: 'The recurring problems',
        bullets: [
          'A narrow tax base means revenue does not cover expenditure, so the state borrows persistently.',
          'Imports of energy and machinery exceed exports, producing current account deficits and pressure on reserves.',
          'Circular debt in the power sector and losses in state-owned enterprises absorb money that would otherwise fund development.',
          'Pakistan has entered IMF programmes repeatedly; the pattern of stabilisation followed by relapse is the thing worth being able to explain.',
        ],
      },
      {
        heading: 'What could change it',
        bullets: [
          'Broadening exports beyond textiles, particularly into information technology services, which has grown from a small base.',
          'Widening the tax net rather than raising rates on those already paying.',
          'Investment in water storage and energy, where shortages cap what industry can produce.',
        ],
      },
    ],
  },

  {
    slug: 'pakistan-foreign-relations',
    kind: 'gk',
    section: 'pakistan',
    titleEn: "Pakistan's foreign relations",
    titleUr: 'پاکستان کے خارجہ تعلقات',
    summaryEn:
      "The relationships that shape Pakistan's external position — China, the United States, the Gulf states, India, Afghanistan and Iran — and the principles the country states as the basis of its policy.",
    issbAngle:
      'Answer as a future officer, not a commentator. Describe each relationship by what it is for, acknowledge the difficulties honestly, and avoid hostile language about any country — including India.',
    facts: [
      { label: 'Closest strategic partner', value: 'China' },
      { label: 'Flagship project with China', value: 'China–Pakistan Economic Corridor' },
      { label: 'Border with Afghanistan', value: 'The Durand Line' },
      { label: 'Largest source of remittances', value: 'The Gulf states' },
      { label: 'Core dispute with India', value: 'Jammu and Kashmir' },
      { label: 'Bilateral framework with India', value: 'The Simla Agreement, 1972' },
      { label: 'Water treaty with India', value: 'The Indus Waters Treaty, 1960' },
      { label: 'Main multilateral forums', value: 'United Nations, OIC, SCO, ECO' },
    ],
    points: [
      {
        heading: 'China',
        bullets: [
          'The relationship dates from the 1960s and covers defence, infrastructure and diplomacy.',
          'CPEC is its economic centrepiece, linking Kashgar to Gwadar through road, rail and energy projects.',
          'It gives Pakistan an alternative to Western financing, and ties a large share of its external debt to one partner.',
        ],
      },
      {
        heading: 'The United States and the Gulf',
        bullets: [
          'Relations with the United States have alternated between close alignment and estrangement, driven mostly by Afghanistan.',
          'Saudi Arabia and the United Arab Emirates matter for financial support and because millions of Pakistanis work there.',
        ],
      },
      {
        heading: 'The neighbourhood',
        bullets: [
          'With India, the relationship is defined by Kashmir, by the 1972 Simla framework for bilateral settlement, and by the Indus Waters Treaty which has survived every conflict since 1960.',
          'With Afghanistan, the questions are the Durand Line, refugees and cross-border militancy.',
          'With Iran, a long shared border, energy possibilities and periodic security friction.',
        ],
      },
    ],
  },

  {
    slug: 'kashmir-issue',
    kind: 'gk',
    section: 'pakistan',
    titleEn: 'The Kashmir issue',
    titleUr: 'مسئلہ کشمیر',
    summaryEn:
      'The dispute over Jammu and Kashmir since 1947 — how it began, the United Nations resolutions, the Line of Control, and the positions the parties take. This is the single most likely foreign-policy question at a board.',
    issbAngle:
      "Be accurate and be measured. State the historical position and Pakistan's stated stance, acknowledge that the people of the region are the subject of the dispute, and do not use inflammatory language. A board is testing judgement under provocation as much as knowledge.",
    facts: [
      { label: 'Dispute began', value: '1947, over accession at partition' },
      { label: 'First war', value: '1947–48' },
      { label: 'Ceasefire', value: '1 January 1949, under United Nations auspices' },
      { label: 'Ceasefire line agreed at', value: 'Karachi, 1949' },
      { label: 'Line of Control established by', value: 'The Simla Agreement, 1972' },
      {
        label: "Pakistan's stated position",
        value: 'Settlement through a UN-supervised plebiscite',
      },
      { label: "India's stated position", value: 'A bilateral matter under the Simla Agreement' },
      {
        label: 'Indian action in 2019',
        value: 'Revocation of the special status of Jammu and Kashmir',
      },
      { label: 'Pakistani-administered areas', value: 'Azad Jammu and Kashmir; Gilgit-Baltistan' },
    ],
    points: [
      {
        heading: 'How it began',
        bullets: [
          'At partition the princely states chose which dominion to join; Jammu and Kashmir had a Muslim-majority population and a Hindu ruler, and its accession was contested.',
          'Fighting in 1947–48 ended in a United Nations ceasefire, leaving the state divided along a ceasefire line.',
          'Security Council resolutions of that period referred to a plebiscite to determine the wishes of the people, which has never been held.',
        ],
      },
      {
        heading: 'Since then',
        bullets: [
          'The 1972 Simla Agreement converted the ceasefire line into the Line of Control and committed both sides to bilateral settlement.',
          'The dispute has contributed to wars in 1965 and 1999 and to recurring exchanges along the Line of Control.',
          'India revoked the special constitutional status of the territory it administers in 2019; Pakistan rejected the step and raised it internationally.',
        ],
      },
      {
        heading: 'How to discuss it',
        bullets: [
          'Separate the three things: the legal question of accession, the humanitarian question of the population, and the strategic question between two nuclear-armed states.',
          'It is entirely acceptable to say a settlement must account for what the people of the region want.',
          'Avoid predicting outcomes or advocating force; neither adds anything to an answer and both count against you.',
        ],
      },
    ],
    timeline: [
      { date: '1947', event: 'The accession of Jammu and Kashmir is contested at partition.' },
      { date: '1949', event: 'A United Nations ceasefire ends the first war.' },
      { date: '1965', event: 'The second war is fought partly over Kashmir.' },
      { date: '1972', event: 'The Simla Agreement establishes the Line of Control.' },
      { date: '1999', event: 'The Kargil conflict is fought along the Line of Control.' },
      { date: '2019', event: 'India revokes the special status of the territory it administers.' },
    ],
  },

  {
    slug: 'cpec',
    kind: 'gk',
    section: 'pakistan',
    titleEn: 'The China–Pakistan Economic Corridor',
    titleUr: 'پاک چین اقتصادی راہداری',
    summaryEn:
      'A programme of road, rail, energy and port projects connecting Kashgar in western China to Gwadar on the Arabian Sea, and the flagship of the relationship with China.',
    issbAngle:
      'Expect both the opportunity and the criticism. A strong answer names a concrete benefit — power added to the grid, or a road built — and acknowledges the debt and transparency concerns rather than dismissing them.',
    facts: [
      { label: 'Announced', value: '2015' },
      { label: 'Connects', value: 'Kashgar in Xinjiang to Gwadar in Balochistan' },
      { label: 'Part of', value: "China's Belt and Road Initiative" },
      { label: 'Southern terminus', value: 'Gwadar port' },
      {
        label: 'Main components',
        value: 'Energy projects, road and rail, Gwadar port, special economic zones',
      },
      { label: 'Key highway', value: 'The Karakoram Highway, through the Khunjerab Pass' },
    ],
    points: [
      {
        heading: 'What it consists of',
        bullets: [
          'Energy projects, mostly power generation, which addressed the shortfalls that were cutting industrial output in the early 2010s.',
          'Transport infrastructure — motorways and the upgrading of the main railway line — intended to shorten the route from the north to the coast.',
          'Development of Gwadar as a deep-water port, and special economic zones intended to attract manufacturing.',
        ],
      },
      {
        heading: 'The arguments',
        bullets: [
          'For Pakistan: investment at a scale not otherwise available, and infrastructure that removes long-standing constraints on growth.',
          'For China: an overland route to the Arabian Sea that reduces dependence on the Strait of Malacca.',
          'Against: the debt burden, the terms of some agreements, limited transfer of skills, and security costs in Balochistan.',
        ],
      },
    ],
  },

  {
    slug: 'indus-waters-treaty',
    kind: 'gk',
    section: 'pakistan',
    titleEn: 'The Indus Waters Treaty',
    titleUr: 'سندھ طاس معاہدہ',
    summaryEn:
      'The 1960 agreement dividing the rivers of the Indus basin between Pakistan and India, brokered by the World Bank. It has survived every conflict between the two states since.',
    issbAngle:
      'A good example when asked whether anything works between Pakistan and India. Name the three western and three eastern rivers, and note that the treaty has outlasted three wars — that is the point worth making.',
    facts: [
      { label: 'Signed', value: '1960' },
      { label: 'Brokered by', value: 'The World Bank' },
      { label: 'Western rivers to Pakistan', value: 'Indus, Jhelum, Chenab' },
      { label: 'Eastern rivers to India', value: 'Ravi, Beas, Sutlej' },
      { label: 'Dispute mechanism', value: 'Neutral expert, then a court of arbitration' },
      { label: 'Signed by', value: 'President Ayub Khan and Prime Minister Nehru' },
    ],
    points: [
      {
        heading: 'What it does',
        bullets: [
          'Allocates the three western rivers to Pakistan and the three eastern rivers to India, with limited permitted uses on each side.',
          'India may use the western rivers for non-consumptive purposes such as run-of-river hydropower, within specified design limits.',
          'A Permanent Indus Commission meets regularly, and disputes escalate to a neutral expert or arbitration.',
        ],
      },
      {
        heading: 'Why it matters',
        bullets: [
          'Pakistani agriculture depends almost entirely on this one river system, so the treaty is a matter of national survival rather than convenience.',
          'It has held through the wars of 1965 and 1971 and the Kargil conflict, which is unusual for any agreement between hostile neighbours.',
          "Disputes over specific Indian hydropower projects have gone to the treaty's own mechanisms rather than breaking it.",
        ],
      },
    ],
  },

  {
    slug: 'chaudhry-rahmat-ali',
    kind: 'gk',
    section: 'personalities',
    titleEn: 'Chaudhry Rahmat Ali',
    titleUr: 'چوہدری رحمت علی',
    summaryEn:
      'The student at Cambridge who coined the name Pakistan in a 1933 pamphlet, years before the demand for a separate state became Muslim League policy.',
    issbAngle:
      'Worth knowing because the name itself is often asked about. Be able to explain what the letters stood for and that the name preceded the political demand rather than following it.',
    facts: [
      { label: 'Born', value: '1897, in Hoshiarpur district' },
      { label: 'Died', value: '1951, in Cambridge' },
      { label: 'Pamphlet', value: 'Now or Never, 1933' },
      { label: 'Wrote it at', value: 'Cambridge' },
      {
        label: 'Letters of the name',
        value: 'Punjab, Afghania, Kashmir, Sindh and the last syllable of Balochistan',
      },
    ],
    points: [
      {
        heading: 'The name',
        bullets: [
          'His 1933 pamphlet Now or Never proposed a separate homeland and gave it the name Pakistan.',
          'The letters were drawn from the Muslim-majority regions of the north-west, and the word also carries the sense of a land of the pure.',
          'The Muslim League did not adopt the demand until the Lahore Resolution seven years later, and adopted the name later still.',
        ],
      },
    ],
  },

  {
    slug: 'abdul-sattar-edhi',
    kind: 'gk',
    section: 'personalities',
    titleEn: 'Abdul Sattar Edhi',
    titleUr: 'عبدالستار ایدھی',
    summaryEn:
      'The founder of the Edhi Foundation, which built the largest volunteer ambulance service in the country from a single room in Karachi, alongside orphanages, shelters and clinics.',
    issbAngle:
      'One of the best answers available to "who do you admire and why", because the qualities are concrete: service without publicity, personal austerity, and treating everyone alike regardless of faith or background.',
    facts: [
      { label: 'Born', value: '1928' },
      { label: 'Died', value: '8 July 2016, Karachi' },
      { label: 'Founded', value: 'The Edhi Foundation' },
      { label: 'Known for', value: 'The largest volunteer ambulance network in Pakistan' },
      { label: 'Also ran', value: 'Orphanages, shelters, clinics and homes for the destitute' },
      { label: 'Wife and co-worker', value: 'Bilquis Edhi' },
    ],
    points: [
      {
        heading: 'Why he is cited',
        bullets: [
          'Started with one room and a single ambulance in Karachi and built a national network funded almost entirely by small public donations.',
          'Lived on very little himself and refused to take a salary from the foundation.',
          'Treated everyone who came to him without regard to religion, ethnicity or ability to pay, which is the point most worth making about him.',
        ],
      },
    ],
  },
]
