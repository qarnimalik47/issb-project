/**
 * Defence topics — the material a selection board treats as home ground.
 *
 * Accuracy matters more here than anywhere else in the library: a candidate
 * who repeats a wrong figure at a board is worse off than one who says they do
 * not know. Where a published range or figure varies between sources, the text
 * says so rather than picking one and stating it flatly.
 */
import type { CuratedTopic } from '../../gk/topics'

export const DEFENCE_TOPICS: CuratedTopic[] = [
  {
    slug: 'the-issb-process',
    kind: 'gk',
    section: 'defence',
    titleEn: 'The ISSB process',
    titleUr: 'آئی ایس ایس بی کا طریقۂ کار',
    summaryEn:
      'The Inter Services Selection Board assesses candidates for commission in all three services over several days of intelligence tests, psychological tests, outdoor group tasks and an interview, ending in a conference of the whole board.',
    issbAngle:
      'Knowing the programme is not the same as being ready for it. The value of knowing it is that nothing surprises you on the day, so your attention goes on the task rather than on what happens next.',
    facts: [
      { label: 'Full name', value: 'Inter Services Selection Board' },
      { label: 'Assesses for', value: 'Pakistan Army, Pakistan Navy, Pakistan Air Force' },
      { label: 'Headquarters', value: 'Kohat' },
      { label: 'Other centres', value: 'Malir (Karachi), Gujranwala, Quetta' },
      { label: 'Typical duration', value: 'Four to five days, residential' },
      { label: 'First stage', value: 'Screening — intelligence tests' },
      { label: 'Assessors', value: 'Deputy President, psychologist and Group Testing Officer' },
      { label: 'Final stage', value: 'Conference of the board' },
    ],
    points: [
      {
        heading: 'Screening',
        bullets: [
          'The first day is a screening test: verbal and non-verbal intelligence, usually with a picture story or word association alongside it.',
          'Candidates who do not clear screening are sent home the same day; the rest stay on for the full programme.',
          'This stage is about speed and accuracy under time pressure, which is exactly what timed practice improves.',
        ],
      },
      {
        heading: 'The psychologist',
        bullets: [
          'Thematic Apperception Test — write a story about an ambiguous picture shown briefly.',
          'Word Association Test — write the first sentence that a word brings to mind, under a few seconds per word.',
          'Situation Reaction Test — say what you would do in a large number of everyday and emergency situations.',
          'Self description — write how your parents, teachers, friends and you yourself would describe you.',
          'The psychologist is looking for a consistent person across all four, which is why writing what you think they want to hear tends to fail.',
        ],
      },
      {
        heading: 'The Group Testing Officer',
        bullets: [
          'Outdoor and group work: group discussion, group planning, progressive group task, half group task, command task, individual obstacles and the group obstacle race.',
          'A lecturette — a short talk on a topic chosen from a card, with a few minutes to prepare.',
          'The GTO is watching how you work with the group, not how often you speak. Pushing others aside reads worse than contributing less.',
        ],
      },
      {
        heading: 'Interview and conference',
        bullets: [
          'The interview runs off your Personal Information Questionnaire, so everything you wrote there is fair game and must be true.',
          'At the conference the whole board compares what every stage showed and reaches a recommendation.',
          'A recommendation depends on the consistency of the picture across the stages, not on any one performance.',
        ],
      },
    ],
  },

  {
    slug: 'officer-like-qualities',
    kind: 'gk',
    section: 'defence',
    titleEn: 'Officer-like qualities',
    titleUr: 'افسرانہ خصوصیات',
    summaryEn:
      'The qualities a selection board assesses, usually grouped into four factors: planning and organisation, social adjustment, social effectiveness, and dynamic qualities. Every task in the programme is a way of observing several of them at once.',
    issbAngle:
      'Do not recite the list at a board — they know it. Use it privately, to work out which quality your own examples actually demonstrate, so that when you are asked for an instance of responsibility you have a real one ready instead of an adjective.',
    facts: [
      { label: 'Commonly listed as', value: 'Fifteen qualities in four factors' },
      { label: 'Factor one', value: 'Planning and organisation' },
      { label: 'Factor two', value: 'Social adjustment' },
      { label: 'Factor three', value: 'Social effectiveness' },
      { label: 'Factor four', value: 'Dynamic qualities' },
    ],
    points: [
      {
        heading: 'Planning and organisation',
        bullets: [
          'Effective intelligence — solving a practical problem, not scoring in a test.',
          'Reasoning ability — reaching a sound conclusion from what you actually have.',
          'Organising ability — arranging people, time and resources to get something finished.',
          'Power of expression — saying what you mean clearly enough that others can act on it.',
        ],
      },
      {
        heading: 'Social adjustment',
        bullets: [
          'Social adaptability — working with people who are not like you.',
          'Cooperation — contributing to a group result rather than a personal one.',
          'Sense of responsibility — doing what you undertook without being watched.',
        ],
      },
      {
        heading: 'Social effectiveness',
        bullets: [
          'Initiative — starting something when nobody has told you to.',
          'Self confidence — steadiness under pressure, which is not the same as loudness.',
          'Speed of decision — deciding in time, and accepting the consequence.',
          'Ability to influence the group — persuading rather than overruling.',
          'Liveliness — keeping your energy and humour when the task is going badly.',
        ],
      },
      {
        heading: 'Dynamic qualities',
        bullets: [
          'Determination — continuing after the first attempt fails.',
          'Courage — moral as much as physical; owning a mistake in front of the group counts.',
          'Stamina — sustaining effort across days, which is why the programme is residential.',
        ],
      },
    ],
  },

  {
    slug: 'pakistans-wars',
    kind: 'gk',
    section: 'defence',
    titleEn: "Pakistan's wars and conflicts",
    titleUr: 'پاکستان کی جنگیں',
    summaryEn:
      'Four conventional conflicts with India and a long internal counter-terrorism campaign. Know the sequence, the outcome of each and the agreement that closed it — a board is more interested in whether you understand the consequences than in dates.',
    issbAngle:
      'Speak about these with restraint. Acknowledging what went wrong in 1971 shows more maturity than avoiding it, and a board will notice the difference between a candidate who has thought about war and one who has only celebrated it.',
    facts: [
      { label: 'First Kashmir war', value: '1947–48' },
      { label: 'Ceasefire in Kashmir', value: '1 January 1949' },
      { label: 'Second war with India', value: '1965' },
      { label: 'Defence Day', value: '6 September, marking 1965' },
      { label: 'Agreement after 1965', value: 'Tashkent Declaration, January 1966' },
      { label: 'Third war', value: '1971' },
      { label: 'Agreement after 1971', value: 'Simla Agreement, 1972' },
      { label: 'Siachen', value: 'Occupied by India in 1984' },
      { label: 'Kargil conflict', value: '1999' },
      {
        label: 'Major internal operations',
        value: 'Rah-e-Rast, Rah-e-Nijat, Zarb-e-Azb, Radd-ul-Fasaad',
      },
    ],
    points: [
      {
        heading: '1947–48 and 1965',
        bullets: [
          'The first Kashmir war followed the accession dispute in 1947 and ended in a United Nations ceasefire; the resulting line became the Line of Control after 1972.',
          'The 1965 war grew out of operations in Kashmir and widened to the international border, with major armour fighting around Chawinda and Sialkot.',
          '6 September is observed as Defence Day for the defence of Lahore and Sialkot; the war ended in a stalemate and the Tashkent Declaration.',
        ],
      },
      {
        heading: '1971',
        bullets: [
          'The political crisis after the 1970 elections, the conflict in East Pakistan and Indian intervention led to the surrender at Dhaka on 16 December 1971 and the creation of Bangladesh.',
          "It remains the single greatest reverse in Pakistan's history, and the Hamoodur Rahman Commission was appointed to examine it.",
          'The Simla Agreement of 1972 committed both sides to settling differences bilaterally and converted the ceasefire line into the Line of Control.',
        ],
      },
      {
        heading: 'Kargil and after',
        bullets: [
          'The Kargil conflict of 1999 was fought at extreme altitude along the Line of Control and ended with a withdrawal under heavy international pressure.',
          'From 2001 the army fought a long campaign in the tribal districts; Zarb-e-Azb from June 2014 in North Waziristan and Radd-ul-Fasaad from February 2017 are the two operations candidates are most often asked about.',
          'The human cost of that campaign — to soldiers and to civilians — is a legitimate and expected part of any honest answer.',
        ],
      },
    ],
    timeline: [
      { date: '1947–48', event: 'First war over Kashmir; a United Nations ceasefire follows.' },
      { date: '1965', event: 'Second war with India; the Tashkent Declaration follows.' },
      { date: '1971', event: 'Third war; East Pakistan becomes Bangladesh.' },
      { date: '1972', event: 'The Simla Agreement establishes the Line of Control.' },
      { date: '1984', event: 'India occupies the Siachen glacier.' },
      { date: '1999', event: 'The Kargil conflict.' },
      { date: '2014', event: 'Operation Zarb-e-Azb begins in North Waziristan.' },
      { date: '2017', event: 'Operation Radd-ul-Fasaad begins.' },
    ],
  },

  {
    slug: 'nishan-e-haider',
    kind: 'gk',
    section: 'defence',
    titleEn: 'Nishan-e-Haider',
    titleUr: 'نشانِ حیدر',
    summaryEn:
      "Pakistan's highest award for valour, conferred for the most conspicuous bravery in the face of the enemy. It has been awarded only a handful of times, almost always after the recipient's death.",
    issbAngle:
      'Learn two or three citations properly rather than the whole list badly. A board will ask what the man actually did, and a candidate who can tell one story well shows more than one who can recite ten names.',
    facts: [
      { label: 'Meaning', value: 'Mark of the Lion — a title of Hazrat Ali (RA)' },
      { label: 'Status', value: 'Highest military gallantry award of Pakistan' },
      { label: 'Next highest', value: 'Hilal-e-Jurat, then Sitara-e-Jurat, then Tamgha-e-Jurat' },
      { label: 'First recipient', value: 'Captain Muhammad Sarwar Shaheed, 1948' },
      { label: 'Air Force recipient', value: 'Pilot Officer Rashid Minhas Shaheed, 1971' },
      {
        label: 'Kargil recipients',
        value: 'Captain Karnal Sher Khan and Havildar Lalak Jan, 1999',
      },
    ],
    points: [
      {
        heading: 'The recipients',
        bullets: [
          'Captain Muhammad Sarwar Shaheed — Kashmir, 1948; led an assault on a fortified position and was killed clearing the wire.',
          'Major Tufail Mohammad Shaheed — East Pakistan, 1958; continued to command after being wounded.',
          'Major Raja Aziz Bhatti Shaheed — Lahore front, 1965; held the Burki sector at the BRB canal and was killed directing fire.',
          'Pilot Officer Rashid Minhas Shaheed — 1971; the youngest recipient, he forced his training aircraft into the ground to prevent his instructor flying it across the border.',
          'Major Shabbir Sharif Shaheed, Major Muhammad Akram Shaheed, Sowar Muhammad Hussain Shaheed and Lance Naik Muhammad Mahfuz Shaheed — all 1971.',
          'Captain Karnal Sher Khan Shaheed and Havildar Lalak Jan Shaheed — Kargil, 1999.',
          'Naik Saif Ali Janjua was awarded the Hilal-e-Kashmir for the 1948 fighting, later treated as equivalent to the Nishan-e-Haider.',
        ],
      },
      {
        heading: 'What the award signifies',
        bullets: [
          'It is not given for a career or for long service; it recognises a single act in the presence of the enemy.',
          'Almost every award has been posthumous, which is itself the point a board wants you to have understood.',
        ],
      },
    ],
  },

  {
    slug: 'pakistan-missile-programme',
    kind: 'gk',
    section: 'defence',
    titleEn: "Pakistan's missile systems",
    titleUr: 'پاکستان کے میزائل',
    summaryEn:
      'Pakistan fields ballistic and cruise missiles across short, medium and intermediate ranges, developed mainly by the National Development Complex and Khan Research Laboratories. Published ranges vary between sources, so quote them as approximate.',
    issbAngle:
      'If you are asked about this, keep to deterrence rather than capability for its own sake. Naming a system and stating roughly what it is for is enough; reciting exact ranges you cannot verify is a risk with no reward.',
    facts: [
      { label: 'Ghauri', value: 'Medium-range ballistic, liquid-fuelled' },
      { label: 'Shaheen series', value: 'Solid-fuelled ballistic, short to intermediate range' },
      { label: 'Ababeel', value: 'Ballistic, tested with multiple re-entry vehicles' },
      { label: 'Nasr', value: 'Short-range battlefield ballistic' },
      { label: 'Abdali and Ghaznavi', value: 'Short-range ballistic' },
      { label: 'Babur', value: 'Ground- and sea-launched cruise missile' },
      { label: "Ra'ad", value: 'Air-launched cruise missile' },
      { label: 'Fatah series', value: 'Guided multiple-launch rocket system' },
      {
        label: 'Main developers',
        value: 'National Development Complex; Khan Research Laboratories',
      },
    ],
    points: [
      {
        heading: 'How the family is organised',
        bullets: [
          'Ballistic systems run from battlefield ranges, such as Nasr, up to the intermediate-range Shaheen-III.',
          'The Shaheen family is solid-fuelled, which makes it quicker to prepare than the liquid-fuelled Ghauri.',
          "Cruise missiles — Babur from the ground and sea, Ra'ad from aircraft — provide a low-flying complement to the ballistic force.",
          'Ababeel was tested to demonstrate multiple independently targetable re-entry vehicles, a response to ballistic missile defence.',
        ],
      },
      {
        heading: 'Doctrine',
        bullets: [
          'The declared posture is minimum credible deterrence, with command exercised through the National Command Authority.',
          'Pakistan has not declared a no-first-use policy, and states that its capability exists to deter, not to initiate.',
        ],
      },
    ],
  },

  {
    slug: 'pakistan-air-force-and-navy',
    kind: 'gk',
    section: 'defence',
    titleEn: 'Pakistan Air Force and Navy',
    titleUr: 'پاکستان فضائیہ اور بحریہ',
    summaryEn:
      'The two smaller services, their principal equipment and the roles they perform. Candidates applying to either are expected to know the basics of what they are joining.',
    issbAngle:
      'If you are applying to the Air Force or the Navy, be ready to say why that service rather than the Army — and give a reason drawn from what the service actually does, not from how the uniform looks.',
    facts: [
      { label: 'PAF main fighter', value: 'JF-17 Thunder, co-developed with China' },
      { label: 'JF-17 built at', value: 'Pakistan Aeronautical Complex, Kamra' },
      { label: 'Other PAF fighters', value: 'F-16 Fighting Falcon; J-10C' },
      { label: 'PAF academy', value: 'Risalpur' },
      { label: 'Air Force Day', value: '7 September' },
      { label: 'Navy submarines', value: 'Agosta 90B class; Hangor class under construction' },
      { label: 'Navy frigates', value: 'Tughril class; Zulfiquar class' },
      { label: 'Main naval base', value: 'Karachi, with facilities at Ormara and Gwadar' },
      { label: 'Navy Day', value: '8 September' },
    ],
    points: [
      {
        heading: 'Pakistan Air Force',
        bullets: [
          'The JF-17 Thunder is the backbone of the fleet and the most significant defence-industrial project the country has undertaken, assembled at Kamra.',
          'The F-16 remains in service alongside it, and the J-10C was inducted more recently.',
          'The PAF is remembered at boards for 1965 and for the air defence role it plays in any conflict with a larger neighbour.',
        ],
      },
      {
        heading: 'Pakistan Navy',
        bullets: [
          "A smaller force with a long coastline to protect and almost all of the country's trade passing by sea, which is the strategic argument for it.",
          'Operates conventional submarines, frigates and maritime patrol aircraft, and takes part in multinational counter-piracy task forces.',
          'Hosts the multinational AMAN exercise at Karachi, which is a good example to cite of naval diplomacy.',
        ],
      },
    ],
  },

  {
    slug: 'military-ranks-of-pakistan',
    kind: 'gk',
    section: 'defence',
    titleEn: 'Ranks of the three services',
    titleUr: 'تینوں افواج کے رینک',
    summaryEn:
      'Commissioned officer ranks in the Army, Navy and Air Force, in ascending order. Knowing the equivalences across the services is a basic expectation at a selection board.',
    issbAngle:
      'This is a quick-fire check rather than a discussion. Learn the ladder in order, and know which rank you would hold on commissioning and what the next two are.',
    facts: [
      { label: 'Army — entry rank', value: 'Second Lieutenant' },
      {
        label: 'Army — ascending',
        value: 'Lieutenant, Captain, Major, Lieutenant Colonel, Colonel',
      },
      {
        label: 'Army — general officers',
        value: 'Brigadier, Major General, Lieutenant General, General',
      },
      { label: 'Navy — entry rank', value: 'Midshipman, then Sub Lieutenant' },
      {
        label: 'Navy — ascending',
        value: 'Lieutenant, Lieutenant Commander, Commander, Captain, Commodore',
      },
      { label: 'Navy — flag officers', value: 'Rear Admiral, Vice Admiral, Admiral' },
      { label: 'Air Force — entry rank', value: 'Pilot Officer' },
      {
        label: 'Air Force — ascending',
        value: 'Flying Officer, Flight Lieutenant, Squadron Leader, Wing Commander, Group Captain',
      },
      {
        label: 'Air Force — air officers',
        value: 'Air Commodore, Air Vice Marshal, Air Marshal, Air Chief Marshal',
      },
    ],
    points: [
      {
        heading: 'Equivalences worth knowing',
        bullets: [
          'An Army Major, a Navy Lieutenant Commander and an Air Force Squadron Leader hold equivalent rank.',
          'An Army Colonel, a Navy Captain and an Air Force Group Captain are equivalent.',
          'A Brigadier, a Commodore and an Air Commodore are equivalent.',
          'The service chiefs hold the ranks of General, Admiral and Air Chief Marshal respectively.',
        ],
      },
    ],
  },

  {
    slug: 'military-firsts-of-pakistan',
    kind: 'gk',
    section: 'defence',
    titleEn: 'Military firsts of Pakistan',
    titleUr: 'پاکستان کی عسکری اولیات',
    summaryEn:
      'Who held each service appointment first, when command passed from British to Pakistani officers, and the other firsts of the armed forces that recur in general knowledge papers.',
    issbAngle:
      'Home ground, so the standard is higher: a wrong name here costs more than a wrong name anywhere else on the paper. Learn the four or five that matter, and say you are not certain rather than guessing at the rest.',
    facts: [
      { label: 'First Commander-in-Chief of the Army', value: 'General Sir Frank Messervy, 1947' },
      {
        label: 'First Pakistani Commander-in-Chief of the Army',
        value: 'General Muhammad Ayub Khan, 1951',
      },
      { label: 'First Chief of Army Staff', value: 'General Tikka Khan, 1972' },
      { label: 'First Field Marshal', value: 'Ayub Khan, 1959' },
      {
        label: 'First Commander-in-Chief of the Air Force',
        value: 'Air Vice Marshal Allan Perry-Keene',
      },
      {
        label: 'First Pakistani Commander-in-Chief of the Air Force',
        value: 'Air Marshal Asghar Khan, 1957',
      },
      {
        label: 'First Commander-in-Chief of the Navy',
        value: 'Rear Admiral James Wilfred Jefford',
      },
      {
        label: 'First Pakistani Commander-in-Chief of the Navy',
        value: 'Vice Admiral Haji Mohammad Siddiq Choudri, 1953',
      },
      {
        label: 'First Chairman of the Joint Chiefs of Staff Committee',
        value: 'General Muhammad Shariff, 1976',
      },
      {
        label: 'First recipient of the Nishan-e-Haider',
        value: 'Captain Muhammad Sarwar Shaheed, 1948',
      },
      {
        label: 'First Air Force recipient of the Nishan-e-Haider',
        value: 'Pilot Officer Rashid Minhas Shaheed, 1971',
      },
      { label: 'First woman Major General', value: 'Dr Shahida Malik' },
      { label: 'First woman Lieutenant General', value: 'Nigar Johar' },
      { label: 'First rocket launch', value: 'Rehbar-I, 7 June 1962, from Sonmiani' },
      { label: 'First satellite', value: 'Badr-1, 1990' },
      { label: 'First nuclear tests', value: '28 May 1998, at Chagai' },
    ],
    points: [
      {
        heading: 'From British to Pakistani command',
        bullets: [
          'All three services were commanded by British officers at independence, because Pakistan had very few officers of sufficient seniority in 1947.',
          'Ayub Khan became the first Pakistani Commander-in-Chief of the Army in 1951, Siddiq Choudri took the Navy in 1953 and Asghar Khan the Air Force in 1957 — the order is worth remembering, because the Army came first and the Air Force last.',
          'The Chairman of the Joint Chiefs of Staff Committee was created as a coordinating appointment in 1976, with General Muhammad Shariff the first to hold it.',
        ],
      },
      {
        heading: 'Why the title changed in 1972',
        bullets: [
          'Until 1972 each service was headed by a Commander-in-Chief. After the 1971 war the appointment was renamed Chief of Staff, with General Tikka Khan the first Chief of Army Staff.',
          'The change was constitutional rather than cosmetic: a Commander-in-Chief commands the force, while a Chief of Staff heads it under the government. That is the answer if a board asks why the title changed.',
          'Ayub Khan remains the only officer promoted Field Marshal while serving, in 1959.',
        ],
      },
      {
        heading: 'Women in the services',
        bullets: [
          'Women have served in the medical and education branches since the early years, and in the general cadres, aviation and the Navy since the 2000s.',
          'Dr Shahida Malik was the first woman promoted Major General, and Nigar Johar the first woman to reach Lieutenant General.',
          'Pakistan commissioned its first women fighter pilots in the Air Force in the 2000s, and women officers have served on United Nations deployments.',
        ],
      },
    ],
  },
]
