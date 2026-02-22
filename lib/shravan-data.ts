export interface ShravaanDay {
  day: number
  theme: string
  mantra: string
  ritual: string
  offering: string
  benefit: string
  completed?: boolean
}

export const shravan30Days: ShravaanDay[] = [
  { day: 1, theme: 'Sankalp — Sacred Intention', mantra: 'ॐ नमः शिवाय', ritual: 'Milk abhishek at sunrise', offering: 'Bilva leaf', benefit: 'New beginnings blessed' },
  { day: 2, theme: 'Shanti — Inner Peace', mantra: 'ॐ शं शिवाय नमः', ritual: 'Sit silently for 21 minutes at dawn', offering: 'White flowers', benefit: 'Mental peace restored' },
  { day: 3, theme: 'Shakti — Divine Power', mantra: 'ॐ ह्रीं शिवाय नमः', ritual: 'Light 5 diyas and chant 108 times', offering: 'Dhatura (if available)', benefit: 'Inner strength awakened' },
  { day: 4, theme: 'Bhakti — Pure Devotion', mantra: 'हर हर महादेव', ritual: 'Sing one Shiv bhajan with open heart', offering: 'Ghee diya', benefit: 'Devotion deepened' },
  { day: 5, theme: 'Vairagya — Detachment', mantra: 'ॐ नमो भगवते रुद्राय', ritual: 'Give something away — old clothes or food', offering: 'Bhasma (ash)', benefit: 'Attachment dissolved' },
  { day: 6, theme: 'Karuna — Compassion', mantra: 'ॐ त्र्यम्बकं यजामहे', ritual: 'Feed an animal or help someone in need', offering: 'Honey', benefit: 'Heart chakra opens' },
  { day: 7, theme: 'Sawan Somvar — Shiva\'s Day', mantra: 'ॐ नमः शिवाय × 108', ritual: 'Full day fast. Break with Shiv prasad at sunset', offering: 'Panchamrit (5 sacred items)', benefit: 'Full blessings of Somvar' },
  { day: 8, theme: 'Sadhana — Spiritual Practice', mantra: 'ॐ ह्रौं जूं सः', ritual: '40-minute meditation at Brahma Muhurta', offering: 'Gangajal', benefit: 'Meditation deepens' },
  { day: 9, theme: 'Seva — Selfless Service', mantra: 'ॐ पार्वतीपतये नमः', ritual: 'Serve someone without expectation', offering: 'Kumkum for Mata Parvati', benefit: 'Karma purified' },
  { day: 10, theme: 'Gyan — Sacred Knowledge', mantra: 'ॐ तत्पुरुषाय विद्महे', ritual: 'Read one chapter of Shiv Purana', offering: 'Sandalwood paste', benefit: 'Wisdom flows' },
  { day: 11, theme: 'Rudra Abhishek Day', mantra: 'ॐ नमः शिवाय × 1008', ritual: 'Perform full Rudra Abhishek with 5 items', offering: 'Full panchamrit', benefit: 'All wishes heard by Shiva' },
  { day: 12, theme: 'Silence — Maun Vrat', mantra: 'Silent repetition only', ritual: 'Observe one hour of silence', offering: 'Just your presence', benefit: 'Inner voice heard' },
  { day: 13, theme: 'Pranayam — Sacred Breath', mantra: 'So Hum (with each breath)', ritual: 'Anulom Vilom for 15 minutes', offering: 'Your breath as offering', benefit: 'Prana activated' },
  { day: 14, theme: 'Sawan Somvar 2 — Deep Surrender', mantra: 'ॐ नमः शिवाय × 108', ritual: 'Second Monday fast. Write one thing you surrender to Shiva', offering: 'Bilva mala (21 leaves)', benefit: 'Ego surrendered' },
  { day: 15, theme: 'Halfway — Reflect & Renew', mantra: 'ॐ नमो भगवते रुद्राय', ritual: 'Review your journey so far. Set renewed intention', offering: 'Fresh flowers', benefit: 'Course corrected' },
  { day: 16, theme: 'Trishul — Remove Obstacles', mantra: 'ॐ त्र्यम्बकं यजामहे', ritual: 'Write 3 obstacles on paper, burn safely in diya flame', offering: 'Sesame seeds in fire', benefit: 'Obstacles cleared' },
  { day: 17, theme: 'Damaru — Rhythm of Creation', mantra: 'डमरु की ताल पर नमः शिवाय', ritual: 'Play or listen to damaru sound for 10 minutes', offering: 'Musical offering', benefit: 'Creativity flows' },
  { day: 18, theme: 'Ganga — Purification', mantra: 'ॐ गं गंगायै नमः', ritual: 'Bathe at sunrise, visualize Ganga flowing from Shiva\'s matted hair', offering: 'Water with flowers', benefit: 'Purification complete' },
  { day: 19, theme: 'Bhasma — Impermanence', mantra: 'ॐ नमः शिवाय', ritual: 'Apply vibhuti (sacred ash) to forehead before prayer', offering: 'Bhasma/vibhuti', benefit: 'Ego dissolved' },
  { day: 20, theme: 'Nandi — Devotion as Service', mantra: 'ॐ नन्दिकेश्वराय नमः', ritual: 'Do your work today as seva — with full heart', offering: 'Your labor as offering', benefit: 'Work becomes worship' },
  { day: 21, theme: 'Sawan Somvar 3 — Ardhanarishvara', mantra: 'ॐ अर्धनारीश्वराय नमः', ritual: 'Honor both your strength and gentleness today', offering: 'Half saffron + half white flower', benefit: 'Balance restored' },
  { day: 22, theme: 'Neelkanth — Transform Poison', mantra: 'ॐ नीलकण्ठाय नमः', ritual: 'Face one difficult truth with courage', offering: 'Blue flower if available', benefit: 'Poison transformed' },
  { day: 23, theme: 'Pashupatinath — Free from Bondage', mantra: 'ॐ पशुपतये नमः', ritual: 'Release one limiting belief in writing', offering: 'Darbha grass', benefit: 'Freedom from bondage' },
  { day: 24, theme: 'Mahakaal — Time & Eternity', mantra: 'ॐ महाकालाय नमः', ritual: 'Spend 30 minutes without phone, just being', offering: 'Your undivided attention', benefit: 'Time illusion released' },
  { day: 25, theme: 'Chandrashekhara — Shining Mind', mantra: 'ॐ चन्द्रशेखराय नमः', ritual: 'Walk under moonlight chanting mantra', offering: 'Milk under moonlight', benefit: 'Mind illuminated' },
  { day: 26, theme: 'Vishwanath — Lord of All', mantra: 'ॐ विश्वनाथाय नमः', ritual: 'See Shiva in every face you encounter today', offering: 'Your loving gaze', benefit: 'Oneness realized' },
  { day: 27, theme: 'Sadashiva — Eternal Auspiciousness', mantra: 'ॐ सदाशिवाय नमः', ritual: 'List 10 blessings in your life with gratitude', offering: 'Gratitude itself', benefit: 'Abundance opens' },
  { day: 28, theme: 'Sawan Somvar 4 — Final Monday', mantra: 'ॐ नमः शिवाय × 108', ritual: 'Most powerful Monday. Full Shiva puja with all family', offering: 'Full panchamrit + bilva mala', benefit: 'Year-long blessings' },
  { day: 29, theme: 'Preparation — Eve of Completion', mantra: 'ॐ नमः शिवाय', ritual: 'Write a letter to Shiva — all your hopes, gratitude, prayers', offering: 'Your heartfelt words', benefit: 'Deep communion' },
  { day: 30, theme: 'Poorna — Sacred Completion', mantra: 'ॐ पूर्णमदः पूर्णमिदम्', ritual: 'Celebrate 30 days! Share prasad. Complete Rudra Abhishek', offering: 'Everything with love', benefit: 'Shiva\'s grace — Poorna!' },
]

export const pujaChecklist = [
  { id: 'bath', label: 'Sacred bath (Snan)', icon: '🚿' },
  { id: 'clean', label: 'Clean puja area', icon: '✨' },
  { id: 'diya', label: 'Light ghee diya', icon: '🪔' },
  { id: 'incense', label: 'Incense / dhoop', icon: '🌿' },
  { id: 'bilva', label: 'Offer bilva leaf', icon: '🍃' },
  { id: 'abhishek', label: 'Milk abhishek', icon: '🥛' },
  { id: 'mantra', label: '108 Om Namah Shivaya', icon: '📿' },
  { id: 'aarti', label: 'Shiv aarti', icon: '🔔' },
]
