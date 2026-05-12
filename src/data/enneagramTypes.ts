export interface EnneagramType {
  number: number
  name: string
  tagline: string
  color: string
  gradient: string
  traits: string[]
  description: string
  wingDescription: string
  stressDescription: string
  growthDescription: string
  growth: number
  stress: number
  wing1: number
  wing2: number
}

export const ENNEAGRAM_TYPES: EnneagramType[] = [
  {
    number: 1,
    name: 'Reformer',
    tagline: 'The principled, purposeful, self-controlled type',
    color: '#1802a0',
    gradient: 'linear-gradient(135deg, #1802a0 0%, #4527a0 100%)',
    traits: ['Principled', 'Detail-oriented', 'Self-disciplined', 'Idealistic', 'Improvement-focused'],
    description:
      'Ones are conscientious and ethical, with a strong sense of right and wrong. They are teachers, crusaders, and advocates for change: always striving to improve things but afraid of making a mistake. Well-organized, orderly, and fastidious, they try to maintain high standards, but can slip into being critical and perfectionistic.',
    wingDescription:
      'As a Type 1, your wings are 9 (The Peacemaker) and 2 (The Helper). With a 9-wing, you are more detached and idealistic; with a 2-wing, you are more interpersonal and service-oriented.',
    stressDescription:
      'Under stress, Ones move toward Type 4 behaviors — becoming moody, melancholic, and withdrawing into feelings of inadequacy.',
    growthDescription:
      'In growth, Ones move toward Type 7 — becoming more spontaneous, joyful, and open to new experiences.',
    growth: 7,
    stress: 4,
    wing1: 9,
    wing2: 2,
  },
  {
    number: 2,
    name: 'Helper',
    tagline: 'The caring, interpersonal, generous type',
    color: '#5d0096',
    gradient: 'linear-gradient(41.73deg, #47077b 35.16%, #8a1fde 83.66%)',
    traits: ['Deep desire to be loved', 'People pleasing', 'Very empathetic', 'Struggle with boundaries', 'Team player'],
    description:
      'Twos are empathetic, sincere, and warm-hearted. They are friendly, generous, and self-sacrificing, but can also be sentimental, flattering, and people-pleasing. They are well-meaning and driven to be close to others, but can slip into doing things for others in order to be needed.',
    wingDescription:
      'As a Type 2, your wings are 1 (The Reformer) and 3 (The Achiever). With a 1-wing, you are more principled and idealistic; with a 3-wing, you are more goal-oriented and image-conscious.',
    stressDescription:
      'Under stress, Twos move toward Type 8 behaviors — becoming more controlling, domineering, and confrontational.',
    growthDescription:
      'In growth, Twos move toward Type 4 — becoming more self-aware, emotionally honest, and nurturing of their own needs.',
    growth: 4,
    stress: 8,
    wing1: 1,
    wing2: 3,
  },
  {
    number: 3,
    name: 'Achiever',
    tagline: 'The success-oriented, pragmatic, adaptive type',
    color: '#b45309',
    gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 100%)',
    traits: ['Goal-oriented', 'Adaptable', 'Driven for success', 'Image-conscious', 'Highly motivating'],
    description:
      'Threes are self-assured, attractive, and charming. Ambitious, competent, and energetic, they can also be status-conscious and highly driven for advancement. They are diplomatic and poised, but can also be overly concerned with their image and what others think of them.',
    wingDescription:
      'As a Type 3, your wings are 2 (The Helper) and 4 (The Individualist). With a 2-wing, you are more people-focused; with a 4-wing, you are more creative and introspective.',
    stressDescription:
      'Under stress, Threes move toward Type 9 — becoming disengaged, listless, and losing their sense of direction.',
    growthDescription:
      'In growth, Threes move toward Type 6 — becoming more committed, cooperative, and honest about their vulnerabilities.',
    growth: 6,
    stress: 9,
    wing1: 2,
    wing2: 4,
  },
  {
    number: 4,
    name: 'Individualist',
    tagline: 'The sensitive, withdrawn, expressive type',
    color: '#9c2780',
    gradient: 'linear-gradient(135deg, #7b1fa2 0%, #c2185b 100%)',
    traits: ['Emotionally deep', 'Creative and expressive', 'Seeks significance', 'Sensitive', 'Authentic'],
    description:
      'Fours are self-aware, sensitive, and reserved. They are emotionally honest, creative, and personal, but can also be moody and self-conscious. Withholding themselves from others due to feeling vulnerable and defective, they can also feel disdainful and exempt from ordinary ways of living.',
    wingDescription:
      'As a Type 4, your wings are 3 (The Achiever) and 5 (The Investigator). With a 3-wing, you are more ambitious and extroverted; with a 5-wing, you are more intellectual and withdrawn.',
    stressDescription:
      'Under stress, Fours move toward Type 2 — becoming overly dependent on others and people-pleasing.',
    growthDescription:
      'In growth, Fours move toward Type 1 — becoming more principled, disciplined, and objective.',
    growth: 1,
    stress: 2,
    wing1: 3,
    wing2: 5,
  },
  {
    number: 5,
    name: 'Investigator',
    tagline: 'The intense, cerebral, perceptive type',
    color: '#065f46',
    gradient: 'linear-gradient(135deg, #065f46 0%, #0277bd 100%)',
    traits: ['Intellectually curious', 'Private and reserved', 'Independent', 'Analytical', 'Observant'],
    description:
      'Fives are alert, insightful, and curious. They are able to concentrate and focus on developing complex ideas and skills. Independent, innovative, and inventive, they can also become preoccupied with their thoughts and imaginary constructs.',
    wingDescription:
      'As a Type 5, your wings are 4 (The Individualist) and 6 (The Loyalist). With a 4-wing, you are more creative and emotional; with a 6-wing, you are more loyal and collaborative.',
    stressDescription:
      'Under stress, Fives move toward Type 7 — becoming scattered, impulsive, and seeking distractions.',
    growthDescription:
      'In growth, Fives move toward Type 8 — becoming more decisive, confident, and engaged with the world.',
    growth: 8,
    stress: 7,
    wing1: 4,
    wing2: 6,
  },
  {
    number: 6,
    name: 'Loyalist',
    tagline: 'The committed, security-oriented, engaging type',
    color: '#c2410c',
    gradient: 'linear-gradient(135deg, #c2410c 0%, #b45309 100%)',
    traits: ['Loyal and reliable', 'Cautious planner', 'Security-focused', 'Hardworking', 'Anxiety-prone'],
    description:
      'Sixes are reliable, hardworking, and responsible. Excellent at troubleshooting, they foresee problems and foster cooperation, but can also be defensive, evasive, and anxious—running on stress while complaining about it.',
    wingDescription:
      'As a Type 6, your wings are 5 (The Investigator) and 7 (The Enthusiast). With a 5-wing, you are more analytical and introverted; with a 7-wing, you are more optimistic and adventurous.',
    stressDescription:
      'Under stress, Sixes move toward Type 3 — becoming competitive, image-conscious, and arrogant.',
    growthDescription:
      'In growth, Sixes move toward Type 9 — becoming calmer, more receptive, and trusting of life.',
    growth: 9,
    stress: 3,
    wing1: 5,
    wing2: 7,
  },
  {
    number: 7,
    name: 'Enthusiast',
    tagline: 'The busy, fun-loving, spontaneous type',
    color: '#cc0000',
    gradient: 'linear-gradient(135deg, #b91c1c 0%, #d97706 100%)',
    traits: ['Spontaneous', 'Optimistic', 'Versatile', 'Fun-seeking', 'Easily scattered'],
    description:
      'Sevens are extroverted, optimistic, versatile, and spontaneous. Playful, high-spirited, and practical, they can also misapply their many talents, becoming over-extended, scattered, and undisciplined.',
    wingDescription:
      'As a Type 7, your wings are 6 (The Loyalist) and 8 (The Challenger). With a 6-wing, you are more responsible and loyal; with an 8-wing, you are more assertive and entrepreneurial.',
    stressDescription:
      'Under stress, Sevens move toward Type 1 — becoming critical, perfectionist, and inflexible.',
    growthDescription:
      'In growth, Sevens move toward Type 5 — becoming more focused, contemplative, and intellectually deep.',
    growth: 5,
    stress: 1,
    wing1: 6,
    wing2: 8,
  },
  {
    number: 8,
    name: 'Challenger',
    tagline: 'The powerful, dominating, self-confident type',
    color: '#166534',
    gradient: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
    traits: ['Assertive and direct', 'Self-confident', 'Protective', 'Decisive', 'Confrontational'],
    description:
      'Eights are self-confident, strong, and assertive. Protective, resourceful, straight-talking, and decisive, but can also be ego-centric and domineering. Eights feel they must control their environment, especially people, sometimes becoming confrontational and intimidating.',
    wingDescription:
      'As a Type 8, your wings are 7 (The Enthusiast) and 9 (The Peacemaker). With a 7-wing, you are more energetic and visionary; with a 9-wing, you are more easy-going and diplomatic.',
    stressDescription:
      'Under stress, Eights move toward Type 5 — becoming secretive, isolated, and withholding.',
    growthDescription:
      'In growth, Eights move toward Type 2 — becoming more open-hearted, nurturing, and generous.',
    growth: 2,
    stress: 5,
    wing1: 7,
    wing2: 9,
  },
  {
    number: 9,
    name: 'Peacemaker',
    tagline: 'The easygoing, self-effacing, receptive type',
    color: '#78350f',
    gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 100%)',
    traits: ['Accepting', 'Patient', 'Conflict-averse', 'Supportive', 'Easy-going'],
    description:
      'Nines are accepting, trusting, and stable. They are usually creative, optimistic, and supportive, but can also be too willing to go along with others to keep the peace. They want everything to go smoothly and be without conflict, but they can also tend to be complacent, simplifying problems and minimizing anything upsetting.',
    wingDescription:
      'As a Type 9, your wings are 8 (The Challenger) and 1 (The Reformer). With an 8-wing, you are more assertive and direct; with a 1-wing, you are more principled and idealistic.',
    stressDescription:
      'Under stress, Nines move toward Type 6 — becoming anxious, defensive, and seeking external guidance.',
    growthDescription:
      'In growth, Nines move toward Type 3 — becoming more goal-oriented, motivated, and self-developed.',
    growth: 3,
    stress: 6,
    wing1: 8,
    wing2: 1,
  },
]

export function getType(n: number): EnneagramType {
  return ENNEAGRAM_TYPES[n - 1]
}
