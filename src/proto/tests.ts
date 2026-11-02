import { ENNEAGRAM_QUESTIONS } from '../data/enneagramQuestions'
import { getType } from '../data/enneagramTypes'
import type { PropKind } from '../components/Characters'

// Prototype test catalogue. Every test is five quick statements answered on the
// same 1–5 face slider, so one quiz engine runs them all.

export interface Score { label: string; pct: number; color: string }

export interface TestResult {
  date: string
  code: string // headline, e.g. "Type 5", "INTJ", "High Openness"
  name: string // e.g. "The Investigator"
  blurb: string
  scores: Score[]
}

interface Statement { text: string; key: string }

export interface TestDef {
  id: string
  name: string
  color: string
  shape: string
  minutes: number
  teaser: string
  statements: Statement[]
  score: (answers: number[]) => Omit<TestResult, 'date'>
}

const pct = (v: number) => Math.round(((v - 1) / 4) * 100)
const byPct = (a: Score, b: Score) => b.pct - a.pct

// Pick the strongest key from a "top trait" test
function topTrait(
  statements: Statement[],
  answers: number[],
  traits: Record<string, { label: string; color: string; name: string; blurb: string; code?: string }>,
) {
  const scores = statements.map((s, i) => ({ key: s.key, label: traits[s.key].label, pct: pct(answers[i]), color: traits[s.key].color }))
  scores.sort(byPct)
  const top = traits[scores[0].key]
  return { code: top.code ?? `High ${top.label}`, name: top.name, blurb: top.blurb, scores: scores.map(({ label, pct, color }) => ({ label, pct, color })) }
}

const TYPE_COLORS: Record<number, string> = {
  1: '#8FB5FF', 2: '#FF9EC7', 3: '#FFC93C', 4: '#C9A7FF', 5: '#6FD6C8',
  6: '#9BE08A', 7: '#FFA36B', 8: '#FF8A8A', 9: '#9FD8FF',
}

const ENNEAGRAM_IDS = [13, 1, 22, 7, 25]

const SIXTEEN_NAMES: Record<string, string> = {
  INTJ: 'Architect', INTP: 'Logician', ENTJ: 'Commander', ENTP: 'Debater',
  INFJ: 'Advocate', INFP: 'Mediator', ENFJ: 'Protagonist', ENFP: 'Campaigner',
  ISTJ: 'Logistician', ISFJ: 'Defender', ESTJ: 'Executive', ESFJ: 'Consul',
  ISTP: 'Virtuoso', ISFP: 'Adventurer', ESTP: 'Entrepreneur', ESFP: 'Entertainer',
}
const AXES = [
  { key: 'IE', yes: 'I', no: 'E', yesLabel: 'Introverted', noLabel: 'Extraverted', color: '#9FD8FF' },
  { key: 'NS', yes: 'N', no: 'S', yesLabel: 'Intuitive', noLabel: 'Observant', color: '#FFC93C' },
  { key: 'TF', yes: 'T', no: 'F', yesLabel: 'Thinking', noLabel: 'Feeling', color: '#7FD46F' },
  { key: 'JP', yes: 'J', no: 'P', yesLabel: 'Judging', noLabel: 'Prospecting', color: '#FF9EC7' },
]

export const TESTS: TestDef[] = [
  {
    id: 'enneagram', name: 'Enneagram', color: '#6FD6C8', shape: '50%', minutes: 2,
    teaser: 'The core motivation behind what you do.',
    statements: ENNEAGRAM_IDS.map((id) => {
      const q = ENNEAGRAM_QUESTIONS.find((x) => x.id === id)!
      return { text: q.text, key: String(q.type) }
    }),
    score(answers) {
      const scores = this.statements.map((s, i) => ({ type: Number(s.key), pct: pct(answers[i]) })).sort((a, b) => b.pct - a.pct)
      const top = getType(scores[0].type)
      return {
        code: `Type ${top.number}`,
        name: `The ${top.name}`,
        blurb: top.description,
        scores: scores.slice(0, 3).map((s) => ({ label: getType(s.type).name, pct: s.pct, color: TYPE_COLORS[s.type] })),
      }
    },
  },
  {
    id: 'sixteen', name: '16 Personalities', color: '#C9A7FF', shape: '34%', minutes: 2,
    teaser: 'How you think, decide and recharge.',
    statements: [
      { text: 'After a busy week, I need time alone to recharge.', key: 'IE' },
      { text: 'I am drawn to big ideas more than practical details.', key: 'NS' },
      { text: 'I decide with logic first, feelings second.', key: 'TF' },
      { text: 'I like to have a plan and stick to it.', key: 'JP' },
      { text: 'I would rather think out loud on my own than in a group.', key: 'IE' },
    ],
    score(answers) {
      const axis = AXES.map((a) => {
        const vals = this.statements.map((s, i) => (s.key === a.key ? pct(answers[i]) : null)).filter((v): v is number => v !== null)
        const p = Math.round(vals.reduce((x, y) => x + y, 0) / vals.length)
        const yes = p >= 50
        return { letter: yes ? a.yes : a.no, label: yes ? a.yesLabel : a.noLabel, pct: yes ? Math.max(p, 50) : 100 - p, color: a.color }
      })
      const code = axis.map((a) => a.letter).join('')
      return {
        code,
        name: `The ${SIXTEEN_NAMES[code]}`,
        blurb: `${code}s combine ${axis.map((a) => a.label.toLowerCase()).join(', ')} preferences into a distinctive way of seeing the world.`,
        scores: axis.map(({ label, pct, color }) => ({ label, pct, color })),
      }
    },
  },
  {
    id: 'bigfive', name: 'Big Five', color: '#FFC93C', shape: '42% 58% 62% 38% / 40% 44% 56% 60%', minutes: 2,
    teaser: 'The five traits psychologists trust most.',
    statements: [
      { text: 'I love exploring new ideas, art and experiences.', key: 'O' },
      { text: 'I keep my commitments and pay attention to detail.', key: 'C' },
      { text: 'I feel energised in big, lively groups.', key: 'E' },
      { text: 'I go out of my way to keep the peace.', key: 'A' },
      { text: 'I tend to worry about things going wrong.', key: 'N' },
    ],
    score(answers) {
      return topTrait(this.statements, answers, {
        O: { label: 'Openness', color: '#C9A7FF', name: 'The Explorer', blurb: 'Curious and imaginative, you are energised by new ideas and experiences.' },
        C: { label: 'Conscientious', color: '#8FB5FF', name: 'The Organiser', blurb: 'Reliable and thorough, you turn plans into finished work.' },
        E: { label: 'Extraversion', color: '#FFA36B', name: 'The Connector', blurb: 'Outgoing and warm, you draw energy from other people.' },
        A: { label: 'Agreeable', color: '#7FD46F', name: 'The Peacekeeper', blurb: 'Kind and cooperative, you bring people together.' },
        N: { label: 'Sensitivity', color: '#FF8A8A', name: 'The Feeler', blurb: 'You notice risks early and feel things deeply.' },
      })
    },
  },
  {
    id: 'love', name: 'Love Languages', color: '#FF9EC7', shape: '50% 50% 42% 42% / 62% 62% 38% 38%', minutes: 2,
    teaser: 'How you give and receive care.',
    statements: [
      { text: 'Hearing “I appreciate you” makes my day.', key: 'words' },
      { text: 'Uninterrupted time together matters most to me.', key: 'time' },
      { text: 'A thoughtful little gift means a lot to me.', key: 'gifts' },
      { text: 'I feel loved when someone helps without being asked.', key: 'acts' },
      { text: 'A hug says more than words ever could.', key: 'touch' },
    ],
    score(answers) {
      return topTrait(this.statements, answers, {
        words: { label: 'Words', code: 'Words of Affirmation', color: '#FF9EC7', name: 'Your love language', blurb: 'Kind, specific words are how you feel most cared for.' },
        time: { label: 'Quality Time', code: 'Quality Time', color: '#C9A7FF', name: 'Your love language', blurb: 'Full, undivided attention is your love language.' },
        gifts: { label: 'Gifts', code: 'Receiving Gifts', color: '#FFC93C', name: 'Your love language', blurb: 'Thoughtful tokens show you that someone was thinking of you.' },
        acts: { label: 'Acts of Service', code: 'Acts of Service', color: '#7FD46F', name: 'Your love language', blurb: 'Actions speak loudest: help is how you feel loved.' },
        touch: { label: 'Touch', code: 'Physical Touch', color: '#FFA36B', name: 'Your love language', blurb: 'Closeness and touch make you feel safe and connected.' },
      })
    },
  },
  {
    id: 'disc', name: 'DISC', color: '#FFA36B', shape: '30%', minutes: 2,
    teaser: 'How you work, lead and communicate.',
    statements: [
      { text: 'I like to take charge and move fast.', key: 'D' },
      { text: 'I get people excited about ideas.', key: 'I' },
      { text: 'I am the steady one people rely on.', key: 'S' },
      { text: 'I double-check facts before I act.', key: 'C' },
      { text: 'I enjoy a challenge more than a routine.', key: 'D' },
    ],
    score(answers) {
      const traits: Record<string, { label: string; color: string; name: string; blurb: string }> = {
        D: { label: 'Dominance', color: '#FF8A8A', name: 'The Driver', blurb: 'Direct and decisive, you push for results.' },
        I: { label: 'Influence', color: '#FFC93C', name: 'The Inspirer', blurb: 'Enthusiastic and persuasive, you rally people.' },
        S: { label: 'Steadiness', color: '#7FD46F', name: 'The Supporter', blurb: 'Patient and dependable, you keep teams steady.' },
        C: { label: 'Conscientiousness', color: '#8FB5FF', name: 'The Analyst', blurb: 'Precise and careful, you value getting it right.' },
      }
      const totals: Record<string, number[]> = {}
      this.statements.forEach((s, i) => (totals[s.key] ??= []).push(pct(answers[i])))
      const scores = Object.entries(totals).map(([k, v]) => ({ k, pct: Math.round(v.reduce((a, b) => a + b, 0) / v.length) })).sort((a, b) => b.pct - a.pct)
      const top = traits[scores[0].k]
      return { code: `High ${scores[0].k}`, name: top.name, blurb: top.blurb, scores: scores.map((s) => ({ label: traits[s.k].label, pct: s.pct, color: traits[s.k].color })) }
    },
  },
  {
    id: 'strengths', name: 'Strengths', color: '#7FD46F', shape: '46% 54% 50% 50% / 50% 46% 54% 50%', minutes: 2,
    teaser: 'The talents you lean on most.',
    statements: [
      { text: 'I see patterns other people miss.', key: 'strategic' },
      { text: 'I can’t rest until a job is finished.', key: 'achiever' },
      { text: 'I love learning something new every day.', key: 'learner' },
      { text: 'I easily sense how others are feeling.', key: 'empathy' },
      { text: 'I bring order to messy situations.', key: 'arranger' },
    ],
    score(answers) {
      return topTrait(this.statements, answers, {
        strategic: { label: 'Strategic', code: 'Strategic', color: '#C9A7FF', name: 'The Strategist', blurb: 'You spot the best route through complexity.' },
        achiever: { label: 'Achiever', code: 'Achiever', color: '#FFA36B', name: 'The Achiever', blurb: 'You have stamina and love getting things done.' },
        learner: { label: 'Learner', code: 'Learner', color: '#9FD8FF', name: 'The Learner', blurb: 'The process of learning energises you.' },
        empathy: { label: 'Empathy', code: 'Empathy', color: '#FF9EC7', name: 'The Empath', blurb: 'You feel what others feel and respond with care.' },
        arranger: { label: 'Arranger', code: 'Arranger', color: '#7FD46F', name: 'The Arranger', blurb: 'You organise people and resources with ease.' },
      })
    },
  },
]

export const getTest = (id: string) => TESTS.find((t) => t.id === id)

// Sample results so the prototype opens on a lived-in profile
export const SEED_RESULTS: Record<string, TestResult> = {
  enneagram: {
    date: 'Mar 2026', code: 'Type 5', name: 'The Investigator',
    blurb: getType(5).description,
    scores: [{ label: 'Investigator', pct: 84, color: '#6FD6C8' }, { label: 'Individualist', pct: 66, color: '#C9A7FF' }, { label: 'Reformer', pct: 52, color: '#8FB5FF' }],
  },
  sixteen: {
    date: 'Jun 2026', code: 'INTJ', name: 'The Architect',
    blurb: 'Imaginative and strategic thinkers with a plan for everything. INTJs build ideas carefully and quietly.',
    scores: [{ label: 'Introverted', pct: 72, color: '#9FD8FF' }, { label: 'Intuitive', pct: 64, color: '#FFC93C' }, { label: 'Thinking', pct: 58, color: '#7FD46F' }, { label: 'Judging', pct: 61, color: '#FF9EC7' }],
  },
  bigfive: {
    date: 'Sep 2026', code: 'High Openness', name: 'The Explorer',
    blurb: 'Curious and imaginative, you are energised by new ideas and experiences.',
    scores: [{ label: 'Openness', pct: 82, color: '#C9A7FF' }, { label: 'Conscientious', pct: 68, color: '#8FB5FF' }, { label: 'Agreeable', pct: 55, color: '#7FD46F' }, { label: 'Sensitivity', pct: 40, color: '#FF8A8A' }, { label: 'Extraversion', pct: 31, color: '#FFA36B' }],
  },
}

// Every result gets a character prop, worked out from the result itself so
// results saved earlier get one too
const ENNEAGRAM_PROPS: Record<number, PropKind> = {
  1: 'clipboard', 2: 'heart', 3: 'trophy', 4: 'beret', 5: 'investigator',
  6: 'shield', 7: 'partyhat', 8: 'glove', 9: 'sprout',
}
const RESULT_PROPS: Record<string, PropKind> = {
  // Big Five
  'The Explorer': 'compass', 'The Organiser': 'clipboard', 'The Connector': 'speech', 'The Peacekeeper': 'heart', 'The Feeler': 'cloud',
  // Love Languages (headline)
  'Words of Affirmation': 'speech', 'Quality Time': 'hourglass', 'Receiving Gifts': 'gift', 'Acts of Service': 'wrench', 'Physical Touch': 'heart',
  // DISC
  'The Driver': 'lightning', 'The Inspirer': 'megaphone', 'The Supporter': 'shield', 'The Analyst': 'book',
  // Strengths
  'The Strategist': 'pawn', 'The Achiever': 'trophy', 'The Learner': 'book', 'The Empath': 'heart', 'The Arranger': 'clipboard',
}

export function propFor(testId: string, result: TestResult): PropKind | undefined {
  if (testId === 'enneagram') return ENNEAGRAM_PROPS[Number(result.code.replace(/\D/g, ''))]
  if (testId === 'sixteen') {
    const c = result.code
    if (c === 'INTJ') return 'architect'
    if (c[1] === 'N') return c[2] === 'T' ? 'lightbulb' : 'beret'
    return c[3] === 'J' ? 'clipboard' : 'sunglasses'
  }
  return RESULT_PROPS[result.code] ?? RESULT_PROPS[result.name]
}
