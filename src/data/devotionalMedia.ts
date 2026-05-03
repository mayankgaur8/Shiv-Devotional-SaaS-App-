export type MediaType = 'audio' | 'video'
export type MediaCategory = 'Mantra' | 'Aarti' | 'Bhajan' | 'Stotra' | 'Meditation'
export type SortOption = 'popular' | 'latest' | 'duration'

export interface DevotionalMediaItem {
  id: string
  title: string
  artist: string
  type: MediaType
  category: MediaCategory
  src: string
  cdnSrc?: string
  thumbnail: string
  duration: string
  description: string
  lyricsHindi: string
  transliteration: string
  meaning: string
  tags: string[]
  youtubeId?: string
  captionsSrc?: string
  releaseDate: string
  popularity: number
}

export interface DevotionalPlaylist {
  id: string
  title: string
  description: string
  icon: string
  trackIds: string[]
}

export const categories: Array<'All' | MediaCategory> = [
  'All',
  'Mantra',
  'Aarti',
  'Bhajan',
  'Stotra',
  'Meditation',
]

export const mediaSourceConfig = {
  // Optional CDN/base URL. Keep empty to serve from local /public.
  baseUrl: process.env.NEXT_PUBLIC_MEDIA_BASE_URL || '',
}

const defaultThumb = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="%230c1a26"/><stop offset="100%" stop-color="%237a2c05"/></linearGradient></defs><rect width="1200" height="675" fill="url(%23g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23d4af37" font-size="58" font-family="Arial, sans-serif">ShivMandir Devotional</text></svg>'

export const devotionalMedia: DevotionalMediaItem[] = [
  {
    id: 'om-namah-shivaya',
    title: 'Om Namah Shivaya',
    artist: 'Sacred Chants',
    type: 'audio',
    category: 'Mantra',
    src: '/media/audio/om-namah-shivaya.mp3',
    cdnSrc: process.env.NEXT_PUBLIC_OM_NAMAH_SHIVAYA_CDN,
    thumbnail: defaultThumb,
    duration: '10:00',
    description: 'The Panchakshara mantra invoking Shiva as pure consciousness.',
    lyricsHindi: 'ॐ नमः शिवाय।',
    transliteration: 'Om Namah Shivaya',
    meaning: 'I bow to Lord Shiva, the auspicious inner Self.',
    tags: ['Peace', 'Chanting', 'Daily Sadhana'],
    releaseDate: '2025-01-15',
    popularity: 98,
  },
  {
    id: 'maha-mrityunjaya',
    title: 'Maha Mrityunjaya Mantra',
    artist: 'Sacred Chants',
    type: 'audio',
    category: 'Mantra',
    src: '/media/audio/maha-mrityunjaya.mp3',
    cdnSrc: process.env.NEXT_PUBLIC_MAHA_MRITYUNJAYA_CDN,
    thumbnail: defaultThumb,
    duration: '08:15',
    description: 'Healing and protective mantra dedicated to Tryambaka Shiva.',
    lyricsHindi: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।',
    transliteration: 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam',
    meaning: 'We worship the three-eyed One who nourishes all beings and frees us from bondage.',
    tags: ['Healing', 'Protection', 'Meditation'],
    releaseDate: '2025-03-02',
    popularity: 100,
  },
  {
    id: 'shiv-aarti',
    title: 'Om Jai Shiv Omkara - Aarti',
    artist: 'Temple Collective',
    type: 'audio',
    category: 'Aarti',
    src: '/media/audio/shiv-aarti.mp3',
    cdnSrc: process.env.NEXT_PUBLIC_SHIV_AARTI_CDN,
    thumbnail: defaultThumb,
    duration: '05:30',
    description: 'Traditional evening aarti sung in Shiva temples.',
    lyricsHindi: 'ॐ जय शिव ओंकारा, स्वामी जय शिव ओंकारा।',
    transliteration: 'Om Jai Shiv Omkara, Swami Jai Shiv Omkara',
    meaning: 'A devotional hymn praising Shiva in many divine forms.',
    tags: ['Temple', 'Evening', 'Aarti'],
    releaseDate: '2024-12-20',
    popularity: 95,
  },
  {
    id: 'har-har-mahadev',
    title: 'Har Har Mahadev Bhajan',
    artist: 'Devotional Ensemble',
    type: 'audio',
    category: 'Bhajan',
    src: '/media/audio/har-har-mahadev.mp3',
    cdnSrc: process.env.NEXT_PUBLIC_HAR_HAR_MAHADEV_CDN,
    thumbnail: defaultThumb,
    duration: '06:45',
    description: 'Energetic bhajan celebrating Mahadev.',
    lyricsHindi: 'हर हर महादेव, शंभो शंकरा।',
    transliteration: 'Har Har Mahadev, Shambho Shankara',
    meaning: 'A call of surrender and joy in Shiva consciousness.',
    tags: ['Energy', 'Bhakti', 'Festival'],
    releaseDate: '2025-04-01',
    popularity: 91,
  },
  {
    id: 'shiv-tandav-stotram-audio',
    title: 'Shiv Tandav Stotram (Audio)',
    artist: 'Vedic Recitation',
    type: 'audio',
    category: 'Stotra',
    src: '/media/audio/shiv-tandav-stotram.mp3',
    cdnSrc: process.env.NEXT_PUBLIC_SHIV_TANDAV_AUDIO_CDN,
    thumbnail: defaultThumb,
    duration: '07:30',
    description: 'Powerful stotra describing Shiva\'s cosmic dance.',
    lyricsHindi: 'जटाटवीगलज्जलप्रवाहपावितस्थले...',
    transliteration: 'Jatatavi Galajjala Pravaha Pavita Sthale...',
    meaning: 'A poetic praise of Shiva\'s fierce and compassionate cosmic nature.',
    tags: ['Stotra', 'Power', 'Focus'],
    releaseDate: '2025-02-10',
    popularity: 96,
  },
  {
    id: 'shiv-dhyan-om',
    title: 'Shiv Dhyan & Om Chanting',
    artist: 'Meditation Series',
    type: 'audio',
    category: 'Meditation',
    src: '/media/audio/shiv-dhyan-om.mp3',
    cdnSrc: process.env.NEXT_PUBLIC_SHIV_DHYAN_CDN,
    thumbnail: defaultThumb,
    duration: '20:00',
    description: 'Deep meditative Om chanting for calm awareness.',
    lyricsHindi: 'ॐ ... ॐ नमः शिवाय ...',
    transliteration: 'Om ... Om Namah Shivaya ...',
    meaning: 'A contemplative practice to settle mind and heart in Shiva.',
    tags: ['Calm', 'Meditation', 'Breathwork'],
    releaseDate: '2025-03-18',
    popularity: 88,
  },
  {
    id: 'shiv-tandav-video',
    title: 'Shiv Tandav Stotram (Video)',
    artist: 'Devotional Video',
    type: 'video',
    category: 'Stotra',
    src: '/media/video/shiv-tandav.mp4',
    cdnSrc: process.env.NEXT_PUBLIC_SHIV_TANDAV_VIDEO_CDN,
    thumbnail: defaultThumb,
    duration: '07:30',
    description: 'Visual rendition of Shiv Tandav Stotram with temple visuals.',
    lyricsHindi: 'जटाटवीगलज्जलप्रवाहपावितस्थले...',
    transliteration: 'Jatatavi Galajjala Pravaha Pavita Sthale...',
    meaning: 'Describes the transcendental dance of Shiva.',
    tags: ['Video', 'Stotra', 'Shivratri'],
    youtubeId: 'ZpOHs3BmFOk',
    captionsSrc: '/media/captions/shiv-tandav.vtt',
    releaseDate: '2025-01-30',
    popularity: 94,
  },
  {
    id: 'shiv-aarti-video',
    title: 'Shiv Aarti Temple Live',
    artist: 'Temple Recording',
    type: 'video',
    category: 'Aarti',
    src: '/media/video/shiv-aarti.mp4',
    cdnSrc: process.env.NEXT_PUBLIC_SHIV_AARTI_VIDEO_CDN,
    thumbnail: defaultThumb,
    duration: '05:00',
    description: 'Traditional Shiva temple aarti with bells and chants.',
    lyricsHindi: 'ॐ जय शिव ओंकारा, स्वामी जय शिव ओंकारा।',
    transliteration: 'Om Jai Shiv Omkara, Swami Jai Shiv Omkara',
    meaning: 'Offers devotion and gratitude to Lord Shiva.',
    tags: ['Aarti', 'Temple', 'Evening'],
    youtubeId: 'ky4SzkGPm8g',
    captionsSrc: '/media/captions/shiv-aarti.vtt',
    releaseDate: '2025-04-20',
    popularity: 90,
  },
]

export const devotionalPlaylists: DevotionalPlaylist[] = [
  {
    id: 'morning-shiva-mantras',
    title: 'Morning Shiva Mantras',
    description: 'Start your day with pure mantra vibrations.',
    icon: '🌅',
    trackIds: ['om-namah-shivaya', 'maha-mrityunjaya', 'shiv-dhyan-om'],
  },
  {
    id: 'evening-aarti',
    title: 'Evening Aarti',
    description: 'Sunset devotional flow for daily puja.',
    icon: '🪔',
    trackIds: ['shiv-aarti', 'shiv-aarti-video'],
  },
  {
    id: 'meditation-om-chanting',
    title: 'Meditation & Om Chanting',
    description: 'Slow, meditative chants for inner stillness.',
    icon: '🧘',
    trackIds: ['shiv-dhyan-om', 'om-namah-shivaya'],
  },
  {
    id: 'shivratri-special',
    title: 'Shivratri Special',
    description: 'Intense devotion for the night of Shiva.',
    icon: '🌙',
    trackIds: ['shiv-tandav-stotram-audio', 'shiv-tandav-video', 'har-har-mahadev'],
  },
  {
    id: 'maha-mrityunjaya-healing',
    title: 'Maha Mrityunjaya Healing',
    description: 'Healing-focused recitations and chants.',
    icon: '💙',
    trackIds: ['maha-mrityunjaya', 'shiv-dhyan-om'],
  },
]

export const getMediaUrl = (src: string, cdnSrc?: string): string => {
  if (cdnSrc) return cdnSrc
  if (!src.startsWith('/')) return src
  return `${mediaSourceConfig.baseUrl}${src}`
}

export const durationToSeconds = (duration: string): number => {
  const [minutes, seconds] = duration.split(':').map(Number)
  return (minutes || 0) * 60 + (seconds || 0)
}
