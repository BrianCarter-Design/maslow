export interface Assessment {
  id: string
  name: string
  tagline: string
  description: string
  questionCount: number
  duration: string
  gradient: string
  accentColor: string
  available: boolean
  icon: string
}

export const ASSESSMENTS: Assessment[] = [
  {
    id: 'enneagram',
    name: 'Enneagram',
    tagline: 'Discover your core motivation',
    description:
      'The Enneagram is a system of 9 interconnected personality types that describes the deep motivations, fears, and desires that drive your behavior. Uncover what truly makes you, you.',
    questionCount: 27,
    duration: '5–7 min',
    gradient: 'linear-gradient(135deg, #47077b 0%, #8a1fde 100%)',
    accentColor: '#5d0096',
    available: true,
    icon: '◈',
  },
  {
    id: 'mbti',
    name: 'MBTI',
    tagline: 'Understand how you think & act',
    description:
      'Based on Carl Jung\'s theory of psychological types, the Myers-Briggs Type Indicator (MBTI) identifies 16 personality types across four key dimensions: how you focus energy, gather information, make decisions, and approach the world.',
    questionCount: 60,
    duration: '10–15 min',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #0891b2 100%)',
    accentColor: '#1d4ed8',
    available: false,
    icon: '⬡',
  },
  {
    id: 'bigfive',
    name: 'Big Five',
    tagline: 'Map your personality dimensions',
    description:
      'The Big Five (OCEAN) model measures five broad personality traits: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism. It\'s the most scientifically validated personality framework.',
    questionCount: 44,
    duration: '8–10 min',
    gradient: 'linear-gradient(135deg, #065f46 0%, #0d9488 100%)',
    accentColor: '#047857',
    available: false,
    icon: '⬠',
  },
]
