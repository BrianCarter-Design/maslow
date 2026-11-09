import { getType } from '../data/enneagramTypes'
import type { Mood } from '../components/BlobFace'
import type { TestResult } from './tests'
import { useProto } from './store'

// Sample social graph for the prototype: friends, their own results, what they
// think of you, requests waiting for you and a recent activity feed.

export interface Friend {
  id: string
  first: string
  last: string
  color: string
  shape: string
  mood: number | Mood
  joined: boolean
  results: Record<string, TestResult>
}

const ennea = (n: number, date: string, mix: [number, number][]): TestResult => {
  const t = getType(n)
  const colors: Record<number, string> = { 1: '#00A0FC', 2: '#FC75C6', 3: '#FCCD03', 4: '#7659FF', 5: '#63D6FF', 6: '#05D16F', 7: '#FF8500', 8: '#F23F39', 9: '#63D6FF' }
  return {
    date, code: `Type ${n}`, name: `The ${t.name}`, blurb: t.description,
    scores: mix.map(([k, pct]) => ({ label: getType(k).name, pct, color: colors[k] })),
  }
}
const sixteen = (code: string, name: string, date: string, pcts: [number, number, number, number]): TestResult => {
  const labels: Record<string, string> = { I: 'Introverted', E: 'Extraverted', N: 'Intuitive', S: 'Observant', T: 'Thinking', F: 'Feeling', J: 'Judging', P: 'Prospecting' }
  const colors = ['#63D6FF', '#FCCD03', '#05D16F', '#FC75C6']
  return {
    date, code, name: `The ${name}`,
    blurb: `${code}s bring a distinctive mix of ${[...code].map((l) => labels[l].toLowerCase()).join(', ')} preferences.`,
    scores: [...code].map((l, i) => ({ label: labels[l], pct: pcts[i], color: colors[i] })),
  }
}
const simple = (code: string, name: string, date: string, blurb: string, scores: [string, number, string][]): TestResult => ({
  date, code, name, blurb, scores: scores.map(([label, pct, color]) => ({ label, pct, color })),
})

export const FRIENDS: Friend[] = [
  {
    id: 'maya', first: 'Maya', last: 'Chen', color: '#FC75C6', shape: '50% 50% 42% 42% / 62% 62% 38% 38%', mood: 5, joined: true,
    results: {
      enneagram: ennea(3, 'Oct 2026', [[3, 92], [9, 70], [1, 48]]),
      sixteen: sixteen('ENFP', 'Campaigner', 'Sep 2026', [78, 81, 62, 70]),
      love: simple('Quality Time', 'Your love language', 'Oct 2026', 'Full, undivided attention is your love language.', [['Quality Time', 100, '#7659FF'], ['Words', 75, '#FC75C6'], ['Touch', 50, '#FF8500']]),
    },
  },
  {
    id: 'leo', first: 'Leo', last: 'Okafor', color: '#00A0FC', shape: '34%', mood: 4, joined: true,
    results: {
      enneagram: ennea(8, 'Nov 2026', [[8, 100], [3, 75], [5, 50]]),
      disc: simple('High D', 'The Driver', 'Oct 2026', 'Direct and decisive, you push for results.', [['Dominance', 94, '#F23F39'], ['Influence', 63, '#FCCD03'], ['Conscientiousness', 40, '#00A0FC']]),
      bigfive: simple('High Extraversion', 'The Connector', 'Aug 2026', 'Outgoing and warm, you draw energy from other people.', [['Extraversion', 88, '#FF8500'], ['Openness', 70, '#7659FF'], ['Agreeable', 52, '#05D16F']]),
    },
  },
  {
    id: 'priya', first: 'Priya', last: 'Shah', color: '#FCCD03', shape: '42% 58% 62% 38% / 40% 44% 56% 60%', mood: 'wink', joined: true,
    results: {
      sixteen: sixteen('INTJ', 'Architect', 'Oct 2026', [80, 71, 66, 59]),
      strengths: simple('Strategic', 'The Strategist', 'Sep 2026', 'You spot the best route through complexity.', [['Strategic', 100, '#7659FF'], ['Learner', 75, '#63D6FF'], ['Achiever', 50, '#FF8500']]),
      enneagram: ennea(5, 'Jul 2026', [[5, 88], [1, 62], [9, 40]]),
    },
  },
  {
    id: 'sam', first: 'Sam', last: 'Rivera', color: '#05D16F', shape: '46% 54% 50% 50% / 50% 46% 54% 50%', mood: 'rest', joined: true,
    results: {
      sixteen: sixteen('INFP', 'Mediator', 'Oct 2026', [74, 69, 64, 72]),
    },
  },
  {
    id: 'jules', first: 'Jules', last: 'Martin', color: '#FF8500', shape: '30%', mood: 'wow', joined: true,
    results: {
      bigfive: simple('High Openness', 'The Explorer', 'Nov 2026', 'Curious and imaginative, you are energised by new ideas and experiences.', [['Openness', 91, '#7659FF'], ['Extraversion', 66, '#FF8500'], ['Agreeable', 58, '#05D16F']]),
      love: simple('Words of Affirmation', 'Your love language', 'Sep 2026', 'Kind, specific words are how you feel most cared for.', [['Words', 100, '#FC75C6'], ['Quality Time', 75, '#7659FF'], ['Gifts', 25, '#FCCD03']]),
    },
  },
  {
    id: 'noah', first: 'Noah', last: 'Kim', color: '#63D6FF', shape: '50%', mood: 'sleep', joined: false,
    results: {},
  },
]

export const getFriend = (id: string) => FRIENDS.find((f) => f.id === id)

// Assessments friends took about you ("for you")
export interface AboutYou { id: string; friendId: string; testId: string; when: string; note: string; result: TestResult }

export const ABOUT_YOU: AboutYou[] = [
  { id: 'a1', friendId: 'maya', testId: 'enneagram', when: '2h ago', note: 'You’re always chasing the next big goal 😅', result: ennea(3, 'Nov 2026', [[3, 84], [5, 70], [1, 52]]) },
  { id: 'a2', friendId: 'leo', testId: 'enneagram', when: 'Yesterday', note: 'Classic you, always researching everything.', result: ennea(5, 'Nov 2026', [[5, 90], [8, 58], [9, 41]]) },
  { id: 'a3', friendId: 'priya', testId: 'sixteen', when: 'Oct 28', note: 'Takes one to know one.', result: sixteen('INTJ', 'Architect', 'Oct 2026', [76, 70, 64, 68]) },
  { id: 'a4', friendId: 'jules', testId: 'bigfive', when: 'Oct 20', note: 'You never stop asking “what if?”', result: simple('High Openness', 'The Explorer', 'Oct 2026', 'Curious and imaginative, you are energised by new ideas and experiences.', [['Openness', 88, '#7659FF'], ['Conscientious', 74, '#00A0FC'], ['Extraversion', 28, '#FF8500']]) },
  { id: 'a5', friendId: 'maya', testId: 'love', when: 'Oct 12', note: 'You show love by fixing things for people.', result: simple('Acts of Service', 'Your love language', 'Oct 2026', 'Actions speak loudest: help is how you feel loved.', [['Acts of Service', 100, '#05D16F'], ['Quality Time', 75, '#7659FF'], ['Words', 25, '#FC75C6']]) },
]

// Requests waiting for you: take an assessment for yourself, or about a friend
export interface Request { id: string; friendId: string; testId: string; mode: 'self' | 'about'; when: string; message: string }

export const REQUESTS: Request[] = [
  { id: 'r1', friendId: 'sam', testId: 'enneagram', mode: 'about', when: '1h ago', message: 'Be honest, what type am I? 🙈' },
  { id: 'r2', friendId: 'jules', testId: 'disc', mode: 'self', when: '3h ago', message: 'Let’s compare work styles before Monday’s kickoff!' },
  { id: 'r3', friendId: 'leo', testId: 'sixteen', mode: 'about', when: 'Yesterday', message: 'Everyone says I’m an ENTJ. Are they right?' },
]

// Recent friend activity
export interface Activity { id: string; friendId: string; when: string; kind: 'result' | 'about-you' | 'twin' | 'joined'; testId?: string; text: string; cta?: string; to?: string }

export const ACTIVITY: Activity[] = [
  { id: 'f1', friendId: 'maya', when: '2h ago', kind: 'about-you', testId: 'enneagram', text: 'took the Enneagram for you and sees you as The Achiever', cta: 'See how Maya sees you', to: '/play/test/enneagram/result' },
  { id: 'f2', friendId: 'leo', when: '5h ago', kind: 'result', testId: 'enneagram', text: 'is Type 8, The Challenger', cta: 'Compare with Leo', to: '/play/friend/leo' },
  { id: 'f3', friendId: 'priya', when: 'Yesterday', kind: 'twin', testId: 'sixteen', text: 'is an INTJ too. You’re personality twins!', cta: 'See what you share', to: '/play/friend/priya' },
  { id: 'f4', friendId: 'jules', when: 'Nov 1', kind: 'result', testId: 'bigfive', text: 'is High Openness, The Explorer', cta: 'Compare with Jules', to: '/play/friend/jules' },
  { id: 'f5', friendId: 'sam', when: 'Oct 30', kind: 'joined', text: 'joined Maslow from your invite 🎉', cta: 'Say hi', to: '/play/friend/sam' },
]

// Requests that still need an answer
export function usePendingRequests() {
  const { social } = useProto()
  return REQUESTS.filter((r) => !social.doneRequests.includes(r.id) && !social.dismissed.includes(r.id))
}
