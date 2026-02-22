export interface RudrakshaRecommendation {
  mukhi: number
  name: string
  deity: string
  planet: string
  mantra: string
  benefits: string[]
  wearingRitual: string
  idealFor: string[]
  color: string
  icon: string
}

export const rudrakshaData: Record<number, RudrakshaRecommendation> = {
  1: {
    mukhi: 1,
    name: 'Ek Mukhi',
    deity: 'Lord Shiva himself',
    planet: 'Sun',
    mantra: 'ॐ ह्रीं नमः',
    benefits: ['Supreme consciousness', 'Liberation (Moksha)', 'Destroys all sins', 'Enhances leadership'],
    wearingRitual: 'Wear on Monday after abhishek with milk. Touch to Shivalinga before wearing.',
    idealFor: ['Spiritual seekers', 'Leaders', 'Those seeking liberation'],
    color: 'from-yellow-400 to-orange-500',
    icon: '🌕',
  },
  5: {
    mukhi: 5,
    name: 'Panch Mukhi',
    deity: 'Kalagni Rudra (Shiva)',
    planet: 'Jupiter',
    mantra: 'ॐ ह्रीं नमः',
    benefits: ['Health & wellness', 'Peace of mind', 'Blood pressure regulation', 'Memory enhancement'],
    wearingRitual: 'Most common and safe for all. Wear after chanting Om Namah Shivaya 108 times on Monday.',
    idealFor: ['Everyone', 'Students', 'Those with health concerns', 'Stress relief'],
    color: 'from-saffron-400 to-saffron-600',
    icon: '⭐',
  },
  6: {
    mukhi: 6,
    name: 'Shash Mukhi',
    deity: 'Lord Kartikeya (Skanda)',
    planet: 'Mars',
    mantra: 'ॐ ह्रीं हुं नमः',
    benefits: ['Willpower & courage', 'Arthritis relief', 'Removes laziness', 'Academic focus'],
    wearingRitual: 'Wear on Tuesday. Energize with Kartikeya mantra and kumkum tilak.',
    idealFor: ['Students', 'Athletes', 'Those with joint pain', 'People lacking motivation'],
    color: 'from-red-400 to-red-600',
    icon: '🔱',
  },
  7: {
    mukhi: 7,
    name: 'Sapt Mukhi',
    deity: 'Goddess Mahalakshmi & Saptamatrika',
    planet: 'Saturn',
    mantra: 'ॐ ह्रीं हुं नमः',
    benefits: ['Financial prosperity', 'Business success', 'Removes misfortune', 'Career advancement'],
    wearingRitual: 'Wear on Saturday after Lakshmi puja. Keep a tulsi leaf while energizing.',
    idealFor: ['Business owners', 'Career professionals', 'Those facing financial difficulties'],
    color: 'from-yellow-300 to-gold-500',
    icon: '💎',
  },
  8: {
    mukhi: 8,
    name: 'Asht Mukhi',
    deity: 'Lord Ganesha',
    planet: 'Rahu',
    mantra: 'ॐ गं गणपतये नमः',
    benefits: ['Removes obstacles', 'Success in new ventures', 'Protection from black magic', 'Sharp intellect'],
    wearingRitual: 'Wear on Wednesday after Ganesha puja. Keep it near your workspace for best results.',
    idealFor: ['Entrepreneurs', 'Those starting new ventures', 'People facing repeated obstacles'],
    color: 'from-green-400 to-emerald-600',
    icon: '🐘',
  },
  11: {
    mukhi: 11,
    name: 'Gyarah Mukhi',
    deity: '11 Rudras of Lord Shiva',
    planet: 'All planets combined',
    mantra: 'ॐ ह्रीं हुं नमः',
    benefits: ['Ultimate protection', 'Fearlessness', 'Adventure & confidence', 'Tantric protection'],
    wearingRitual: 'Wear after elaborate puja. Best worn on Mahashivratri for maximum benefit.',
    idealFor: ['Fearful individuals', 'Travellers', 'Those in dangerous professions', 'Deep Shiva devotees'],
    color: 'from-neelkanth-400 to-neelkanth-700',
    icon: '🛡️',
  },
  14: {
    mukhi: 14,
    name: 'Chaudah Mukhi',
    deity: 'Lord Hanuman & Shiva',
    planet: 'Saturn & Mars',
    mantra: 'ॐ नमः शिवाय',
    benefits: ['Third eye awakening', 'Future vision', 'Supreme protection', 'Kundalini awakening'],
    wearingRitual: 'Extremely rare. Must be energized by a qualified pandit. Wear only after proper diksha.',
    idealFor: ['Advanced spiritual seekers', 'Yogis', 'Those on the path of Tantra'],
    color: 'from-purple-400 to-indigo-600',
    icon: '👁️',
  },
}

export interface QuizAnswer {
  challenge: string
  goal: string
  preference: string
  ageGroup: string
}

export function getRecommendation(answers: QuizAnswer): RudrakshaRecommendation[] {
  const recs: number[] = []

  // Challenge-based logic
  if (answers.challenge === 'stress') recs.push(5)
  if (answers.challenge === 'health') recs.push(5, 6)
  if (answers.challenge === 'money') recs.push(7)
  if (answers.challenge === 'obstacles') recs.push(8)
  if (answers.challenge === 'fear') recs.push(11)
  if (answers.challenge === 'career') recs.push(7, 6)
  if (answers.challenge === 'relationship') recs.push(5)

  // Goal-based logic
  if (answers.goal === 'spiritual') recs.push(1, 14)
  if (answers.goal === 'abundance') recs.push(7)
  if (answers.goal === 'protection') recs.push(11)
  if (answers.goal === 'clarity') recs.push(5, 8)
  if (answers.goal === 'success') recs.push(8, 7)

  // Deduplicate and return top 3
  const unique = [...new Set(recs)]
  const top3 = unique.slice(0, 3)
  if (top3.length === 0) top3.push(5) // default: Panch Mukhi for everyone

  return top3.map(m => rudrakshaData[m]).filter(Boolean)
}

export const challenges = [
  { value: 'stress', label: 'Stress & Anxiety', emoji: '😰' },
  { value: 'health', label: 'Health Concerns', emoji: '🏥' },
  { value: 'money', label: 'Financial Difficulty', emoji: '💸' },
  { value: 'career', label: 'Career Stagnation', emoji: '📈' },
  { value: 'obstacles', label: 'Repeated Obstacles', emoji: '🚧' },
  { value: 'fear', label: 'Fear & Insecurity', emoji: '😨' },
  { value: 'relationship', label: 'Relationship Issues', emoji: '💔' },
]

export const goals = [
  { value: 'spiritual', label: 'Spiritual Growth', emoji: '🕉️' },
  { value: 'abundance', label: 'Wealth & Prosperity', emoji: '✨' },
  { value: 'protection', label: 'Protection & Safety', emoji: '🛡️' },
  { value: 'clarity', label: 'Mental Clarity', emoji: '🧠' },
  { value: 'success', label: 'Career Success', emoji: '🚀' },
]
