export interface Question {
  id: number
  text: string
  type: number
}

export const ENNEAGRAM_QUESTIONS: Question[] = [
  // Type 1 – Reformer
  { id: 1,  type: 1, text: 'I have a strong inner critic that notices when things aren\'t done correctly.' },
  { id: 2,  type: 1, text: 'I feel a deep sense of responsibility to do what\'s right, even when it\'s hard.' },
  { id: 3,  type: 1, text: 'I often feel subtle resentment when others don\'t meet the standards I hold.' },

  // Type 2 – Helper
  { id: 4,  type: 2, text: 'I feel most fulfilled when I\'m genuinely helping someone solve a problem.' },
  { id: 5,  type: 2, text: 'I tend to put others\' needs before my own, often without thinking about it.' },
  { id: 6,  type: 2, text: 'I sometimes feel hurt when my efforts to help aren\'t noticed or appreciated.' },

  // Type 3 – Achiever
  { id: 7,  type: 3, text: 'I\'m highly motivated by being seen as successful and competent.' },
  { id: 8,  type: 3, text: 'I naturally adapt my image and presentation to impress different audiences.' },
  { id: 9,  type: 3, text: 'I find it hard to slow down — I\'m always working toward the next goal.' },

  // Type 4 – Individualist
  { id: 10, type: 4, text: 'I often feel that something important is missing from my life.' },
  { id: 11, type: 4, text: 'I feel fundamentally different from most people in ways that\'s hard to explain.' },
  { id: 12, type: 4, text: 'I\'m drawn to depth, beauty, and authentic emotional experience.' },

  // Type 5 – Investigator
  { id: 13, type: 5, text: 'I prefer to observe and fully understand a situation before getting involved.' },
  { id: 14, type: 5, text: 'I need significant time alone to feel mentally recharged and clear.' },
  { id: 15, type: 5, text: 'I love diving deep into topics that interest me and developing real expertise.' },

  // Type 6 – Loyalist
  { id: 16, type: 6, text: 'I often run through worst-case scenarios to prepare for what could go wrong.' },
  { id: 17, type: 6, text: 'I tend to question authority and need to build trust before committing.' },
  { id: 18, type: 6, text: 'Loyalty and reliability are among the most important qualities to me.' },

  // Type 7 – Enthusiast
  { id: 19, type: 7, text: 'I\'m energized by new ideas, adventures, and exciting possibilities.' },
  { id: 20, type: 7, text: 'I find it hard to dwell in negative emotions — I prefer to find the upside.' },
  { id: 21, type: 7, text: 'I can get restless with routines and crave new stimulation and variety.' },

  // Type 8 – Challenger
  { id: 22, type: 8, text: 'I speak my mind directly and expect others to do the same.' },
  { id: 23, type: 8, text: 'I feel a strong instinct to protect those I care about and challenge injustice.' },
  { id: 24, type: 8, text: 'I prefer to be in control of my own life and resist being told what to do.' },

  // Type 9 – Peacemaker
  { id: 25, type: 9, text: 'I can see all sides of a conflict and naturally seek middle ground.' },
  { id: 26, type: 9, text: 'I sometimes go along with others\' preferences to avoid conflict.' },
  { id: 27, type: 9, text: 'I find peace through nature, music, or calming simple routines.' },
]

export type Scores = Record<number, number>

export function calculateScores(answers: Record<number, number>): Scores {
  const raw: Scores = {}
  for (let t = 1; t <= 9; t++) raw[t] = 0

  for (const q of ENNEAGRAM_QUESTIONS) {
    const ans = answers[q.id] ?? 0
    raw[q.type] += ans
  }

  // Normalize to 0–100
  const maxPerType = 3 * 4 // 3 questions × max score 4
  const minPerType = 3 * 1
  const scores: Scores = {}
  for (let t = 1; t <= 9; t++) {
    scores[t] = Math.round(((raw[t] - minPerType) / (maxPerType - minPerType)) * 100)
  }
  return scores
}
