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
      { label: 'United Nations headquarters', value: 'New York' },
      { label: 'WHO headquarters', value: 'Geneva' },
      { label: 'WTO and ILO headquarters', value: 'Geneva' },
      { label: 'UNESCO headquarters', value: 'Paris' },
      { label: 'FAO headquarters', value: 'Rome' },
      { label: 'IAEA headquarters', value: 'Vienna' },
      { label: 'UNICEF headquarters', value: 'New York' },
      { label: 'IMF and World Bank headquarters', value: 'Washington DC' },
      { label: 'Interpol headquarters', value: 'Lyon, France' },
      { label: 'International Court of Justice', value: 'The Hague' },
      { label: 'BRICS', value: 'Brazil, Russia, India, China and South Africa at the outset' },
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
      { label: 'Dover Strait', value: 'English Channel to the North Sea' },
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
      { label: 'First Hockey World Cup', value: 'Won by Pakistan in 1971' },
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
          'Pakistan won the first Hockey World Cup in 1971 and has won it four times in all, which stood as the outright record for decades. Germany drew level on four titles at the 2026 tournament, hosted jointly by the Netherlands and Belgium.',
          "Jahangir Khan's unbeaten run in squash through the 1980s is among the longest winning streaks in any professional sport.",
          "Arshad Nadeem's javelin gold at Paris 2024 was Pakistan's first Olympic gold in an individual event.",
        ],
      },
    ],
  },

  {
    slug: 'world-landmarks-and-towers',
    kind: 'gk',
    section: 'world',
    titleEn: 'Landmarks and towers of the world',
    titleUr: 'دنیا کی مشہور عمارتیں',
    summaryEn:
      'Which famous structure stands in which city — the towers, the monuments and the wonders that fill the recall half of a general knowledge paper.',
    issbAngle:
      'Pure recall, and the only sensible preparation is to learn them by city rather than by name. If you are unsure, give the country rather than guessing a city; being approximately right is better than being confidently wrong.',
    facts: [
      { label: 'Eiffel Tower', value: 'Paris, France' },
      { label: 'Leaning Tower of Pisa', value: 'Pisa, Italy' },
      { label: 'Petronas Towers', value: 'Kuala Lumpur, Malaysia' },
      {
        label: 'Burj Khalifa',
        value: 'Dubai, United Arab Emirates — the tallest building in the world',
      },
      { label: 'CN Tower', value: 'Toronto, Canada' },
      { label: 'Empire State Building', value: 'New York, United States' },
      { label: 'Ostankino Tower', value: 'Moscow, Russia' },
      { label: 'Space Needle', value: 'Seattle, United States' },
      { label: 'The Shard', value: 'London, United Kingdom' },
      { label: 'Sky Tower', value: 'Auckland, New Zealand' },
      { label: 'Skylon Tower', value: 'Niagara Falls, Canada' },
      { label: 'Macau Tower', value: 'Macau, China' },
      {
        label: 'Big Ben',
        value: 'London — the bell in the clock tower of the Palace of Westminster',
      },
      { label: 'Statue of Liberty', value: 'New York — a gift from France' },
      { label: 'Taj Mahal', value: 'Agra, India — built by Shah Jahan' },
      { label: 'Great Wall', value: 'China' },
      { label: 'Colosseum', value: 'Rome, Italy' },
      { label: 'Christ the Redeemer', value: 'Rio de Janeiro, Brazil' },
      { label: 'Pyramids of Giza', value: 'Egypt' },
      { label: 'Machu Picchu', value: 'Peru' },
      { label: 'Petra', value: 'Jordan' },
      { label: 'Masjid al-Haram', value: 'Makkah, Saudi Arabia' },
    ],
    points: [
      {
        heading: 'Towers and tall buildings',
        bullets: [
          'The Burj Khalifa in Dubai has been the tallest building in the world since 2010; the Petronas Towers in Kuala Lumpur held the title before it, and the Empire State Building for forty years before that.',
          'The Eiffel Tower was built for the Paris exposition of 1889 and was meant to be temporary.',
          'The Leaning Tower of Pisa is the bell tower of the cathedral; it began to lean during construction because of soft ground.',
          'Ostankino in Moscow and the CN Tower in Toronto are broadcasting towers rather than buildings, which is why they appear in a separate list of tallest structures.',
        ],
      },
      {
        heading: 'The seven wonders',
        bullets: [
          'The modern list, chosen by public vote in 2007, is the Great Wall of China, Petra, Christ the Redeemer, Machu Picchu, Chichen Itza, the Colosseum and the Taj Mahal.',
          'The Great Pyramid of Giza is the only surviving wonder of the ancient world and was given honorary standing on the modern list.',
          'Mohenjo-daro and Taxila are the Pakistani sites in the same class — both World Heritage Sites, and better ground for a candidate to talk about than a monument abroad.',
        ],
      },
    ],
  },

  {
    slug: 'climate-summits-and-cop',
    kind: 'gk',
    section: 'world',
    titleEn: 'Climate summits and the COP process',
    titleUr: 'موسمیاتی کانفرنسیں',
    summaryEn:
      'What COP stands for, the agreements the process has produced, where each recent conference was held and what it settled — with the part Pakistan played in the one that mattered most to it.',
    issbAngle:
      'This is where a candidate can show they follow international affairs rather than headlines. The strong answer joins two facts: Pakistan emits well under one per cent of global greenhouse gases and is among the countries worst exposed to the consequences. Make the point factually; grievance weakens it.',
    facts: [
      {
        label: 'COP stands for',
        value: 'Conference of the Parties to the UN Framework Convention on Climate Change',
      },
      { label: 'The convention was agreed at', value: 'The Earth Summit, Rio de Janeiro, 1992' },
      { label: 'Kyoto Protocol', value: '1997' },
      { label: 'Paris Agreement', value: 'COP21, Paris, 2015' },
      { label: 'Paris temperature goal', value: 'Well below 2°C, pursuing 1.5°C' },
      { label: 'COP26', value: 'Glasgow, United Kingdom, 2021' },
      { label: 'COP27', value: 'Sharm el-Sheikh, Egypt, 2022' },
      { label: 'COP28', value: 'Dubai, United Arab Emirates, 2023' },
      { label: 'COP29', value: 'Baku, Azerbaijan, 2024' },
      { label: 'COP30', value: 'Belém, Brazil, 2025' },
      { label: 'COP31', value: 'Antalya, Türkiye, November 2026' },
      { label: 'Loss and damage fund', value: 'Agreed at COP27 in 2022; set up at COP28 in 2023' },
      { label: 'Pakistan’s share of global emissions', value: 'Well under one per cent' },
      { label: 'IPCC', value: 'Intergovernmental Panel on Climate Change' },
    ],
    points: [
      {
        heading: 'How the process works',
        bullets: [
          'The framework convention agreed at Rio in 1992 commits its parties to preventing dangerous interference with the climate; the COP is the annual meeting of those parties, numbered in sequence since 1995.',
          'The Kyoto Protocol of 1997 bound developed countries to emissions targets; the Paris Agreement of 2015 replaced that with pledges each country sets for itself and reports against.',
          'The Paris goal is to hold warming well below two degrees above pre-industrial levels while pursuing a limit of one and a half, which is the figure now quoted everywhere.',
        ],
      },
      {
        heading: 'What the recent conferences settled',
        bullets: [
          'COP27 at Sharm el-Sheikh in 2022 agreed in principle to a fund for loss and damage — compensation for harm already done — after a long campaign by developing countries.',
          'COP28 at Dubai in 2023, presided over by Dr Sultan Al Jaber, set the fund up, completed the first global stocktake of progress under the Paris Agreement, and produced the first COP text calling for a transition away from fossil fuels.',
          'COP29 at Baku in 2024 was the finance conference: it agreed a new collective goal for climate funding to developing countries, which those countries said fell well short of the need.',
          'COP30 at Belém in 2025 was held at the edge of the Amazon and turned on forests and the credibility of the 1.5°C limit.',
        ],
      },
      {
        heading: 'Why this matters to Pakistan',
        bullets: [
          'Pakistan chaired the Group of 77 and China in 2022, the year a third of the country was under water, and used that position to force loss and damage onto the agenda at COP27. It is the clearest example of Pakistani diplomacy achieving something multilateral.',
          'The pledging conference in Geneva in January 2023 raised in the region of ten billion dollars for flood recovery, most of it in project loans rather than grants — a distinction worth making if you are asked whether the money arrived.',
          'The underlying facts do not change: glacier melt in the north, a monsoon that is becoming less predictable, and an economy in which agriculture still employs a large share of the workforce.',
        ],
      },
    ],
  },

  {
    slug: 'world-trade-and-economic-agreements',
    kind: 'gk',
    section: 'world',
    titleEn: 'World trade and economic agreements',
    titleUr: 'عالمی تجارت اور معاہدے',
    summaryEn:
      'The institutions that govern trade, the blocs and corridors announced in recent years, and the handful of commodity facts that general knowledge papers keep returning to.',
    issbAngle:
      'Do not try to hold thirty agreements in your head. Know what the WTO and the IMF each do, know the two or three arrangements Pakistan is actually part of, and be able to say in one sentence why a trade corridor is a strategic object as much as an economic one.',
    facts: [
      { label: 'WTO founded', value: '1995, succeeding the GATT of 1947' },
      { label: 'WTO headquarters', value: 'Geneva' },
      { label: 'IMF and World Bank headquarters', value: 'Washington DC' },
      { label: 'RCEP', value: 'Signed 2020, in force 2022 — the largest bloc by population' },
      { label: 'CPTPP', value: 'Eleven Pacific economies; the United Kingdom acceded in 2023' },
      { label: 'AfCFTA', value: 'African Continental Free Trade Area, trading since 2021' },
      {
        label: 'EU–Mercosur',
        value: 'Concluded in December 2024 after some twenty-five years of talks',
      },
      {
        label: 'India–EFTA agreement',
        value: 'Signed March 2024, with a large investment commitment',
      },
      {
        label: 'IMEC',
        value: 'India–Middle East–Europe Economic Corridor, announced at the G20 in Delhi, 2023',
      },
      {
        label: 'BRICS expansion',
        value: 'Egypt, Ethiopia, Iran and the UAE joined from January 2024',
      },
      {
        label: 'Pakistan–China free trade agreement',
        value: 'Phase II in effect since the end of 2019',
      },
      { label: 'Pakistan’s largest export sector', value: 'Textiles' },
      { label: 'Largest sugar producer', value: 'Brazil' },
      { label: 'Largest sugar consumer', value: 'India' },
      { label: 'Pakistan in sugar', value: 'Among the top ten producers and consumers' },
      { label: 'Largest wheat producer', value: 'China' },
      { label: 'Largest rice exporter', value: 'India' },
      { label: 'Largest crude oil exporter', value: 'Saudi Arabia' },
    ],
    points: [
      {
        heading: 'The system',
        bullets: [
          'The World Trade Organization sets and enforces the rules of trade between its members; the GATT it replaced in 1995 was an agreement rather than an organisation.',
          'The IMF lends to countries in balance-of-payments difficulty against conditions; the World Bank lends for development projects. Confusing the two is a common and avoidable error.',
          'Regional agreements sit beneath all of this: RCEP across the Asia-Pacific, the CPTPP around the Pacific rim, the AfCFTA across Africa, and the European single market as the deepest of them.',
        ],
      },
      {
        heading: 'Agreements worth recognising',
        bullets: [
          'The United Kingdom acceded to the CPTPP in 2023, the first new member and the first from outside the Pacific.',
          'IMEC, announced at the G20 summit in Delhi in 2023, proposes a rail and shipping corridor from India through the Gulf to Europe. It is usually discussed as a competitor to the Belt and Road.',
          'BRICS took in Egypt, Ethiopia, Iran and the United Arab Emirates from January 2024, and its members have talked about settling more trade in their own currencies.',
          'The European Union and Mercosur concluded their agreement in December 2024 after a quarter of a century of negotiation — the standard example of how long a large trade deal can take.',
        ],
      },
      {
        heading: 'Where Pakistan fits',
        bullets: [
          'The free trade agreement with China, in its second phase since the end of 2019, is the largest Pakistan has; the persistent question is how much of the tariff access has actually been used.',
          'The Gulf states matter for remittances and for investment rather than for exports, and remittances are one of the largest single inflows in the balance of payments.',
          'Exports remain concentrated in textiles, which ties the whole trade position to cotton, energy prices and one set of buyers — the structural point behind almost every economic question at a board.',
        ],
      },
    ],
  },

  {
    slug: 'suparco-and-the-space-programme',
    kind: 'gk',
    section: 'science',
    titleEn: 'SUPARCO and the space programme',
    titleUr: 'سپارکو اور خلائی پروگرام',
    summaryEn:
      'Pakistan’s space agency: when it was founded and by whom, the first rocket and the first satellite, and what the programme does now.',
    issbAngle:
      'Worth knowing properly because it is one of the few science questions tied directly to the country. The detail that lands is 1962: Pakistan launched a sounding rocket a year after founding the agency, and was among the first states in Asia to do so.',
    facts: [
      { label: 'Full name', value: 'Space and Upper Atmosphere Research Commission' },
      { label: 'Established', value: '16 September 1961' },
      { label: 'Established by', value: 'Executive order of President Ayub Khan' },
      { label: 'Founding figure', value: 'Dr Abdus Salam' },
      { label: 'Became a full commission', value: '1981' },
      { label: 'Headquarters', value: 'Islamabad; originally at Karachi' },
      { label: 'First rocket', value: 'Rehbar-I, launched 7 June 1962 from Sonmiani, Balochistan' },
      { label: 'Standing on that launch', value: 'Third in Asia and tenth in the world' },
      { label: 'First satellite', value: 'Badr-1, launched 16 July 1990 from Xichang, China' },
      { label: 'Second satellite', value: 'Badr-B, 2001' },
      { label: 'Communications satellite', value: 'PakSat-1R, 2011' },
      { label: 'Remote sensing satellite', value: 'PRSS-1, 2018' },
      { label: 'Civil nuclear counterpart', value: 'The Pakistan Atomic Energy Commission, 1956' },
    ],
    points: [
      {
        heading: 'How it began',
        bullets: [
          'Dr Abdus Salam, then adviser on science to the government, pressed for a space body and SUPARCO was created by executive order in September 1961 — one of the earliest such agencies in Asia.',
          'Rehbar-I, a sounding rocket launched from Sonmiani on the Balochistan coast in June 1962, carried instruments into the upper atmosphere and put Pakistan among the first ten countries to launch a rocket.',
          'It remained a committee under the Atomic Energy Commission until 1981, when it was reconstituted as a commission in its own right.',
        ],
      },
      {
        heading: 'Satellites',
        bullets: [
          'Badr-1, an experimental satellite launched from Xichang in China in 1990, was the first Pakistani satellite in orbit; Badr-B followed in 2001.',
          'PakSat-1R, launched in 2011, is the communications satellite carrying broadcasting and data traffic.',
          'PRSS-1, launched in 2018, is the remote-sensing satellite used for mapping, crop assessment and disaster response.',
        ],
      },
      {
        heading: 'What to say about it',
        bullets: [
          'The honest summary is that Pakistan started early and then moved slowly, while the resources went to the nuclear and missile programmes.',
          'Its present work is mostly applied: satellite imagery for agriculture and flood mapping, communications capacity, and ground-station support.',
          'Do not quote the current chairman or the latest launch date unless you have checked it that week — those change, and a board will know.',
        ],
      },
    ],
    timeline: [
      { date: '16 September 1961', event: 'SUPARCO is established by executive order.' },
      { date: '7 June 1962', event: 'Rehbar-I is launched from Sonmiani.' },
      { date: '1981', event: 'SUPARCO becomes an independent commission.' },
      { date: '16 July 1990', event: 'Badr-1, the first Pakistani satellite, reaches orbit.' },
      { date: '2011', event: 'PakSat-1R is launched.' },
      { date: '2018', event: 'PRSS-1 is launched.' },
    ],
  },
]
