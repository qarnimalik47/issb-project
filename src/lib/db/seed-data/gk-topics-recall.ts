/**
 * Straight-recall topics: the firsts, the dates, the abbreviations and the
 * places that fill a general knowledge paper.
 *
 * These are the questions answered in two seconds or not at all, which is why
 * they make the best flashcards in the library — every fact here has one short
 * checkable answer.
 */
import type { CuratedTopic } from '../../gk/topics'

export const RECALL_TOPICS: CuratedTopic[] = [
  {
    slug: 'firsts-of-pakistan',
    kind: 'gk',
    section: 'pakistan',
    titleEn: 'Firsts of Pakistan',
    titleUr: 'پاکستان میں پہلی مرتبہ',
    summaryEn:
      'Who held each office first, and the other firsts that recur in general knowledge papers. Offices held by living people are deliberately left out — those change, and a stale answer is worse than none.',
    issbAngle:
      'Rapid-fire recall. Answer in two seconds or say you do not recall; hesitating while you work it out looks worse than either.',
    facts: [
      { label: 'First Governor-General', value: 'Quaid-e-Azam Muhammad Ali Jinnah' },
      { label: 'First Prime Minister', value: 'Liaquat Ali Khan' },
      { label: 'First President', value: 'Iskander Mirza' },
      { label: 'First Foreign Minister', value: 'Sir Zafrullah Khan' },
      { label: 'First Speaker of the Constituent Assembly', value: 'Maulvi Tamizuddin Khan' },
      { label: 'First Chief Justice', value: 'Sir Abdul Rashid' },
      {
        label: 'First Pakistani Commander-in-Chief of the Army',
        value: 'General Muhammad Ayub Khan',
      },
      { label: 'First woman Prime Minister', value: 'Benazir Bhutto, 1988' },
      { label: 'First capital', value: 'Karachi' },
      { label: 'First Nobel laureate', value: 'Dr Abdus Salam, Physics, 1979' },
      { label: 'First satellite', value: 'Badr-1, 1990' },
      { label: 'First nuclear tests', value: '28 May 1998' },
      { label: 'First Olympic gold', value: 'Hockey, Rome 1960' },
      { label: 'First individual Olympic gold', value: 'Arshad Nadeem, javelin, Paris 2024' },
      { label: 'First Pakistani to climb Everest', value: 'Nazir Sabir, 2000' },
      { label: 'First Pakistani woman to climb Everest', value: 'Samina Baig, 2013' },
    ],
    points: [
      {
        heading: 'A caution about this kind of question',
        bullets: [
          'Anything of the form "who is the current…" changes without notice; check it the week before your board rather than trusting a printed list.',
          'The firsts above are fixed historical facts and will not change, which is why they are worth committing to memory.',
        ],
      },
    ],
  },

  {
    slug: 'important-days',
    kind: 'gk',
    section: 'pakistan',
    titleEn: 'Important days',
    titleUr: 'اہم ایام',
    summaryEn:
      'National observances and the international days most often asked about, with what each commemorates.',
    issbAngle:
      'Know the national dates cold — a candidate for a commission who cannot place Defence Day has a problem no other answer will repair.',
    facts: [
      { label: 'Kashmir Solidarity Day', value: '5 February' },
      { label: 'Pakistan Day', value: '23 March' },
      { label: 'Youm-e-Takbir', value: '28 May' },
      { label: 'Independence Day', value: '14 August' },
      { label: 'Defence Day', value: '6 September' },
      { label: 'Air Force Day', value: '7 September' },
      { label: 'Navy Day', value: '8 September' },
      { label: 'Death anniversary of the Quaid', value: '11 September' },
      { label: 'Iqbal Day', value: '9 November' },
      { label: 'Quaid-e-Azam Day', value: '25 December' },
      { label: "International Women's Day", value: '8 March' },
      { label: 'World Health Day', value: '7 April' },
      { label: 'Earth Day', value: '22 April' },
      { label: 'Labour Day', value: '1 May' },
      { label: 'World Environment Day', value: '5 June' },
      { label: 'International Literacy Day', value: '8 September' },
      { label: 'International Day of Peace', value: '21 September' },
      { label: 'World Food Day', value: '16 October' },
      { label: 'United Nations Day', value: '24 October' },
      { label: 'Human Rights Day', value: '10 December' },
    ],
    points: [
      {
        heading: 'What the national dates mark',
        bullets: [
          '23 March marks the Lahore Resolution of 1940 and the adoption of the first constitution in 1956.',
          '6 September marks the defence of Lahore and Sialkot in 1965; the Air Force and Navy days follow it.',
          '28 May marks the nuclear tests at Chagai in 1998.',
          '5 February is observed in solidarity with the people of Kashmir.',
        ],
      },
    ],
  },

  {
    slug: 'abbreviations',
    kind: 'gk',
    section: 'pakistan',
    titleEn: 'Abbreviations worth knowing',
    titleUr: 'اہم مخففات',
    summaryEn:
      'The acronyms that appear in general knowledge papers and in any serious discussion of national affairs — national institutions first, then international bodies.',
    issbAngle:
      'These are used casually in interviews. Being asked what NAB or FATF stands for is really being asked whether you follow national affairs at all.',
    facts: [
      { label: 'ISPR', value: 'Inter Services Public Relations' },
      { label: 'ISI', value: 'Inter-Services Intelligence' },
      { label: 'GHQ', value: 'General Headquarters' },
      { label: 'PMA', value: 'Pakistan Military Academy' },
      { label: 'PAF', value: 'Pakistan Air Force' },
      { label: 'PAEC', value: 'Pakistan Atomic Energy Commission' },
      { label: 'SUPARCO', value: 'Space and Upper Atmosphere Research Commission' },
      { label: 'KRL', value: 'Khan Research Laboratories' },
      { label: 'NADRA', value: 'National Database and Registration Authority' },
      { label: 'NAB', value: 'National Accountability Bureau' },
      { label: 'FIA', value: 'Federal Investigation Agency' },
      { label: 'FBR', value: 'Federal Board of Revenue' },
      { label: 'SBP', value: 'State Bank of Pakistan' },
      { label: 'WAPDA', value: 'Water and Power Development Authority' },
      { label: 'HEC', value: 'Higher Education Commission' },
      { label: 'NDMA', value: 'National Disaster Management Authority' },
      { label: 'CSS', value: 'Central Superior Services' },
      { label: 'FPSC', value: 'Federal Public Service Commission' },
      { label: 'CPEC', value: 'China–Pakistan Economic Corridor' },
      { label: 'LoC', value: 'Line of Control' },
      { label: 'UNO', value: 'United Nations Organization' },
      {
        label: 'UNESCO',
        value: 'United Nations Educational, Scientific and Cultural Organization',
      },
      { label: 'UNICEF', value: "United Nations Children's Fund" },
      { label: 'WHO', value: 'World Health Organization' },
      { label: 'IMF', value: 'International Monetary Fund' },
      { label: 'WTO', value: 'World Trade Organization' },
      { label: 'FATF', value: 'Financial Action Task Force' },
      { label: 'NATO', value: 'North Atlantic Treaty Organization' },
      { label: 'OIC', value: 'Organisation of Islamic Cooperation' },
      { label: 'SAARC', value: 'South Asian Association for Regional Cooperation' },
      { label: 'SCO', value: 'Shanghai Cooperation Organisation' },
      { label: 'ECO', value: 'Economic Cooperation Organization' },
      { label: 'ICJ', value: 'International Court of Justice' },
      { label: 'IAEA', value: 'International Atomic Energy Agency' },
    ],
    points: [
      {
        heading: 'How to use this',
        bullets: [
          'Learn what the body does alongside what the letters stand for — being told FATF is the Financial Action Task Force means nothing without knowing it assesses countries on money laundering and terrorist financing.',
        ],
      },
    ],
  },

  {
    slug: 'landmarks-and-heritage',
    kind: 'gk',
    section: 'geography',
    titleEn: 'Landmarks and heritage of Pakistan',
    titleUr: 'پاکستان کے تاریخی مقامات',
    summaryEn:
      'The monuments, archaeological sites and natural landmarks most often asked about, including the World Heritage Sites.',
    issbAngle:
      'Often used to open a conversation about where you are from. Knowing one site near your home town well — who built it, when and why — makes a far better answer than listing six you have never seen.',
    facts: [
      { label: 'Minar-e-Pakistan', value: 'Lahore, on the site of the 1940 Lahore Resolution' },
      { label: 'Badshahi Mosque', value: 'Lahore, built under Aurangzeb, 1673' },
      { label: 'Faisal Mosque', value: 'Islamabad, designed by Vedat Dalokay' },
      { label: 'Mazar-e-Quaid', value: 'Karachi' },
      { label: 'Mohenjo-daro', value: 'Sindh — Indus Valley civilisation' },
      { label: 'Harappa', value: 'Punjab — Indus Valley civilisation' },
      { label: 'Taxila', value: 'Punjab — Gandhara civilisation' },
      { label: 'Takht-i-Bahi', value: 'Khyber Pakhtunkhwa — Buddhist monastery' },
      { label: 'Rohtas Fort', value: 'Built by Sher Shah Suri' },
      { label: 'Makli Necropolis', value: 'Thatta, Sindh' },
      { label: 'Khewra', value: 'One of the largest salt mines in the world' },
      { label: 'Khunjerab Pass', value: 'The border crossing into China' },
      { label: 'Deosai', value: 'High plateau in Gilgit-Baltistan' },
    ],
    points: [
      {
        heading: 'World Heritage Sites',
        bullets: [
          'Mohenjo-daro, in Sindh, from the Indus Valley civilisation.',
          'Taxila, a centre of the Gandhara civilisation.',
          'Takht-i-Bahi and the neighbouring remains at Sahr-i-Bahlol.',
          'Lahore Fort and the Shalimar Gardens.',
          'Rohtas Fort, built by Sher Shah Suri.',
          'The historical monuments at Makli, Thatta.',
        ],
      },
      {
        heading: 'Civilisations to place',
        bullets: [
          'The Indus Valley civilisation — Mohenjo-daro and Harappa — is among the oldest urban civilisations known, with planned streets and drainage.',
          'The Gandhara civilisation centred on Taxila and the Peshawar valley and produced a distinctive Buddhist sculpture.',
          'Both are Pakistani heritage, and a candidate who can say so confidently is answering a question about identity as much as history.',
        ],
      },
    ],
  },

  {
    slug: 'capitals-and-currencies',
    kind: 'gk',
    section: 'world',
    titleEn: 'Capitals and currencies',
    titleUr: 'دارالحکومت اور کرنسیاں',
    summaryEn:
      'The countries that come up most often in general knowledge papers, with their capitals and currencies — neighbours first, then the states Pakistan deals with regularly.',
    issbAngle:
      'Start with the neighbourhood. Not knowing the capital of Afghanistan or the currency of Saudi Arabia is the kind of gap a board remembers.',
    facts: [
      { label: 'Afghanistan', value: 'Kabul — Afghan afghani' },
      { label: 'India', value: 'New Delhi — Indian rupee' },
      { label: 'China', value: 'Beijing — yuan renminbi' },
      { label: 'Iran', value: 'Tehran — Iranian rial' },
      { label: 'Bangladesh', value: 'Dhaka — taka' },
      { label: 'Sri Lanka', value: 'Sri Jayawardenepura Kotte — Sri Lankan rupee' },
      { label: 'Nepal', value: 'Kathmandu — Nepalese rupee' },
      { label: 'Saudi Arabia', value: 'Riyadh — Saudi riyal' },
      { label: 'United Arab Emirates', value: 'Abu Dhabi — dirham' },
      { label: 'Turkiye', value: 'Ankara — Turkish lira' },
      { label: 'Qatar', value: 'Doha — Qatari riyal' },
      { label: 'Russia', value: 'Moscow — rouble' },
      { label: 'United States', value: 'Washington DC — US dollar' },
      { label: 'United Kingdom', value: 'London — pound sterling' },
      { label: 'Japan', value: 'Tokyo — yen' },
      { label: 'Indonesia', value: 'Jakarta — rupiah' },
      { label: 'Malaysia', value: 'Kuala Lumpur — ringgit' },
      { label: 'Egypt', value: 'Cairo — Egyptian pound' },
      { label: 'South Africa', value: 'Pretoria is the administrative capital — rand' },
      { label: 'Australia', value: 'Canberra — Australian dollar' },
    ],
    points: [
      {
        heading: 'Traps in this kind of question',
        bullets: [
          'The largest city is often not the capital — Karachi, Istanbul, Sydney, New York and Mumbai are all examples.',
          'South Africa has three capitals for different branches of government; Pretoria is the administrative one.',
          "Several countries use a currency called the rupee or the riyal; say which country's when you answer.",
        ],
      },
    ],
  },
]
