/**
 * The curated General Knowledge library.
 *
 * This is our own writing, seeded once and refreshed by re-running the seed —
 * it is not gathered, so it carries no external licence. Content is the
 * standard material an ISSB candidate is expected to have ready: the founders,
 * the movement, the state, the forces and the land.
 *
 * Facts are written as label/value pairs because the flashcard builder turns
 * exactly those into cards. Keep values short and checkable for that reason.
 */
import type { CuratedTopic } from '../../gk/topics'
import { DEFENCE_TOPICS } from './gk-topics-defence'
import { ISLAMIC_TOPICS } from './gk-topics-islamic'
import { WORLD_TOPICS } from './gk-topics-world'
import { PAKISTAN_TOPICS } from './gk-topics-pakistan'
import { RECALL_TOPICS } from './gk-topics-recall'
import { ISSB_TOPICS } from './gk-topics-issb'
import { HISTORY_TOPICS } from './gk-topics-history'

const wiki = (title: string) => ({
  name: `Wikipedia — ${title}`,
  url: `https://en.wikipedia.org/wiki/${title.replace(/ /g, '_')}`,
  license: 'CC BY-SA 4.0',
  retrievedAt: '2026-09-20T00:00:00.000Z',
})

export const CURATED_TOPICS: CuratedTopic[] = [
  {
    slug: 'quaid-e-azam-muhammad-ali-jinnah',
    kind: 'gk',
    section: 'personalities',
    titleEn: 'Quaid-e-Azam Muhammad Ali Jinnah',
    titleUr: 'قائداعظم محمد علی جناح',
    summaryEn:
      'The founder of Pakistan and its first Governor-General. A Bombay barrister who began as a Congress moderate and an advocate of Hindu–Muslim unity, he became the constitutional architect of a separate Muslim state and carried the demand through to independence in 1947.',
    issbAngle:
      'Expect to be asked what you admire about him and why. Answer with a specific quality shown in a specific episode — his insistence on constitutional means, or his discipline as a lawyer — rather than adjectives. Avoid reciting dates at a board; they will ask what his example means for an officer.',
    facts: [
      { label: 'Born', value: '25 December 1876, Karachi' },
      { label: 'Died', value: '11 September 1948, Karachi' },
      { label: 'Father', value: 'Jinnahbhai Poonja' },
      { label: 'Mother', value: 'Mithibai' },
      { label: 'Sister', value: 'Fatima Jinnah' },
      { label: 'Wife', value: 'Rattanbai (Ruttie) Petit, married 1918' },
      { label: 'Daughter', value: 'Dina Wadia' },
      { label: 'Called to the bar', value: "Lincoln's Inn, London, 1896" },
      { label: 'Joined the Muslim League', value: '1913' },
      { label: 'First office in Pakistan', value: 'Governor-General, 15 August 1947' },
      { label: 'Titles', value: 'Quaid-e-Azam (Great Leader), Baba-e-Qaum (Father of the Nation)' },
      { label: 'Burial place', value: 'Mazar-e-Quaid, Karachi' },
    ],
    points: [
      {
        heading: 'Early life and training',
        bullets: [
          'Born in Karachi to a Gujarati merchant family; schooled at Sindh Madrasatul Islam and the Christian Missionary Society High School.',
          "Sent to London in his teens for a commercial apprenticeship, he switched to law and was called to the bar at Lincoln's Inn in 1896 — the youngest Indian of his day to qualify.",
          "Built a formidable practice in Bombay. His reputation was for precision and preparation, not oratory, and that lawyer's habit shaped every political position he later took.",
        ],
      },
      {
        heading: 'From unity to a separate state',
        bullets: [
          'Joined the Indian National Congress in 1906 and the All-India Muslim League in 1913, holding both memberships while he believed a common settlement was possible.',
          'Architect of the Lucknow Pact of 1916 between Congress and the League, which earned him the description "ambassador of Hindu–Muslim unity".',
          'Answered the Nehru Report with his Fourteen Points in 1929, setting out the constitutional safeguards Muslims required within a united India.',
          'After the provincial ministries formed in 1937 he concluded that those safeguards would not hold, and moved from seeking protection inside one state to demanding a separate one.',
        ],
      },
      {
        heading: 'Leading the demand',
        bullets: [
          'Presided over the Lahore session of March 1940 at which the Lahore Resolution was passed, the formal demand that became Pakistan.',
          'Rebuilt the Muslim League into a mass organisation; its sweep of Muslim seats in the 1945–46 elections made the demand impossible to set aside.',
          'Insisted throughout on constitutional and political methods rather than agitation, which is the thread running through his whole career.',
        ],
      },
      {
        heading: 'Governor-General and legacy',
        bullets: [
          "Took office as Pakistan's first Governor-General on 15 August 1947 and served barely thirteen months before his death.",
          'In his address to the Constituent Assembly on 11 August 1947 he set out equal citizenship irrespective of religion as the basis of the new state.',
          'Inherited a state with no treasury, no functioning secretariat and millions of refugees, and spent his last year on the machinery of government rather than on politics.',
          'His guiding phrase for the nation — unity, faith, discipline — is the one thing every candidate should be able to explain in their own words.',
        ],
      },
    ],
    timeline: [
      { date: '25 December 1876', event: 'Born in Karachi.' },
      { date: '1896', event: "Called to the bar at Lincoln's Inn, London." },
      { date: '1906', event: 'Joins the Indian National Congress.' },
      { date: '1913', event: 'Joins the All-India Muslim League.' },
      { date: '1916', event: 'Negotiates the Lucknow Pact between Congress and the League.' },
      { date: '1929', event: 'Presents his Fourteen Points.' },
      {
        date: '23 March 1940',
        event: 'Presides over the session that passes the Lahore Resolution.',
      },
      { date: '11 August 1947', event: 'Addresses the Constituent Assembly on equal citizenship.' },
      { date: '15 August 1947', event: 'Takes office as the first Governor-General of Pakistan.' },
      { date: '11 September 1948', event: 'Dies in Karachi.' },
    ],
    sources: [wiki('Muhammad Ali Jinnah')],
  },

  {
    slug: 'allama-muhammad-iqbal',
    kind: 'gk',
    section: 'personalities',
    titleEn: 'Allama Muhammad Iqbal',
    titleUr: 'علامہ محمد اقبال',
    summaryEn:
      'Poet, philosopher and barrister whose Allahabad Address of 1930 first gave political shape to the idea of a Muslim state in north-west India. He is remembered as much for the philosophy of selfhood in his poetry as for the political idea drawn from it.',
    issbAngle:
      'A common question is what khudi means and whether it has anything to do with soldiering. Explain it as self-realisation through effort and responsibility, not self-importance, and link it to a decision you have actually had to take. Do not quote long verses you cannot translate.',
    facts: [
      { label: 'Born', value: '9 November 1877, Sialkot' },
      { label: 'Died', value: '21 April 1938, Lahore' },
      { label: 'Titles', value: 'Shair-e-Mashriq (Poet of the East), Mufakkir-e-Pakistan' },
      { label: 'Doctorate', value: 'University of Munich, 1908' },
      { label: 'Studied at', value: 'Government College Lahore; Trinity College, Cambridge' },
      { label: 'Knighted', value: '1922' },
      { label: 'Allahabad Address', value: 'December 1930' },
      { label: 'Major Urdu works', value: 'Bang-e-Dara, Bal-e-Jibril, Zarb-e-Kalim' },
      { label: 'Major Persian works', value: 'Asrar-e-Khudi, Rumuz-e-Bekhudi, Javid Nama' },
      { label: 'Prose work in English', value: 'The Reconstruction of Religious Thought in Islam' },
      { label: 'Burial place', value: 'Beside the Badshahi Mosque, Lahore' },
      { label: 'Iqbal Day', value: '9 November' },
    ],
    points: [
      {
        heading: 'Scholar and poet',
        bullets: [
          'Educated in Sialkot and at Government College Lahore, then at Cambridge, Munich and the bar in London — a training that combined Islamic learning with European philosophy.',
          'Wrote in both Urdu and Persian. The Persian works carry most of his philosophy; the Urdu ones carry his political voice.',
          'His central idea, khudi, is the development of the self through struggle and responsibility — the opposite of passivity, and the basis of his appeal to a community he thought had grown fatalistic.',
        ],
      },
      {
        heading: 'The political idea',
        bullets: [
          'In his presidential address to the Muslim League at Allahabad in December 1930 he proposed consolidating the Muslim-majority areas of north-west India into a single self-governing unit.',
          'He did not name Pakistan and did not live to see it; what he supplied was the argument that Muslims were a nation with a right to their own political order.',
          'He corresponded with Jinnah in the 1930s, urging him to return to lead the League — a direct line between the idea and the man who carried it out.',
        ],
      },
      {
        heading: 'Why he still matters',
        bullets: [
          'He is the reason the demand for Pakistan was framed as a matter of identity and self-respect rather than only of seats and safeguards.',
          'His poetry is still the common vocabulary of national occasions, which is why a board expects a candidate to understand at least one idea from it properly.',
        ],
      },
    ],
    timeline: [
      { date: '9 November 1877', event: 'Born in Sialkot.' },
      { date: '1905', event: 'Leaves for higher study in Europe.' },
      { date: '1908', event: 'Completes his doctorate at Munich and is called to the bar.' },
      { date: '1922', event: 'Knighted.' },
      { date: 'December 1930', event: 'Delivers the Allahabad Address.' },
      { date: '21 April 1938', event: 'Dies in Lahore.' },
    ],
    sources: [wiki('Muhammad Iqbal')],
  },

  {
    slug: 'liaquat-ali-khan',
    kind: 'gk',
    section: 'personalities',
    titleEn: 'Liaquat Ali Khan',
    titleUr: 'لیاقت علی خان',
    summaryEn:
      "Pakistan's first Prime Minister and Jinnah's closest political lieutenant. He held the new state together through its first four years and steered the Objectives Resolution through the Constituent Assembly before his assassination in 1951.",
    issbAngle:
      'Useful for questions about the transition from movement to government. The point worth making is that founding a state and running one are different tasks, and he did the second under conditions of partition, war and an empty treasury.',
    facts: [
      { label: 'Born', value: '1 October 1895, Karnal' },
      { label: 'Died', value: '16 October 1951, Rawalpindi' },
      { label: 'Office', value: 'First Prime Minister of Pakistan, 1947–1951' },
      { label: 'Titles', value: 'Quaid-e-Millat, Shaheed-e-Millat' },
      { label: 'Studied at', value: 'Aligarh; Exeter College, Oxford; Inner Temple, London' },
      { label: 'Wife', value: "Ra'ana Liaquat Ali Khan" },
      { label: 'Objectives Resolution', value: 'Moved and passed, March 1949' },
      { label: 'Place of assassination', value: 'Company Bagh, Rawalpindi — now Liaquat Bagh' },
    ],
    points: [
      {
        heading: 'Before independence',
        bullets: [
          'Joined the Muslim League in 1923 and became its General Secretary in 1936, running the organisation while Jinnah led it.',
          'Served as Finance Member in the interim government of 1946, where his budget was a deliberate demonstration that the League could govern.',
        ],
      },
      {
        heading: 'As Prime Minister',
        bullets: [
          'Took office on 15 August 1947 facing partition violence, a refugee crisis, a divided army and a treasury that had not received its share of assets.',
          'Moved the Objectives Resolution in March 1949, which set the principles for the constitution and remains in the preamble of the present one.',
          'Handled the first Kashmir war and the early disputes with India over water and evacuee property.',
          'Refused to be drawn fully into either Cold War bloc in his first years, though his 1950 visit to Washington set a direction.',
        ],
      },
      {
        heading: 'Assassination',
        bullets: [
          'Shot while addressing a public meeting at Company Bagh, Rawalpindi, on 16 October 1951.',
          'His death removed the last leader with the authority of the founding generation, and the political instability that followed is usually traced to it.',
        ],
      },
    ],
    timeline: [
      { date: '1 October 1895', event: 'Born in Karnal.' },
      { date: '1923', event: 'Joins the All-India Muslim League.' },
      { date: '1936', event: 'Becomes General Secretary of the League.' },
      { date: '15 August 1947', event: 'Becomes the first Prime Minister of Pakistan.' },
      { date: 'March 1949', event: 'The Objectives Resolution is passed.' },
      { date: '16 October 1951', event: 'Assassinated in Rawalpindi.' },
    ],
    sources: [wiki('Liaquat Ali Khan')],
  },

  {
    slug: 'fatima-jinnah',
    kind: 'gk',
    section: 'personalities',
    titleEn: 'Fatima Jinnah',
    titleUr: 'فاطمہ جناح',
    summaryEn:
      "Dentist, political organiser and the Quaid's closest companion through the final decade of the Pakistan movement. Known as Madar-e-Millat, she later returned to politics to contest the presidential election of 1965.",
    issbAngle:
      "A good answer to questions about women's role in the movement. Note that she qualified as a dentist in the 1920s, ran her brother's household and political life, and then stood for the highest office in the country — three separate kinds of courage.",
    facts: [
      { label: 'Born', value: '31 July 1893, Karachi' },
      { label: 'Died', value: '9 July 1967, Karachi' },
      { label: 'Title', value: 'Madar-e-Millat (Mother of the Nation)' },
      { label: 'Profession', value: 'Dentist, qualified 1923' },
      {
        label: 'Known for',
        value: 'Organising women in the Pakistan movement; the 1965 presidential campaign',
      },
    ],
    points: [
      {
        heading: 'Life and work',
        bullets: [
          'Orphaned young and raised largely by her brother, she trained as a dentist in Calcutta and practised in Bombay — an unusual path for a Muslim woman of her generation.',
          'Closed her practice in 1929 to live with Jinnah after his wife died, and from then on was his constant companion and confidante.',
          'Organised women across the Muslim League in the 1940s, addressing gatherings that male leaders could not reach, and later helped resettle refugees after partition.',
        ],
      },
      {
        heading: 'The 1965 election',
        bullets: [
          'Came out of political retirement to stand against President Ayub Khan as the candidate of a combined opposition.',
          'Drew very large crowds and lost an indirect contest conducted under the Basic Democracies system.',
          "Her campaign is remembered as the moment the founding generation's moral authority was set against military rule.",
        ],
      },
    ],
    sources: [wiki('Fatima Jinnah')],
  },

  {
    slug: 'sir-syed-ahmad-khan',
    kind: 'gk',
    section: 'personalities',
    titleEn: 'Sir Syed Ahmad Khan',
    titleUr: 'سر سید احمد خان',
    summaryEn:
      'Reformer and educationist whose Aligarh Movement turned Indian Muslims back towards modern education after 1857, and whose insistence that Muslims were a distinct political community is usually taken as the starting point of the two-nation idea.',
    issbAngle:
      'The angle a board looks for is the value of education as a strategy. He chose to rebuild a community through a college rather than through agitation, and that is a point you can connect to any long-term problem you are asked about.',
    facts: [
      { label: 'Born', value: '17 October 1817, Delhi' },
      { label: 'Died', value: '27 March 1898, Aligarh' },
      { label: 'Founded', value: 'Muhammadan Anglo-Oriental College, Aligarh, 1875' },
      { label: 'The college became', value: 'Aligarh Muslim University, 1920' },
      { label: 'Scientific Society', value: 'Founded 1864' },
      { label: 'Key works', value: 'Asbab-e-Baghawat-e-Hind; Tahzib-ul-Akhlaq' },
    ],
    points: [
      {
        heading: 'After 1857',
        bullets: [
          "Served in the East India Company's judicial service and saw the aftermath of 1857 at close quarters.",
          'Wrote Asbab-e-Baghawat-e-Hind to explain the causes of the revolt to the British and to argue that Muslims had not been uniquely disloyal — an attempt to lift the collective punishment falling on the community.',
        ],
      },
      {
        heading: 'The Aligarh Movement',
        bullets: [
          'Argued that Muslims had to accept modern scientific and English education or be permanently outpaced; founded the Scientific Society in 1864 to translate European works.',
          'Established the Muhammadan Anglo-Oriental College at Aligarh in 1875, modelled on Cambridge, which produced much of the leadership of the later Muslim League.',
          'Published Tahzib-ul-Akhlaq to argue for social reform, against considerable opposition from conservative opinion.',
        ],
      },
      {
        heading: 'Political significance',
        bullets: [
          'Advised Muslims to stay out of the Indian National Congress, holding that a single elective system would leave them permanently outvoted.',
          'His description of Hindus and Muslims as two distinct nations is the earliest clear statement of the idea that later became the basis of the demand for Pakistan.',
        ],
      },
    ],
    sources: [wiki('Syed Ahmad Khan')],
  },

  {
    slug: 'pakistan-at-a-glance',
    kind: 'gk',
    section: 'pakistan',
    titleEn: 'Pakistan at a glance',
    titleUr: 'پاکستان ایک نظر میں',
    summaryEn:
      'The basic facts about the state — when it came into being, how it is organised, and the national symbols. This is the material a board assumes you know without having to think.',
    issbAngle:
      'These are not discussion questions; they are checks that you know your own country. Answer them quickly and without hesitation, then be ready for the follow-up, which is usually about what a symbol or a date actually means.',
    facts: [
      { label: 'Independence', value: '14 August 1947' },
      { label: 'Republic Day', value: '23 March' },
      { label: 'Capital', value: 'Islamabad' },
      { label: 'First capital', value: 'Karachi' },
      { label: 'Largest city', value: 'Karachi' },
      { label: 'Provinces', value: 'Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan' },
      { label: 'National language', value: 'Urdu' },
      { label: 'Currency', value: 'Pakistani rupee' },
      { label: 'National anthem written by', value: 'Hafeez Jalandhari' },
      { label: 'National anthem composed by', value: 'Ahmed G. Chagla' },
      { label: 'Flag adopted', value: '11 August 1947' },
      { label: 'National animal', value: 'Markhor' },
      { label: 'National bird', value: 'Chukar partridge' },
      { label: 'National flower', value: 'Jasmine' },
      { label: 'National tree', value: 'Deodar' },
      { label: 'National fruit', value: 'Mango' },
      { label: 'National game', value: 'Field hockey' },
      { label: 'Highest peak', value: 'K2, 8,611 metres' },
    ],
    points: [
      {
        heading: 'The flag',
        bullets: [
          'Dark green with a white crescent and five-pointed star, and a vertical white stripe at the hoist.',
          'The green stands for the Muslim majority and the white stripe for the religious minorities — the flag itself states that minorities belong to the state.',
          'The crescent is taken to represent progress and the star light and knowledge.',
        ],
      },
      {
        heading: 'How the state is organised',
        bullets: [
          'A federal parliamentary republic of four provinces, with the Islamabad Capital Territory, plus Azad Jammu and Kashmir and Gilgit-Baltistan administered separately.',
          'Parliament is bicameral: a directly elected National Assembly and a Senate that gives the provinces equal representation.',
          'The President is head of state and Supreme Commander of the armed forces; the Prime Minister is head of government.',
        ],
      },
      {
        heading: 'Dates worth knowing',
        bullets: [
          '14 August is Independence Day; 23 March is Pakistan Day, marking the Lahore Resolution of 1940 and the 1956 constitution.',
          '6 September is Defence Day, 7 September Air Force Day and 8 September Navy Day.',
          '25 December is Quaid-e-Azam Day and 9 November is Iqbal Day.',
        ],
      },
    ],
  },

  {
    slug: 'pakistan-movement-milestones',
    kind: 'gk',
    section: 'history',
    titleEn: 'The Pakistan Movement',
    titleUr: 'تحریکِ پاکستان',
    summaryEn:
      'The sequence from the founding of the Muslim League in 1906 to independence in 1947. Knowing the order of events matters more than the individual dates: each step follows from the failure of the one before it.',
    issbAngle:
      "Boards test whether you understand cause and effect, not whether you can recite a list. Be ready to explain why the 1937 provincial ministries changed Jinnah's position — that single link shows you understand the movement rather than having memorised it.",
    facts: [
      { label: 'Muslim League founded', value: '30 December 1906, Dhaka' },
      { label: 'Founder of the Muslim League', value: 'Nawab Khwaja Salimullah of Dhaka' },
      { label: 'First President of the Muslim League', value: 'Sir Agha Khan III' },
      { label: 'Muslim League headquarters', value: 'Lucknow' },
      { label: 'Separate electorates granted', value: 'Minto-Morley Reforms, 1909' },
      { label: 'Lucknow Pact', value: '1916' },
      { label: "Jinnah's Fourteen Points", value: '1929' },
      { label: 'Allahabad Address', value: 'December 1930' },
      { label: 'The name Pakistan proposed', value: 'Chaudhry Rahmat Ali, 1933' },
      { label: 'Government of India Act', value: '1935' },
      { label: 'Lahore Resolution', value: '23 March 1940' },
      { label: 'Cabinet Mission', value: '1946' },
      { label: 'Partition plan announced', value: '3 June 1947' },
      { label: 'Indian Independence Act', value: '18 July 1947' },
      { label: 'Independence', value: '14 August 1947' },
    ],
    points: [
      {
        heading: 'Why a separate party',
        bullets: [
          'The All-India Muslim League was founded at Dhaka in 1906 to protect Muslim political interests, which its founders believed the Congress could not represent. Nawab Khwaja Salimullah of Dhaka convened it, Sir Agha Khan III was its first president, and its headquarters settled at Lucknow.',
          'Separate electorates, conceded in 1909, recognised in law that Muslims were a distinct political constituency — a precedent that ran all the way to 1947.',
          'The party did not outlive the object it was formed for: after 1947 it divided along the new borders into the Muslim League in Pakistan, the Awami League in what became Bangladesh, and the Indian Union Muslim League.',
        ],
      },
      {
        heading: 'The attempt at a settlement',
        bullets: [
          'The Lucknow Pact of 1916 was the high point of cooperation: Congress accepted separate electorates and the two parties agreed a joint demand.',
          'The Nehru Report of 1928 withdrew those safeguards, and Jinnah answered with the Fourteen Points in 1929 — the last serious attempt at terms inside a united India.',
          'The Congress ministries formed after the 1937 elections convinced League leaders that majority rule without enforceable safeguards would be unworkable for Muslims.',
        ],
      },
      {
        heading: 'The demand and the transfer of power',
        bullets: [
          'The Lahore Resolution of 23 March 1940 demanded independent states in the Muslim-majority regions of the north-west and east.',
          'The 1945–46 elections gave the League an overwhelming mandate among Muslim voters and made the demand a fact of arithmetic.',
          'The Cabinet Mission plan of 1946 failed, communal violence followed, and the 3 June 1947 plan settled on partition.',
          'The Radcliffe Boundary Commission drew the lines in Punjab and Bengal; its award was published after independence, and the migration that followed was one of the largest in history.',
        ],
      },
    ],
    timeline: [
      { date: '1906', event: 'The All-India Muslim League is founded at Dhaka.' },
      { date: '1916', event: 'The Lucknow Pact is agreed.' },
      { date: '1929', event: 'Jinnah sets out his Fourteen Points.' },
      { date: '1930', event: 'Iqbal delivers the Allahabad Address.' },
      { date: '1933', event: 'Chaudhry Rahmat Ali proposes the name Pakistan.' },
      { date: '1940', event: 'The Lahore Resolution is passed.' },
      { date: '1946', event: 'The Cabinet Mission plan fails.' },
      { date: '1947', event: 'Partition is announced and Pakistan becomes independent.' },
    ],
  },

  {
    slug: 'pakistan-armed-forces',
    kind: 'gk',
    section: 'defence',
    titleEn: 'The Pakistan Armed Forces',
    titleUr: 'پاکستان کی مسلح افواج',
    summaryEn:
      'How the three services are organised, where their officers are trained, and how gallantry is recognised. This is the ground a selection board stands on, so the expectation of accuracy is higher here than anywhere else.',
    issbAngle:
      'Know the structure, but expect the real question to be about motivation: why this service, and what you think an officer owes. Never guess a name or a number in front of a board — saying you are not certain is respected; inventing is not.',
    facts: [
      { label: 'Services', value: 'Pakistan Army, Pakistan Navy, Pakistan Air Force' },
      { label: 'Supreme Commander', value: 'The President of Pakistan' },
      { label: 'Army training academy', value: 'Pakistan Military Academy, Kakul, Abbottabad' },
      { label: 'Air Force academy', value: 'PAF Academy, Risalpur' },
      { label: 'Navy training', value: 'Pakistan Naval Academy, Karachi' },
      { label: 'Highest gallantry award', value: 'Nishan-e-Haider' },
      { label: 'Other gallantry awards', value: 'Hilal-e-Jurat, Sitara-e-Jurat, Tamgha-e-Jurat' },
      { label: 'Defence Day', value: '6 September' },
      { label: 'Air Force Day', value: '7 September' },
      { label: 'Navy Day', value: '8 September' },
    ],
    points: [
      {
        heading: 'Structure',
        bullets: [
          'Three services under the President as Supreme Commander, with the Chairman of the Joint Chiefs of Staff Committee as the senior coordinating appointment.',
          'Each service is headed by its own Chief of Staff and has its own headquarters and training pipeline.',
          'Selection for a commission in any of the three runs through the Inter Services Selection Board, which is why the same board assesses candidates for all of them.',
        ],
      },
      {
        heading: 'Gallantry',
        bullets: [
          'Nishan-e-Haider is the highest award for valour and has been conferred only a handful of times, almost always posthumously.',
          'Recipients include Captain Muhammad Sarwar, Major Tufail Mohammad, Major Raja Aziz Bhatti, Pilot Officer Rashid Minhas, Major Shabbir Sharif, Major Muhammad Akram, Sowar Muhammad Hussain, Lance Naik Muhammad Mahfuz, Captain Karnal Sher Khan and Havildar Lalak Jan.',
          'Naik Saif Ali Janjua was awarded the Hilal-e-Kashmir for the 1948 fighting, later treated as equivalent to the Nishan-e-Haider.',
          'Learn two or three citations properly rather than the whole list badly — a board will ask what the man actually did.',
        ],
      },
      {
        heading: 'Conflicts to know',
        bullets: [
          'The first Kashmir war of 1947–48, which produced the ceasefire line that later became the Line of Control.',
          'The 1965 war, commemorated on 6 September, and the 1971 war, which ended in the separation of East Pakistan.',
          'The Kargil conflict of 1999 and the long counter-terrorism campaign in the tribal districts from 2001 onwards.',
        ],
      },
    ],
  },

  {
    slug: 'geography-of-pakistan',
    kind: 'gk',
    section: 'geography',
    titleEn: 'Geography of Pakistan',
    titleUr: 'پاکستان کا جغرافیہ',
    summaryEn:
      'Borders, mountains, rivers and passes. Pakistan sits where three great mountain systems meet and depends almost entirely on one river system, and those two facts explain most of its strategic and economic geography.',
    issbAngle:
      'Geography questions usually lead somewhere: why water matters, why a particular pass matters, why the coast matters. Answer the fact, then offer the consequence — that is the difference between a candidate who has memorised a map and one who has understood it.',
    facts: [
      { label: 'Neighbours', value: 'India, Afghanistan, Iran, China' },
      { label: 'Coastline', value: 'Arabian Sea, about 1,046 km' },
      { label: 'Border with Afghanistan', value: 'The Durand Line' },
      { label: 'Highest peak', value: 'K2, 8,611 metres — second highest in the world' },
      { label: 'Other 8,000 m peak', value: 'Nanga Parbat, 8,126 metres' },
      { label: 'Mountain ranges', value: 'Karakoram, Himalaya, Hindu Kush' },
      { label: 'Main river', value: 'The Indus' },
      { label: 'Eastern rivers', value: 'Jhelum, Chenab, Ravi, Sutlej' },
      { label: 'Major dams', value: 'Tarbela on the Indus; Mangla on the Jhelum' },
      { label: 'Deserts', value: 'Thar, Cholistan, Thal, Kharan' },
      { label: 'Major passes', value: 'Khyber, Bolan, Khunjerab, Lowari' },
      { label: 'Major glaciers', value: 'Siachen, Baltoro, Biafo' },
      { label: 'Main ports', value: 'Karachi, Port Qasim, Gwadar' },
    ],
    points: [
      {
        heading: 'A country of two halves',
        bullets: [
          'The north and west are mountain and plateau — the Karakoram, Himalaya and Hindu Kush meeting in the far north, and the Balochistan plateau in the south-west.',
          'The east and south are the Indus plain, which holds most of the population and almost all of the irrigated agriculture.',
          "Five of the world's fourteen peaks above 8,000 metres stand in Pakistan, all in the north.",
        ],
      },
      {
        heading: 'Water',
        bullets: [
          'The Indus and its tributaries support the largest contiguous irrigation system in the world, and the country has very little rainfall outside the monsoon.',
          'The Indus Waters Treaty of 1960, brokered by the World Bank, allotted the three western rivers to Pakistan and the three eastern rivers to India.',
          'Storage is limited relative to demand, which is why dam capacity and glacier melt are permanent policy questions rather than passing news.',
        ],
      },
      {
        heading: 'Position',
        bullets: [
          'Pakistan sits at the meeting point of South Asia, Central Asia, China and the Gulf, with the only warm-water access for much of that hinterland.',
          'The passes — Khyber and Bolan historically, Khunjerab today — are the reason the region has always mattered to powers outside it.',
          'Gwadar gives the coast strategic weight well beyond its size, and is the southern end of the China–Pakistan Economic Corridor.',
        ],
      },
    ],
  },

  {
    slug: 'constitution-of-pakistan',
    kind: 'gk',
    section: 'pakistan',
    titleEn: 'The Constitution of Pakistan',
    titleUr: 'آئینِ پاکستان',
    summaryEn:
      'Pakistan has had three constitutions. The 1973 constitution is the one in force: federal, parliamentary, and built on the principles first set out in the Objectives Resolution of 1949.',
    issbAngle:
      'Know the three constitutions and what distinguishes them. If asked about the federal structure, the useful point is that a bicameral parliament exists precisely so that smaller provinces are not outvoted by the largest — an answer about balance rather than about mechanics.',
    facts: [
      { label: 'Constitution in force', value: 'The Constitution of 1973' },
      { label: 'Adopted', value: '12 April 1973' },
      { label: 'Came into effect', value: '14 August 1973' },
      { label: 'Earlier constitutions', value: '1956 and 1962' },
      { label: 'First constitution', value: '1956 — Pakistan became an Islamic Republic' },
      { label: 'Objectives Resolution', value: 'March 1949' },
      { label: 'Form of government', value: 'Federal parliamentary republic' },
      { label: 'Parliament', value: 'Bicameral — National Assembly and Senate' },
      { label: 'Head of state', value: 'The President' },
      { label: 'Head of government', value: 'The Prime Minister' },
    ],
    points: [
      {
        heading: 'The three constitutions',
        bullets: [
          'The 1956 constitution made Pakistan an Islamic Republic and was abrogated within two years.',
          'The 1962 constitution introduced a presidential system under Ayub Khan and did not survive his departure.',
          'The 1973 constitution was passed by a unanimous National Assembly and is the only one to have been suspended and restored rather than replaced.',
        ],
      },
      {
        heading: 'Principles and structure',
        bullets: [
          'The Objectives Resolution of 1949 set out that sovereignty belongs to God, exercised by the people through their representatives, with rights guaranteed for minorities; it stands in the preamble.',
          'Power is divided between the federation and the provinces, with a list of federal subjects and the residue left to the provinces.',
          'The judiciary is headed by the Supreme Court, with High Courts in each province and the Federal Shariat Court for questions of conformity with Islamic injunctions.',
        ],
      },
      {
        heading: 'Amendments worth knowing',
        bullets: [
          'The Second Amendment, passed unanimously by the National Assembly on 7 September 1974, defined who is a Muslim for the purposes of the constitution and declared the Ahmadi or Qadiani community a non-Muslim minority. The date is observed each year as Youm-e-Tahaffuz-e-Khatm-e-Nubuwwat.',
          "The Eighteenth Amendment of 2010 devolved substantial subjects to the provinces and removed the President's power to dissolve the National Assembly.",
          "Amendments have repeatedly shifted the balance between the President and the Prime Minister, which is the central story of Pakistan's constitutional history.",
        ],
      },
    ],
  },

  {
    slug: 'pakistan-nuclear-programme',
    kind: 'gk',
    section: 'defence',
    titleEn: "Pakistan's nuclear programme",
    titleUr: 'پاکستان کا جوہری پروگرام',
    summaryEn:
      'Pakistan tested nuclear devices in May 1998, becoming the seventh declared nuclear power and the first in the Muslim world. The programme is presented as a deterrent adopted in response to the Indian programme.',
    issbAngle:
      'This comes up as a test of balance. The defensible position is deterrence and restraint: state the purpose, acknowledge the cost, and avoid triumphalism. A board is assessing judgement, not enthusiasm.',
    facts: [
      { label: 'First tests', value: '28 May 1998, Chagai district, Balochistan' },
      { label: 'Second test', value: '30 May 1998, Kharan' },
      { label: 'Commemorated as', value: 'Youm-e-Takbir, 28 May' },
      { label: 'Atomic Energy Commission founded', value: '1956' },
      { label: 'First nuclear power plant', value: 'KANUPP, Karachi' },
      {
        label: 'Associated scientists',
        value: 'Dr Abdul Qadeer Khan; Dr Ishfaq Ahmad; Dr Samar Mubarakmand',
      },
      { label: 'Command authority', value: 'The National Command Authority' },
    ],
    points: [
      {
        heading: 'How it developed',
        bullets: [
          "The Pakistan Atomic Energy Commission was set up in 1956 for civil purposes, and Karachi's first power reactor followed in the early 1970s.",
          'The Indian test of 1974 turned the programme decisively towards deterrence.',
          'Enrichment work at Kahuta and weapons design at the PAEC ran in parallel for two decades under international sanctions.',
        ],
      },
      {
        heading: 'May 1998 and after',
        bullets: [
          'India tested in May 1998; Pakistan responded within weeks with tests at Chagai on 28 May and at Kharan on 30 May.',
          'The tests brought immediate international sanctions and severe economic pressure.',
          'Command and control was later formalised under the National Command Authority, and Pakistan has maintained a declared policy of minimum credible deterrence.',
        ],
      },
    ],
    timeline: [
      { date: '1956', event: 'The Pakistan Atomic Energy Commission is established.' },
      { date: '1974', event: 'India conducts its first nuclear test.' },
      { date: '28 May 1998', event: 'Pakistan conducts nuclear tests at Chagai.' },
      { date: '30 May 1998', event: 'A further test is conducted at Kharan.' },
    ],
  },

  ...DEFENCE_TOPICS,
  ...ISLAMIC_TOPICS,
  ...WORLD_TOPICS,
  ...PAKISTAN_TOPICS,
  ...RECALL_TOPICS,
  ...ISSB_TOPICS,
  ...HISTORY_TOPICS,
]
