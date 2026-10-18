/**
 * History, resources and general science — the rest of the syllabus an
 * academy works through.
 */
import type { CuratedTopic } from '../../gk/topics'

export const HISTORY_TOPICS: CuratedTopic[] = [
  {
    slug: 'muslim-rule-in-the-subcontinent',
    kind: 'gk',
    section: 'history',
    titleEn: 'Muslim rule in the subcontinent',
    titleUr: 'برصغیر میں مسلم حکمرانی',
    summaryEn:
      'From the arrival of Muhammad bin Qasim in Sindh to the end of the Mughal empire — the sequence of dynasties that made Muslims a permanent political presence in India, and the background to everything that followed in 1857 and 1947.',
    issbAngle:
      'The point a board is usually after is continuity: that the demand for Pakistan rested on a history of separate rule and identity, not on a grievance that appeared in the twentieth century.',
    facts: [
      { label: 'Muhammad bin Qasim conquered Sindh', value: '711 CE' },
      { label: 'Mahmud of Ghazni raided India', value: 'From about 1000 CE' },
      { label: 'Delhi Sultanate established', value: '1206' },
      { label: 'Dynasties of the Sultanate', value: 'Slave, Khilji, Tughlaq, Sayyid, Lodhi' },
      { label: 'Mughal empire founded by', value: 'Babur, after Panipat in 1526' },
      { label: 'Great Mughals', value: 'Babur, Humayun, Akbar, Jahangir, Shah Jahan, Aurangzeb' },
      { label: 'Taj Mahal built by', value: 'Shah Jahan' },
      { label: 'Badshahi Mosque built under', value: 'Aurangzeb, 1673' },
      { label: 'Last Mughal emperor', value: 'Bahadur Shah Zafar' },
    ],
    points: [
      {
        heading: 'The sequence',
        bullets: [
          'Sindh came under Muslim rule in 711 CE; the northern plains followed from the eleventh century.',
          'The Delhi Sultanate ran from 1206 through five dynasties until Babur defeated the last Lodhi ruler at Panipat in 1526.',
          'The Mughal empire reached its greatest extent under Aurangzeb and declined rapidly after him, leaving regional powers and then the East India Company in control.',
        ],
      },
      {
        heading: 'Figures worth knowing',
        bullets: [
          'Akbar for administration and his policy towards non-Muslims; Aurangzeb for the extent of the empire and the controversy over his reign.',
          'Shah Waliullah for the intellectual revival that influenced later reform movements.',
          'Tipu Sultan for resistance to the Company in the south.',
        ],
      },
    ],
  },

  {
    slug: 'war-of-independence-1857',
    kind: 'gk',
    section: 'history',
    titleEn: 'The War of Independence, 1857',
    titleUr: 'جنگِ آزادی ۱۸۵۷',
    summaryEn:
      'The uprising against the East India Company that began at Meerut, ended Mughal rule formally and transferred India to the British Crown. Its failure set the conditions for everything Sir Syed later argued.',
    issbAngle:
      'Know both names it goes by and why they differ — the Indian Mutiny in British accounts, the War of Independence in ours. Being able to explain that difference shows you understand how history is written.',
    facts: [
      { label: 'Began', value: 'May 1857, at Meerut' },
      { label: 'Immediate cause', value: 'The greased cartridge controversy' },
      { label: 'Declared leader', value: 'Bahadur Shah Zafar' },
      { label: 'Notable figures', value: 'Rani of Jhansi, Nana Sahib, Bakht Khan' },
      { label: 'Outcome', value: 'Suppressed by 1858' },
      { label: 'Consequence', value: 'Company rule ended; India came under the Crown' },
      { label: 'Last Mughal exiled to', value: 'Rangoon' },
    ],
    points: [
      {
        heading: 'Causes',
        bullets: [
          'Political: annexations under the doctrine of lapse and the reduction of Indian rulers.',
          'Economic: the destruction of local industry and the burden of land revenue.',
          'Religious and social: interference with custom, and the cartridge controversy that triggered the revolt.',
          'Military: grievances over pay, promotion and service conditions among Indian soldiers.',
        ],
      },
      {
        heading: 'Consequences for Muslims',
        bullets: [
          'The Mughal name was extinguished and Muslims were widely blamed for the revolt.',
          'Exclusion from government service and education followed, and it is this collapse that Sir Syed set out to reverse through the Aligarh movement.',
        ],
      },
    ],
  },

  {
    slug: 'khilafat-movement',
    kind: 'gk',
    section: 'history',
    titleEn: 'The Khilafat Movement',
    titleUr: 'تحریکِ خلافت',
    summaryEn:
      'The campaign from 1919 in defence of the Ottoman Caliphate after the First World War, led by the Ali brothers and supported by Gandhi. It was the first mass political mobilisation of Indian Muslims and it collapsed when Turkiye abolished the Caliphate itself.',
    issbAngle:
      'A good example of a movement that failed in its object but changed politics permanently — it brought Muslims into mass politics and its collapse pushed many towards a separate political path.',
    facts: [
      { label: 'Began', value: '1919' },
      { label: 'Leaders', value: 'Maulana Muhammad Ali Jauhar and Maulana Shaukat Ali' },
      { label: 'Other figures', value: 'Maulana Abul Kalam Azad; Hasrat Mohani' },
      { label: 'Allied movement', value: "Gandhi's non-cooperation movement" },
      { label: 'Hijrat movement', value: '1920 — migration to Afghanistan' },
      { label: 'Caliphate abolished', value: '1924, by Turkiye' },
      { label: 'Outcome', value: 'The movement collapsed' },
    ],
    points: [
      {
        heading: 'What happened',
        bullets: [
          'Indian Muslims campaigned to preserve the Ottoman Caliphate after the defeat of Turkiye in the First World War.',
          'Gandhi joined the cause to the non-cooperation movement, producing an unusual period of Hindu–Muslim political unity.',
          'The Hijrat movement of 1920, in which thousands migrated towards Afghanistan, ended in hardship and return.',
          'When Turkiye abolished the Caliphate in 1924 the movement lost its object and dissolved.',
        ],
      },
      {
        heading: 'Why it matters',
        bullets: [
          'It showed that Muslims could be mobilised in very large numbers on a political question.',
          'Its collapse, and the communal breakdown that followed, damaged confidence in joint political action and pushed opinion towards separate organisation.',
        ],
      },
    ],
  },

  {
    slug: 'world-wars-and-cold-war',
    kind: 'gk',
    section: 'world',
    titleEn: 'The world wars and the Cold War',
    titleUr: 'عالمی جنگیں اور سرد جنگ',
    summaryEn:
      'The three conflicts that shaped the modern international order, the institutions each produced, and where Pakistan stood once it existed.',
    issbAngle:
      'Useful background for almost any question about the United Nations, nuclear weapons or alliances. Know what each war produced institutionally — that is what still affects Pakistan today.',
    facts: [
      { label: 'First World War', value: '1914–1918' },
      { label: 'Produced', value: 'The League of Nations' },
      { label: 'Second World War', value: '1939–1945' },
      { label: 'Produced', value: 'The United Nations, 1945' },
      { label: 'Atomic bombs used on', value: 'Hiroshima and Nagasaki, August 1945' },
      { label: 'Cold War', value: 'About 1947 to 1991' },
      { label: 'Western alliance', value: 'NATO, 1949' },
      { label: 'Eastern alliance', value: 'The Warsaw Pact, 1955' },
      { label: 'Soviet Union dissolved', value: '1991' },
      { label: 'Pakistani alignment in the 1950s', value: 'SEATO and CENTO' },
    ],
    points: [
      {
        heading: 'What each produced',
        bullets: [
          'The First World War ended four empires and produced the League of Nations, which failed to prevent the next war.',
          'The Second World War produced the United Nations, the Security Council veto, and the nuclear age.',
          'The Cold War divided the world into blocs and made alignment the central question of foreign policy for newly independent states.',
        ],
      },
      {
        heading: 'Where Pakistan stood',
        bullets: [
          'Pakistan aligned with the Western bloc in the 1950s through SEATO and CENTO, seeking security against a larger neighbour.',
          'It later built a close relationship with China while remaining engaged with the United States, particularly over Afghanistan.',
          'The Soviet invasion of Afghanistan in 1979 made Pakistan a front-line state, with consequences — refugees, weapons and militancy — that outlasted the war.',
        ],
      },
    ],
  },

  {
    slug: 'rivers-dams-and-barrages',
    kind: 'gk',
    section: 'geography',
    titleEn: 'Rivers, dams and barrages',
    titleUr: 'دریا، ڈیم اور بیراج',
    summaryEn:
      'The Indus system and the structures built on it — the storage, the barrages and the link canals that make irrigated agriculture possible.',
    issbAngle:
      'Water is the most likely resource question you will face. Know the two main dams, one barrage on the Indus, and be able to say why storage capacity matters more each year.',
    facts: [
      { label: 'Main river', value: 'The Indus' },
      { label: 'Source of the Indus', value: 'Tibet, near Lake Manasarovar' },
      { label: 'Where the Indus ends', value: 'The Arabian Sea, south-east of Karachi' },
      { label: 'Provinces the Indus crosses', value: 'Gilgit-Baltistan, KP, Punjab and Sindh' },
      { label: 'Largest dam by storage', value: 'Tarbela, completed 1976' },
      { label: 'Highest dam', value: 'Mangla, completed 1967' },
      {
        label: 'Barrages on the Indus',
        value: 'Six — Jinnah, Chashma, Taunsa, Guddu, Sukkur, Kotri',
      },
      { label: 'Barrages on the Chenab', value: 'Marala, Khanki, Qadirabad and Trimmu' },
      { label: 'Barrages on the Ravi', value: 'Balloki and Sidhnai' },
      { label: 'Barrages on the Sutlej', value: 'Sulemanki and Islam' },
      { label: 'Barrage on the Jhelum', value: 'Rasul' },
      { label: 'Western rivers', value: 'Indus, Jhelum, Chenab' },
      { label: 'Eastern rivers', value: 'Ravi, Beas, Sutlej' },
      { label: 'Tarbela Dam', value: 'On the Indus' },
      { label: 'Mangla Dam', value: 'On the Jhelum' },
      { label: 'Warsak Dam', value: 'On the Kabul river' },
      { label: 'Diamer-Bhasha Dam', value: 'On the Indus, under construction' },
      { label: 'Sukkur Barrage', value: 'On the Indus, in Sindh' },
      { label: 'Kotri, Guddu, Taunsa', value: 'Other major barrages on the Indus' },
      { label: 'Irrigation system', value: 'Among the largest contiguous systems in the world' },
    ],
    points: [
      {
        heading: 'Why storage matters',
        bullets: [
          'Most of the flow arrives in the summer melt and monsoon; without storage it runs to the sea unused.',
          'Existing reservoirs lose capacity to silt every year, so storage falls even when no new demand appears.',
          'Groundwater has made up the shortfall in many areas, and the water table has fallen accordingly.',
        ],
      },
      {
        heading: 'What to say about it',
        bullets: [
          'Treat it as a management question rather than only a construction question — losses in canals and in field application are large.',
          'The Indus Waters Treaty governs the division with India and has held since 1960.',
        ],
      },
      {
        heading: 'Dams and barrages — the distinction',
        bullets: [
          'A dam stores water; a barrage raises the level to divert it into canals and stores almost nothing. Tarbela and Mangla are dams, Sukkur and Kotri are barrages, and treating them as the same thing is the commonest mistake in this topic.',
          'Tarbela on the Indus, completed in 1976, is the largest by storage; Mangla on the Jhelum, completed in 1967, is the higher structure. Warsak on the Kabul river, completed around 1960, is the smallest of the three usually named.',
          'The Indus carries six barrages, the Chenab four, the Ravi and the Sutlej two each and the Jhelum one — the arithmetic that irrigation questions tend to be built from.',
          'The Indus itself rises in Tibet near Lake Manasarovar, enters Pakistan through Gilgit-Baltistan, runs the length of the country and reaches the Arabian Sea south-east of Karachi.',
        ],
      },
    ],
  },

  {
    slug: 'resources-and-energy',
    kind: 'gk',
    section: 'pakistan',
    titleEn: 'Resources and energy',
    titleUr: 'وسائل اور توانائی',
    summaryEn:
      'What Pakistan has under the ground and how it generates power — the minerals, the gas fields, the coal and the mix of hydro, thermal, nuclear and renewables.',
    issbAngle:
      'The interesting answer is why a country with these resources still imports energy. Extraction, transport and security in the areas where the resources sit are the real constraints, and saying so shows you have thought past the list.',
    facts: [
      { label: 'Largest gas field', value: 'Sui, in Balochistan' },
      { label: 'Major coal reserves', value: 'Thar, in Sindh' },
      { label: 'Copper and gold project', value: 'Reko Diq, in Balochistan' },
      { label: 'Salt mine', value: 'Khewra, among the largest in the world' },
      { label: 'Marble and granite', value: 'Khyber Pakhtunkhwa and Balochistan' },
      { label: 'Main hydro stations', value: 'Tarbela, Mangla, Ghazi Barotha, Neelum-Jhelum' },
      { label: 'Nuclear power plants', value: 'Karachi and Chashma' },
      { label: 'First nuclear plant', value: 'KANUPP, Karachi' },
    ],
    points: [
      {
        heading: 'The resource base',
        bullets: [
          'Natural gas has been the backbone of the energy mix, with Sui the best-known field; production has declined and imports of liquefied natural gas have filled the gap.',
          'Thar holds very large coal reserves, now being used for power generation at the mine mouth.',
          'Reko Diq is one of the largest undeveloped copper and gold deposits in the world.',
        ],
      },
      {
        heading: 'The energy problem',
        bullets: [
          'Generation capacity has grown, but transmission losses, theft and unpaid bills produce circular debt that starves the system of cash.',
          'Imported fuel ties electricity prices to the exchange rate, so a currency fall raises the cost of power immediately.',
          'Hydropower is cheap but seasonal; solar has grown quickly from a small base.',
        ],
      },
    ],
  },

  {
    slug: 'climate-and-agriculture',
    kind: 'gk',
    section: 'geography',
    titleEn: 'Climate and agriculture',
    titleUr: 'موسم اور زراعت',
    summaryEn:
      'The seasons, the monsoon, the two cropping cycles and the crops that matter — plus the climate pressures that now shape all of it.',
    issbAngle:
      'Pakistan is among the countries most exposed to climate change while contributing very little to the cause. That is a fair, factual point to make, and it is better made without grievance.',
    facts: [
      { label: 'Cropping seasons', value: 'Rabi and Kharif' },
      { label: 'Rabi', value: 'Sown in winter — wheat, gram, barley, mustard' },
      { label: 'Kharif', value: 'Sown in summer — cotton, rice, sugarcane, maize' },
      { label: 'Main food crop', value: 'Wheat' },
      { label: 'Main cash crop', value: 'Cotton' },
      { label: 'Monsoon', value: 'July to September' },
      { label: 'Largest sugar producer in the world', value: 'Brazil' },
      { label: 'Largest sugar consumer in the world', value: 'India' },
      { label: 'Pakistan in sugarcane', value: 'Among the top ten producers and consumers' },
      { label: 'Pakistan in cotton', value: 'Among the largest producers, behind China and India' },
      { label: 'Largest floods in recent memory', value: '2010 and 2022' },
      {
        label: 'Climate exposure',
        value: 'Among the most vulnerable countries despite low emissions',
      },
    ],
    points: [
      {
        heading: 'The agricultural year',
        bullets: [
          'Rabi crops are sown from October to December and harvested in spring; wheat is the largest by area.',
          'Kharif crops are sown from April to June and harvested in autumn; cotton feeds the textile industry that dominates exports.',
          'Yields per acre are low compared with regional neighbours, which is where most of the available gain lies.',
        ],
      },
      {
        heading: 'Climate pressure',
        bullets: [
          'Glacial melt in the north feeds the Indus and is changing in volume and timing.',
          'The 2022 floods submerged a third of the country by some assessments and displaced millions.',
          'Heat waves now regularly exceed levels at which outdoor work is safe, affecting both agriculture and cities.',
        ],
      },
    ],
  },

  {
    slug: 'inventions-and-discoveries',
    kind: 'gk',
    section: 'science',
    titleEn: 'Inventions and discoveries',
    titleUr: 'ایجادات اور دریافتیں',
    summaryEn:
      'The inventions and discoveries most often asked in general knowledge papers, with who is credited for each.',
    issbAngle:
      'Rapid recall, and an easy place to lose marks by guessing. If you are unsure whether it was Bell or Baird, say you are not certain rather than picking one.',
    facts: [
      { label: 'Telephone', value: 'Alexander Graham Bell' },
      { label: 'Television', value: 'John Logie Baird' },
      { label: 'Electric bulb', value: 'Thomas Edison' },
      { label: 'Radio', value: 'Guglielmo Marconi' },
      { label: 'Penicillin', value: 'Alexander Fleming' },
      { label: 'X-rays', value: 'Wilhelm Röntgen' },
      { label: 'Law of gravitation', value: 'Isaac Newton' },
      { label: 'Theory of relativity', value: 'Albert Einstein' },
      { label: 'Printing press', value: 'Johannes Gutenberg' },
      { label: 'Aeroplane', value: 'The Wright brothers' },
      { label: 'Steam engine improved by', value: 'James Watt' },
      { label: 'Algebra developed by', value: 'Al-Khwarizmi' },
      { label: 'Optics advanced by', value: 'Ibn al-Haytham' },
      { label: 'Canon of Medicine written by', value: 'Ibn Sina' },
    ],
    points: [
      {
        heading: 'Muslim scientists worth naming',
        bullets: [
          'Al-Khwarizmi, from whose name the word algorithm derives, and whose work gave algebra its name.',
          'Ibn al-Haytham, whose work on optics established the experimental method in the study of light.',
          'Ibn Sina, whose Canon of Medicine was used in European universities for centuries.',
          'Al-Biruni, for geography, astronomy and his account of India.',
        ],
      },
    ],
  },

  {
    slug: 'human-body-basics',
    kind: 'gk',
    section: 'science',
    titleEn: 'The human body — basics',
    titleUr: 'انسانی جسم',
    summaryEn:
      'The everyday biology that appears in general knowledge papers and in the medical part of general awareness.',
    issbAngle:
      'Straight recall. Worth ten minutes of revision because the questions are easy marks and the gaps are obvious when they appear.',
    facts: [
      { label: 'Bones in an adult body', value: '206' },
      { label: 'Largest organ', value: 'The skin' },
      { label: 'Largest internal organ', value: 'The liver' },
      { label: 'Smallest bone', value: 'The stapes, in the ear' },
      { label: 'Longest bone', value: 'The femur' },
      { label: 'Normal body temperature', value: 'About 37 degrees Celsius' },
      { label: 'Normal pulse at rest', value: 'About 60 to 100 beats a minute' },
      { label: 'Universal donor blood group', value: 'O negative' },
      { label: 'Universal recipient blood group', value: 'AB positive' },
      { label: 'Chambers of the heart', value: 'Four' },
      { label: 'Insulin produced by', value: 'The pancreas' },
      { label: 'Vitamin from sunlight', value: 'Vitamin D' },
    ],
    points: [
      {
        heading: 'Systems in one line each',
        bullets: [
          'Circulatory — the heart pumps blood through arteries and veins.',
          'Respiratory — the lungs exchange oxygen for carbon dioxide.',
          'Digestive — food is broken down from the mouth through the stomach and intestines.',
          'Nervous — the brain and spinal cord carry signals to and from the body.',
        ],
      },
    ],
  },

  {
    slug: 'computers-and-technology',
    kind: 'gk',
    section: 'science',
    titleEn: 'Computers and technology',
    titleUr: 'کمپیوٹر اور ٹیکنالوجی',
    summaryEn:
      'Basic computing terms and the technologies that now come up in current affairs discussion, including artificial intelligence and cyber security.',
    issbAngle:
      'Increasingly common as a lecturette or discussion topic. A balanced answer on artificial intelligence — what it can do, what it displaces, and what a country like Pakistan should do about it — is worth preparing.',
    facts: [
      { label: 'CPU', value: 'Central Processing Unit' },
      { label: 'RAM', value: 'Random Access Memory' },
      { label: 'ROM', value: 'Read Only Memory' },
      { label: 'Smallest unit of data', value: 'The bit' },
      { label: 'Bits in a byte', value: 'Eight' },
      { label: 'WWW', value: 'World Wide Web' },
      { label: 'HTTP', value: 'HyperText Transfer Protocol' },
      { label: 'IP', value: 'Internet Protocol' },
      { label: 'AI', value: 'Artificial Intelligence' },
      { label: 'IoT', value: 'Internet of Things' },
      { label: 'First general-purpose electronic computer', value: 'ENIAC' },
      { label: 'Father of the computer', value: 'Charles Babbage' },
    ],
    points: [
      {
        heading: 'Topics that come up in discussion',
        bullets: [
          'Artificial intelligence — what it changes in work and education, and the risk of a country becoming a consumer rather than a producer of it.',
          'Cyber security — attacks on infrastructure and data as a dimension of national security alongside land, sea and air.',
          'Digital economy — freelancing and IT exports as one of the few parts of the Pakistani economy growing quickly.',
          'Social media — its effect on public opinion, and on the reliability of what people believe.',
        ],
      },
    ],
  },

  {
    slug: 'lahore-resolution',
    kind: 'gk',
    section: 'history',
    titleEn: 'The Lahore Resolution',
    titleUr: 'قراردادِ لاہور',
    summaryEn:
      'The resolution passed at the Muslim League session of March 1940 that turned a constitutional argument into a demand for separate states. Everything after 1940 — the elections, the Cabinet Mission, partition itself — refers back to this text.',
    issbAngle:
      'Two details separate a prepared candidate from a coached one: the word Pakistan does not appear anywhere in the resolution, and the original wording said “States” in the plural, changed to the singular in 1946. Knowing that, and why it mattered, is worth more than the list of seconders.',
    facts: [
      { label: 'Session', value: '27th annual session of the All-India Muslim League' },
      { label: 'Dates of the session', value: '22 to 24 March 1940' },
      { label: 'Venue', value: 'Minto Park, Lahore — now Iqbal Park' },
      { label: 'Presided over by', value: 'Quaid-e-Azam Muhammad Ali Jinnah' },
      { label: 'Moved by', value: 'A.K. Fazlul Haq, Premier of Bengal, on 23 March 1940' },
      { label: 'Adopted on', value: '24 March 1940' },
      { label: 'Reception committee chaired by', value: 'Nawab Shah Nawaz Khan of Mamdot' },
      { label: 'Name given by the press', value: 'The Pakistan Resolution' },
      { label: 'The word Pakistan', value: 'Does not appear in the text of the resolution' },
      { label: 'Wording changed', value: 'Delhi Convention, April 1946 — “States” became “State”' },
      { label: 'Monument on the site', value: 'Minar-e-Pakistan' },
      { label: 'Commemorated as', value: 'Pakistan Day, 23 March' },
    ],
    points: [
      {
        heading: 'The session',
        bullets: [
          'The League met at Lahore three days after a violent clash between the Khaksar movement and the police in the same city, so the session opened under curfew and considerable tension.',
          'Jinnah used his presidential address on 22 March to set out the two-nation argument in full: that Muslims and Hindus were not two communities within one nation but two nations by any definition of the word.',
          'A.K. Fazlul Haq, then Premier of Bengal, moved the resolution on 23 March and it was adopted on 24 March, which is why both dates appear in different books.',
        ],
      },
      {
        heading: 'What it actually said',
        bullets: [
          'That no constitutional plan would be workable unless geographically contiguous units were demarcated into regions, with territorial adjustments where necessary.',
          'That the areas in which Muslims were numerically in a majority — the north-western and eastern zones of India — should be grouped to constitute independent states, with the constituent units autonomous and sovereign.',
          'That adequate, effective and mandatory safeguards should be provided for minorities in those units, and for Muslims where they remained in a minority elsewhere.',
          'It named no country and drew no boundary. The vagueness was deliberate: it kept every Muslim-majority province inside the demand while the details were still negotiable.',
        ],
      },
      {
        heading: 'Who supported it',
        bullets: [
          'Seconders were drawn from every province so the demand could not be dismissed as regional: Chaudhry Khaliquzzaman for the United Provinces, Maulana Zafar Ali Khan for the Punjab, Sardar Aurangzeb Khan for the North-West Frontier Province, Sir Abdullah Haroon for Sindh, Qazi Muhammad Isa for Balochistan and I.I. Chundrigar for Bombay.',
          'Begum Muhammad Ali Johar is usually named as the only woman to take part in the proceedings.',
          'Who wrote the first draft is disputed. Sikandar Hayat Khan later told the Punjab Assembly that he had drafted it; other accounts credit a memorandum prepared by Sir Zafrullah Khan. The text as passed came from the League’s Subject Committee, so no single author is safe to assert at a board.',
        ],
      },
      {
        heading: 'From resolution to state',
        bullets: [
          'The Delhi Convention of Muslim League legislators in April 1946 replaced “independent States” with “a State”, settling the demand on one country rather than two.',
          'The 1945–46 elections gave the League the mandate that made the demand unavoidable, and the plan of 3 June 1947 conceded it.',
          'Minar-e-Pakistan was raised on the site of the session and completed in 1968; the first constitution came into force on 23 March 1956, which is why the date carries two meanings.',
        ],
      },
    ],
    timeline: [
      {
        date: '19 March 1940',
        event: 'The Khaksar clash with police in Lahore, days before the session.',
      },
      {
        date: '22 March 1940',
        event: 'Jinnah delivers his presidential address on the two-nation argument.',
      },
      { date: '23 March 1940', event: 'A.K. Fazlul Haq moves the resolution.' },
      { date: '24 March 1940', event: 'The resolution is adopted by the session.' },
      { date: 'April 1946', event: 'The Delhi Convention changes “States” to “State”.' },
      { date: '23 March 1956', event: 'The first constitution comes into force on the same date.' },
      { date: '1968', event: 'Minar-e-Pakistan is completed on the site of the session.' },
    ],
  },

  {
    slug: 'revolutions-and-movements',
    kind: 'gk',
    section: 'history',
    titleEn: 'Revolutions and movements',
    titleUr: 'انقلابات اور تحریکیں',
    summaryEn:
      'The revolutions and reform movements that recur in general knowledge papers — where and when each happened, and what actually changed as a result.',
    issbAngle:
      'The names are easy marks; the preparation that pays is one sentence on what each revolution changed. Being able to say why 1979 in Iran still shapes Gulf politics is worth more to a board than reciting seven colours.',
    facts: [
      {
        label: 'Khaksar Movement',
        value: 'Founded by Allama Inayatullah Khan Mashriqi at Lahore, 1931',
      },
      { label: 'Bolshevik (October) Revolution', value: 'Russia, 1917' },
      { label: 'Islamic Revolution', value: 'Iran, 1979' },
      { label: 'Rose Revolution', value: 'Georgia, 2003' },
      { label: 'Orange Revolution', value: 'Ukraine, 2004' },
      { label: 'Tulip Revolution', value: 'Kyrgyzstan, 2005' },
      { label: 'Cedar Revolution', value: 'Lebanon, 2005' },
      { label: 'Velvet Revolution', value: 'Czechoslovakia, 1989' },
      { label: 'Jasmine Revolution', value: 'Tunisia, 2010–11 — the start of the Arab Spring' },
      {
        label: 'Green Revolution',
        value: 'Began in Mexico in the 1940s; reached South Asia in the 1960s',
      },
      { label: 'Man behind the Green Revolution', value: 'Norman Borlaug' },
      { label: 'Cultural Revolution', value: 'China, 1966 to 1976' },
      { label: 'French Revolution', value: 'France, 1789' },
      { label: 'Industrial Revolution', value: 'Britain, from the later eighteenth century' },
      { label: 'American War of Independence', value: '1775 to 1783' },
      { label: 'Glorious Revolution', value: 'England, 1688' },
    ],
    points: [
      {
        heading: 'The colour revolutions',
        bullets: [
          'Three post-Soviet uprisings against disputed elections, each named for what protesters carried: the Rose Revolution in Georgia in 2003, which forced Eduard Shevardnadze out and brought in Mikheil Saakashvili; the Orange Revolution in Ukraine in 2004, which annulled a rigged run-off and produced Viktor Yushchenko; and the Tulip Revolution in Kyrgyzstan in 2005, which removed Askar Akayev.',
          'The Cedar Revolution in Lebanon in 2005 followed the assassination of Rafic Hariri and ended the Syrian military presence in the country.',
          'The Velvet Revolution in Czechoslovakia in 1989 ended communist rule without bloodshed, and gives its name to any peaceful transfer of power.',
          'Learn them as a group and the dates stop blurring: Rose 2003, Orange 2004, Tulip 2005.',
        ],
      },
      {
        heading: 'Revolutions that changed a system',
        bullets: [
          'The Bolshevik Revolution of 1917, led by Lenin with Trotsky, overthrew the provisional government that had replaced the Tsar and founded what became the Soviet Union. It is called the October Revolution because it fell in October by the Julian calendar then in use.',
          'The Islamic Revolution of 1979 removed Shah Mohammad Reza Pahlavi and established the Islamic Republic under Ayatollah Khomeini, reversing Iran’s alignment and reshaping Gulf politics for the half-century since.',
          'The French Revolution of 1789 ended absolute monarchy in France and put liberty, equality and fraternity into political language everywhere.',
          'The Chinese Cultural Revolution of 1966 to 1976 was launched by Mao Zedong within an existing system rather than against one, and is remembered for the damage it did to education and administration.',
        ],
      },
      {
        heading: 'The Green Revolution',
        bullets: [
          'Not a political revolution but an agricultural one: high-yielding dwarf wheat and rice varieties, developed under the agronomist Norman Borlaug in Mexico from the 1940s, combined with fertiliser and assured irrigation.',
          'Pakistan and India adopted the new wheat varieties in the mid-1960s and both raised wheat output sharply within a decade — the main reason the famines forecast for South Asia did not happen.',
          'The costs are the other half of the answer: heavier fertiliser and water use, falling water tables and a narrower range of crops. A board thinks better of a candidate who gives both sides.',
        ],
      },
      {
        heading: 'The Khaksar Movement',
        bullets: [
          'Founded at Lahore by Allama Inayatullah Khan Mashriqi, a Cambridge-educated mathematician, as a disciplined social-reform movement rather than a political party.',
          'Members wore khaki uniform and carried a belcha — a spade — as a deliberate sign that service and manual work came before status.',
          'Its programme was discipline, self-reliance and communal harmony, summed up as service to humanity.',
          'A clash with police in Lahore on 19 March 1940 left many Khaksars dead and the city under curfew three days before the Muslim League session that passed the Lahore Resolution.',
        ],
      },
    ],
    timeline: [
      { date: '1688', event: 'The Glorious Revolution in England.' },
      { date: '1789', event: 'The French Revolution begins.' },
      { date: '1917', event: 'The Bolshevik Revolution in Russia.' },
      { date: '1931', event: 'The Khaksar Movement is founded at Lahore.' },
      { date: '1960s', event: 'Green Revolution wheat varieties reach Pakistan and India.' },
      { date: '1966', event: 'The Cultural Revolution begins in China.' },
      { date: '1979', event: 'The Islamic Revolution in Iran.' },
      { date: '1989', event: 'The Velvet Revolution in Czechoslovakia.' },
      { date: '2003', event: 'The Rose Revolution in Georgia.' },
      { date: '2004', event: 'The Orange Revolution in Ukraine.' },
      { date: '2005', event: 'The Tulip Revolution in Kyrgyzstan.' },
      { date: '2010', event: 'The Jasmine Revolution in Tunisia begins the Arab Spring.' },
    ],
  },

  {
    slug: 'passes-lakes-and-deserts',
    kind: 'gk',
    section: 'geography',
    titleEn: 'Passes, lakes and deserts of Pakistan',
    titleUr: 'پاکستان کے درے، جھیلیں اور صحرا',
    summaryEn:
      'The mountain passes and what each connects, the lakes worth naming, the five deserts and the doabs of the Punjab — the map questions that come up most often after the rivers.',
    issbAngle:
      'Passes are asked as geography and answered as strategy: each one is a route an army or a trade route has actually used. Know what the Khyber and the Khunjerab connect before you learn the rest.',
    facts: [
      { label: 'Khyber Pass', value: 'Peshawar to Kabul' },
      { label: 'Khunjerab Pass', value: 'Pakistan to China, on the Karakoram Highway' },
      { label: 'Bolan Pass', value: 'Sibi to Quetta' },
      { label: 'Khojak Pass', value: 'Quetta to Chaman' },
      { label: 'Lowari Pass', value: 'Dir to Chitral' },
      { label: 'Shandur Pass', value: 'Chitral to Gilgit' },
      { label: 'Babusar Pass', value: 'Kaghan valley to the Karakoram Highway' },
      { label: 'Tochi Pass', value: 'Bannu to Ghazni' },
      { label: 'Gomal Pass', value: 'Dera Ismail Khan to Ghazni' },
      { label: 'Shangla Pass', value: 'Upper Swat to lower Swat' },
      { label: 'Karakoram Pass', value: 'Kashmir to Xinjiang in China' },
      { label: 'Largest freshwater lake', value: 'Manchhar, in Dadu district, Sindh' },
      { label: 'Keenjhar Lake', value: 'Thatta, Sindh' },
      { label: 'Saif-ul-Malook', value: 'Kaghan valley, near Naran' },
      { label: 'Satpara Lake', value: 'Skardu, Gilgit-Baltistan' },
      { label: 'Attabad Lake', value: 'Hunza — formed by a landslide in 2010' },
      { label: 'The five deserts', value: 'Thar, Cholistan, Thal, Kharan and Katpana' },
      { label: 'Katpana', value: 'A cold desert at Skardu, among the highest in the world' },
      { label: 'Bari Doab', value: 'Between the Beas and the Ravi' },
      { label: 'Rachna Doab', value: 'Between the Ravi and the Chenab' },
      { label: 'Chaj Doab', value: 'Between the Chenab and the Jhelum' },
      { label: 'Sindh Sagar Doab', value: 'Between the Jhelum and the Indus' },
    ],
    points: [
      {
        heading: 'Why the passes matter',
        bullets: [
          'Every invasion of the subcontinent from the north-west came through one of them, which is why the frontier has always been garrisoned rather than merely administered.',
          'The Khyber carries the road from Peshawar to Kabul and is the historic route; the Bolan does the same further south, from Sibi up to Quetta.',
          'The Khunjerab is the modern one: at over 4,600 metres it is the highest paved border crossing in the world and the only road link with China, which makes it the northern end of the China–Pakistan Economic Corridor.',
          'The Lowari and the Shandur are internal but seasonal; the Lowari tunnel was built precisely because Chitral was cut off every winter.',
        ],
      },
      {
        heading: 'Lakes and deserts',
        bullets: [
          'Manchhar in Sindh is the largest freshwater lake in Pakistan; its area changes sharply with the state of the Indus, and its water quality is a long-standing problem.',
          'Saif-ul-Malook above Naran is the one every candidate has heard of; Satpara serves Skardu, and Attabad was formed when a landslide dammed the Hunza river in 2010.',
          'Four of the deserts are hot and low-lying — Thar in Sindh, Cholistan around Bahawalpur, Thal between the Jhelum and the Indus, and Kharan in Balochistan.',
          'Katpana at Skardu is the exception: a cold desert above 2,200 metres, and the answer to the trick question about a desert in the mountains.',
        ],
      },
      {
        heading: 'The doabs',
        bullets: [
          'A doab is the land between two rivers, and the names are built from the rivers themselves — Rachna from the Ravi and the Chenab, Chaj from the Chenab and the Jhelum, Bari from the Beas and the Ravi.',
          'The Sindh Sagar Doab, between the Jhelum and the Indus, is the largest and the driest.',
          'These are the units the canal system was laid out around, which is why they still appear in any discussion of irrigation.',
        ],
      },
    ],
  },
]
