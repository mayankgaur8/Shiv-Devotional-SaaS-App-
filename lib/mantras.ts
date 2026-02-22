export interface DailyGuidance {
  mantra: string
  mantraTransliteration: string
  mantraTranslation: string
  energyMessage: string
  meditationTime: string
  rudraReminder: string
  dayTheme: string
}

const mantras: DailyGuidance[] = [
  {
    mantra: 'ॐ नमः शिवाय',
    mantraTransliteration: 'Om Namah Shivaya',
    mantraTranslation: 'I bow to Shiva — the auspicious one who is the consciousness within all.',
    energyMessage: 'Today carries the energy of Neelkanth — the one who transforms poison into wisdom. Whatever challenges arise, Bholenath gives you the strength to transmute them into growth.',
    meditationTime: '5:42 AM – 6:18 AM (Brahma Muhurta)',
    rudraReminder: 'Chant 108 repetitions of Om Namah Shivaya with a Rudraksha mala for clarity of mind.',
    dayTheme: 'Transformation',
  },
  {
    mantra: 'ॐ त्र्यम्बकं यजामहे',
    mantraTransliteration: 'Om Tryambakam Yajamahe',
    mantraTranslation: 'We worship the three-eyed one (Shiva) who nourishes and nurtures all beings.',
    energyMessage: 'The Mahamrityunjaya mantra activates today. Shiva\'s third eye sees beyond the material. Trust your inner knowing — what your intuition whispers is true.',
    meditationTime: '5:30 AM – 6:00 AM (Brahma Muhurta)',
    rudraReminder: 'Recite Mahamrityunjaya 11 times with intention for health and protection of loved ones.',
    dayTheme: 'Protection & Healing',
  },
  {
    mantra: 'ॐ शं शिवाय नमः',
    mantraTransliteration: 'Om Sham Shivaya Namah',
    mantraTranslation: 'Om, I bow to Shiva, the bestower of peace and auspiciousness.',
    energyMessage: 'Shanti flows today. Bholenath reminds you that stillness is not inaction — it is the most powerful force in the universe. Find your center and act from there.',
    meditationTime: '6:00 AM – 6:45 AM',
    rudraReminder: 'Sit in silence for 21 minutes. Simply observe your breath. No chanting needed today — presence is the prayer.',
    dayTheme: 'Peace & Stillness',
  },
  {
    mantra: 'नमः शम्भवाय च मयोभवाय च',
    mantraTransliteration: 'Namah Shambhavaya cha Mayobhavaya cha',
    mantraTranslation: 'Salutations to Shambhu, who is the source of happiness and bliss.',
    energyMessage: 'Shambhu\'s grace flows abundantly today. Open your hands to receive — blessings come to those who have already said thank you. Gratitude is the fastest path to Shiva.',
    meditationTime: '5:15 AM – 6:00 AM',
    rudraReminder: 'Light a ghee diya, offer a bilva leaf, and chant this mantra 27 times for abundance.',
    dayTheme: 'Abundance & Gratitude',
  },
  {
    mantra: 'ॐ ह्रीं ह्रौं नमः शिवाय',
    mantraTransliteration: 'Om Hreem Hraum Namah Shivaya',
    mantraTranslation: 'Om, with the power of Maya and Shakti, I bow to Shiva.',
    energyMessage: 'Shakti and Shiva dance as one today. Your masculine discipline and feminine intuition are equally sacred. Honor both within you. Ardhanarishvara teaches perfect balance.',
    meditationTime: '4:48 AM – 5:30 AM (Amrit Vela)',
    rudraReminder: 'Meditate on the form of Ardhanarishvara today — Shiva and Shakti as one. This brings harmony in relationships.',
    dayTheme: 'Balance & Unity',
  },
  {
    mantra: 'ॐ तत्पुरुषाय विद्महे',
    mantraTransliteration: 'Om Tatpurushaya Vidmahe',
    mantraTranslation: 'Om, let us contemplate that Supreme Being — Shiva, the eternal Purusha.',
    energyMessage: 'The Shiva Gayatri activates today. Knowledge and wisdom flow freely. This is an auspicious day for learning, studying sacred texts, or beginning a new skill with devotion.',
    meditationTime: '6:00 AM – 6:30 AM',
    rudraReminder: 'Read one chapter of Shiv Purana or listen to Shiva Mahimna Stotra today.',
    dayTheme: 'Wisdom & Learning',
  },
  {
    mantra: 'ॐ पार्वतीपतये नमः',
    mantraTransliteration: 'Om Parvateepataye Namah',
    mantraTranslation: 'Om, salutations to the lord of Parvati — Shiva, the divine beloved.',
    energyMessage: 'Shiva in his form as the devoted husband reminds you today: love is a spiritual practice. Nurture your sacred bonds — family, friends, community. Seva begins at home.',
    meditationTime: '6:15 AM – 7:00 AM',
    rudraReminder: 'Perform Abhishek with milk and honey today. Offer kumkum to Mata Parvati alongside Shiva puja.',
    dayTheme: 'Love & Devotion',
  },
]

export function getTodaysGuidance(): DailyGuidance {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )
  return mantras[dayOfYear % mantras.length]
}

export const upcomingMuhurtas = [
  { time: '5:42 AM', name: 'Brahma Muhurta', description: 'Best for meditation & mantra' },
  { time: '8:00 AM', name: 'Abhijit Muhurta', description: 'Best for new beginnings' },
  { time: '12:00 PM', name: 'Madhyahna', description: 'Shiva aarti time' },
  { time: '6:00 PM', name: 'Sandhya', description: 'Evening puja & prayer' },
  { time: '8:00 PM', name: 'Pradosh Muhurta', description: 'Shiva\'s favorite hour' },
]
