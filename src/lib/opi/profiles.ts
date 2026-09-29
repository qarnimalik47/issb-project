/**
 * What an OPI result says: sixteen type profiles, the five trait scales and the
 * four officer-like-quality clusters they feed.
 *
 * The four-letter code is the familiar one (E/I, N/S, F/T, J/P), derived here
 * from Big-Five scores — the correspondence McCrae & Costa reported in 1989:
 * Extraversion ↔ E/I, Openness ↔ N/S, Agreeableness ↔ F/T, Conscientiousness
 * ↔ J/P. Emotional stability adds a Steady / Reactive variant. All wording and
 * type names below are this platform's own.
 */
import type { Trait } from './items'

export type TypeProfile = {
  name: string
  tagline: string
  summary: string
  strengths: string[]
  watchOuts: string[]
  atTheBoard: string
}

export const TYPE_PROFILES: Record<string, TypeProfile> = {
  INTJ: {
    name: 'The Strategist',
    tagline: 'Sees the whole board and plans three moves ahead.',
    summary:
      'You think in systems and long timelines. You prefer to work out a plan quietly, then execute it with discipline, and you are rarely satisfied with "good enough". People trust your judgement even when they find you hard to read.',
    strengths: [
      'Long-range planning',
      'Independent judgement',
      'High personal standards',
      'Calm analysis of complex problems',
    ],
    watchOuts: [
      'Can appear aloof or dismissive of slower thinkers',
      'May decide alone when the group expects to be consulted',
      'Impatient with routine that seems pointless',
    ],
    atTheBoard:
      'Your planning shines in GPE and the command task. In group tasks, say your reasoning out loud and bring others in — the GTO scores how you influence the group, not only whether your idea was right.',
  },
  INTP: {
    name: 'The Theorist',
    tagline: 'Takes problems apart to see how they really work.',
    summary:
      'You are curious, precise and happiest when a problem is genuinely hard. You question assumptions, spot flaws in arguments and enjoy ideas for their own sake. Deadlines and details can slide while your mind is on the bigger puzzle.',
    strengths: [
      'Original, logical thinking',
      'Quick to grasp new concepts',
      'Objective under criticism',
      'Finds the flaw others miss',
    ],
    watchOuts: [
      'Can over-think and act late',
      'Follow-through on routine tasks may lapse',
      'May come across as detached in a group',
    ],
    atTheBoard:
      'Intelligence tests and planning suit you. Practise deciding within the time limit in SRT and GPE — an adequate plan on time beats a perfect one never written.',
  },
  ENTJ: {
    name: 'The Director',
    tagline: 'Takes charge, sets the direction, drives it home.',
    summary:
      'You are decisive, organised and naturally step forward when a group needs leading. You like clear goals, efficient methods and people who pull their weight. Your energy moves things, though it can flatten quieter voices.',
    strengths: [
      'Natural initiative and command',
      'Decisive under pressure',
      'Organises people and resources well',
      'Confident, clear communicator',
    ],
    watchOuts: [
      'Can dominate discussion',
      'May overrule good ideas from others too quickly',
      'Low patience with emotion or hesitation',
    ],
    atTheBoard:
      'Group tasks reward your initiative, but the GTO marks down candidates who bulldoze. Lead by asking, listening, then deciding — and give credit to others’ ideas you adopt.',
  },
  ENTP: {
    name: 'The Innovator',
    tagline: 'Never met a problem without three new angles on it.',
    summary:
      'You are quick-witted, inventive and energised by debate. You see possibilities others miss and enjoy challenging the obvious answer. Starting things comes easily; finishing them takes more effort.',
    strengths: [
      'Inventive problem-solving',
      'Persuasive and articulate',
      'Adapts quickly to change',
      'Keeps a group lively',
    ],
    watchOuts: [
      'Argues for the sake of it',
      'Can leave tasks unfinished',
      'May seem unreliable if promises outrun delivery',
    ],
    atTheBoard:
      'You will be memorable in group discussion. Make sure it is for good reasons — build on others’ points rather than contradicting every one, and show you can see a plan through.',
  },
  INFJ: {
    name: 'The Guide',
    tagline: 'Quietly purposeful, with a strong inner compass.',
    summary:
      'You combine deep concern for people with a clear sense of what is right. You notice what others feel before they say it and work steadily towards goals that matter to you. You keep much of yourself private.',
    strengths: [
      'Insight into people',
      'Principled and dependable',
      'Thoughtful long-term vision',
      'Calm, encouraging presence',
    ],
    watchOuts: [
      'Can hold back opinions in a loud group',
      'Takes criticism personally',
      'May burn out carrying others’ problems',
    ],
    atTheBoard:
      'Your sense of responsibility and cooperation reads well. In group tasks, speak early — the GTO can only score the initiative you visibly show.',
  },
  INFP: {
    name: 'The Idealist',
    tagline: 'Guided by values, loyal to what — and who — matters.',
    summary:
      'You are sincere, imaginative and driven by personal values rather than outside pressure. You are gentle with people and fierce about causes you believe in. Structure and hard deadlines can feel confining.',
    strengths: [
      'Strong personal integrity',
      'Empathy and kindness',
      'Creative expression',
      'Loyal to team and cause',
    ],
    watchOuts: [
      'May avoid conflict even when it is needed',
      'Can struggle with routine and schedules',
      'Tends to self-criticise',
    ],
    atTheBoard:
      'Your stories and self-description will be warm and genuine. Show practical action too: in SRT and stories, have your hero decide and act, not only feel.',
  },
  ENFJ: {
    name: 'The Mentor',
    tagline: 'Brings people together and brings out their best.',
    summary:
      'You are warm, articulate and naturally attentive to how a group is doing. People follow you because you make them feel valued. You take responsibility readily, sometimes more than is good for you.',
    strengths: [
      'Influences and motivates a group',
      'Excellent social adaptability',
      'Clear, persuasive speaker',
      'Takes responsibility',
    ],
    watchOuts: [
      'Seeks approval; may say yes too often',
      'Can neglect own needs',
      'Sometimes avoids hard, unpopular calls',
    ],
    atTheBoard:
      'Group discussion and group tasks suit you well. Balance harmony with decisiveness — when the group stalls, make the call.',
  },
  ENFP: {
    name: 'The Motivator',
    tagline: 'Enthusiasm that is contagious.',
    summary:
      'You are energetic, imaginative and people-focused. You spark ideas, lift the mood and connect easily with almost anyone. Your interest can move on before the current task is finished.',
    strengths: [
      'Liveliness and optimism',
      'Connects quickly with people',
      'Creative ideas',
      'Adapts to new situations',
    ],
    watchOuts: ['Scattered focus', 'Weak follow-through on detail', 'May overcommit'],
    atTheBoard:
      'Liveliness and social effectiveness are strengths the GTO looks for. Pair them with visible planning — lay out steps before you charge in.',
  },
  ISTJ: {
    name: 'The Steward',
    tagline: 'Reliable, thorough, and true to their word.',
    summary:
      'You are dependable, methodical and serious about duty. You respect rules and proven methods, prepare carefully and finish what you start. You may take time to warm to new people or unfamiliar approaches.',
    strengths: [
      'Strong sense of responsibility',
      'Organised and punctual',
      'Attention to detail',
      'Steady under routine pressure',
    ],
    watchOuts: [
      'Can be rigid when plans change',
      'Reserved in groups',
      'Slow to take social initiative',
    ],
    atTheBoard:
      'Your reliability and organising ability are core officer qualities. In group settings, push yourself to speak and propose ideas first rather than waiting to be asked.',
  },
  ISFJ: {
    name: 'The Custodian',
    tagline: 'Looks after people, quietly and faithfully.',
    summary:
      'You are caring, conscientious and loyal. You remember details about people, keep your commitments and do the unglamorous work that keeps a team running. You rarely ask for recognition.',
    strengths: [
      'Dependable and hardworking',
      'Cooperative team member',
      'Attentive to others’ needs',
      'Practical and careful',
    ],
    watchOuts: ['Undersells own achievements', 'Avoids confrontation', 'May hesitate to lead'],
    atTheBoard:
      'Cooperation and responsibility come through strongly. Work on self-confidence: state your views firmly in discussion and volunteer to lead a task.',
  },
  ESTJ: {
    name: 'The Organiser',
    tagline: 'Makes the plan, assigns the jobs, gets it done.',
    summary:
      'You are practical, decisive and orderly. You like clear roles and standards, and you are comfortable being the one who holds people to them. Results matter to you more than debate.',
    strengths: [
      'Organising people and tasks',
      'Decisive and direct',
      'Responsible and punctual',
      'Leads by example',
    ],
    watchOuts: [
      'Can be blunt or inflexible',
      'May overlook feelings',
      'Impatient with unconventional ideas',
    ],
    atTheBoard:
      'You fit the command and planning tasks naturally. Show flexibility — adopt a better idea from a teammate, and explain rather than order.',
  },
  ESFJ: {
    name: 'The Harmoniser',
    tagline: 'Keeps the team together and the spirit high.',
    summary:
      'You are sociable, helpful and highly attuned to how people are getting on. You organise events, remember birthdays and smooth over friction. You work best with clear expectations and appreciation.',
    strengths: [
      'Social adaptability',
      'Cooperation and team spirit',
      'Practical organiser',
      'Warm and approachable',
    ],
    watchOuts: [
      'Sensitive to criticism',
      'May follow the group rather than lead it',
      'Can avoid necessary conflict',
    ],
    atTheBoard:
      'You will bond easily with your group. Make sure you also influence it — put forward your own solution, and defend it with reasons when challenged.',
  },
  ISTP: {
    name: 'The Technician',
    tagline: 'Cool-headed, hands-on, fixes things that break.',
    summary:
      'You are practical, observant and calm in a crisis. You learn by doing, prefer action to talk and are good with tools, machines and physical problems. Long discussions and rigid schedules bore you.',
    strengths: [
      'Composure under pressure',
      'Practical problem-solving',
      'Mechanical and spatial sense',
      'Independent and resourceful',
    ],
    watchOuts: ['Says little in groups', 'Can appear indifferent', 'Dislikes long-term planning'],
    atTheBoard:
      'Obstacle and group tasks play to your strengths. Explain your solution to the group before acting — silent competence is easy for the GTO to miss.',
  },
  ISFP: {
    name: 'The Observer',
    tagline: 'Gentle, perceptive, lives in the present.',
    summary:
      'You are sensitive, modest and quietly adventurous. You notice beauty and detail, value personal freedom and show care through actions rather than words. You avoid the spotlight and dislike conflict.',
    strengths: [
      'Kind and tolerant',
      'Adaptable in the moment',
      'Keen practical observation',
      'Loyal to people you trust',
    ],
    watchOuts: [
      'Reluctant to assert yourself',
      'Avoids planning ahead',
      'May withdraw under criticism',
    ],
    atTheBoard:
      'Your sincerity is an asset. Build visible initiative and self-confidence: speak in the first minutes of group discussion and take charge of at least one task.',
  },
  ESTP: {
    name: 'The Troubleshooter',
    tagline: 'Acts fast, thinks on their feet, loves a challenge.',
    summary:
      'You are energetic, bold and practical. You read situations quickly, take risks and enjoy physical challenge and competition. Rules and theory interest you less than what works right now.',
    strengths: [
      'Quick decisions in a crisis',
      'Courage and energy',
      'Persuasive and sociable',
      'Practical resourcefulness',
    ],
    watchOuts: ['Can be impulsive', 'May skip planning', 'Gets restless with routine'],
    atTheBoard:
      'Outdoor tasks will show your courage and stamina. In GPE and SRT, pause to plan: the psychologist looks for considered action, not only fast action.',
  },
  ESFP: {
    name: 'The Energiser',
    tagline: 'Brings life, warmth and fun to any group.',
    summary:
      'You are outgoing, spontaneous and generous. You enjoy people, experiences and making others laugh, and you respond well in the moment. Long-range planning and paperwork are not your favourite things.',
    strengths: [
      'Liveliness and warmth',
      'Adaptable and sociable',
      'Practical in the moment',
      'Encourages others',
    ],
    watchOuts: ['Avoids long-term planning', 'Easily distracted', 'May avoid difficult topics'],
    atTheBoard:
      'Your liveliness helps a group bond. Balance it with seriousness of purpose — show you can plan and organise, not only energise.',
  },
}

export type TraitInfo = {
  label: string
  /** Names of the two poles, low first. */
  low: string
  high: string
  describeLow: string
  describeMid: string
  describeHigh: string
}

export const TRAITS: Record<Trait, TraitInfo> = {
  E: {
    label: 'Extraversion',
    low: 'Reserved',
    high: 'Outgoing',
    describeLow:
      'You recharge alone, think before you speak and prefer a few close friends to a crowd. At the board, make a conscious effort to speak early and often in group settings.',
    describeMid:
      'You are comfortable both in company and on your own, and adjust to the situation. Use that flexibility: take the lead in groups when it is needed.',
    describeHigh:
      'You draw energy from people, speak readily and enjoy being noticed. At the board, channel this into leading the group rather than dominating it.',
  },
  A: {
    label: 'Agreeableness',
    low: 'Challenging',
    high: 'Cooperative',
    describeLow:
      'You are frank, competitive and ready to challenge people. That can drive standards up, but work on tact — the board values cooperation and social adjustment.',
    describeMid:
      'You balance concern for others with a willingness to disagree. That is a healthy mix for leading a team.',
    describeHigh:
      'You are considerate, trusting and cooperative. Make sure kindness does not stop you taking hard, unpopular decisions.',
  },
  C: {
    label: 'Conscientiousness',
    low: 'Flexible',
    high: 'Disciplined',
    describeLow:
      'You are spontaneous and adaptable but can be disorganised. Building routines — a timetable, a checklist — would strengthen the planning and organising qualities the board assesses.',
    describeMid:
      'You organise when it matters and relax when it does not. Aim to be consistently dependable in duties others rely on.',
    describeHigh:
      'You are organised, dutiful and persistent — strong foundations for an officer. Guard against rigidity when a plan has to change.',
  },
  S: {
    label: 'Emotional stability',
    low: 'Reactive',
    high: 'Steady',
    describeLow:
      'You feel stress and setbacks strongly. That sensitivity is human, but practise composure — steady breathing, preparation, sleep — because the board tests how you hold up under pressure.',
    describeMid:
      'You handle most pressure well but have your moments. Knowing your triggers helps you stay composed on the day.',
    describeHigh:
      'You stay calm, recover quickly and are rarely rattled. That composure is exactly what the board wants to see under stress.',
  },
  O: {
    label: 'Openness',
    low: 'Practical',
    high: 'Imaginative',
    describeLow:
      'You prefer the concrete and the proven over theory. Practical sense is valuable; broaden your reading and current-affairs knowledge for discussion and interview.',
    describeMid:
      'You mix practical sense with curiosity. That balance serves well in both planning and discussion.',
    describeHigh:
      'You are curious, imaginative and quick with ideas — good for planning and discussion. Make sure ideas turn into workable plans.',
  },
}

/**
 * The board groups its officer-like qualities into four factors. These weights
 * map the Big Five onto them for a practice indication only — the real
 * assessment comes from every test and the conference, not one questionnaire.
 */
export const OLQ_FACTORS: {
  key: string
  label: string
  qualities: string
  weights: Partial<Record<Trait, number>>
}[] = [
  {
    key: 'planning',
    label: 'Planning & organising',
    qualities: 'Effective intelligence, reasoning, organising ability, power of expression',
    weights: { O: 0.5, C: 0.5 },
  },
  {
    key: 'social_adjustment',
    label: 'Social adjustment',
    qualities: 'Social adaptability, cooperation, sense of responsibility',
    weights: { A: 0.5, C: 0.25, S: 0.25 },
  },
  {
    key: 'social_effectiveness',
    label: 'Social effectiveness',
    qualities: 'Initiative, self-confidence, decisiveness, ability to influence, liveliness',
    weights: { E: 0.5, S: 0.3, O: 0.2 },
  },
  {
    key: 'dynamic',
    label: 'Dynamic',
    qualities: 'Determination, courage, stamina',
    weights: { C: 0.4, S: 0.4, E: 0.2 },
  },
]
