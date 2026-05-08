import type { Metadata } from 'next'
import BhajanLibraryClient from '@/components/bhajan/BhajanLibraryClient'

export const metadata: Metadata = {
  title: 'BUM BUM MAHAKAAL Anthem & Shiv Bhajans — Mahadev Devotional Library | ShivMandir',
  description:
    'Listen to BUM BUM MAHAKAAL Anthem, Om Namah Shivaya, Maha Mrityunjaya Mantra, Shiv Tandav Stotram, Shiva Aarti and devotional bhajans. Har Har Mahadev.',
  keywords: [
    'Mahadev Bhajan',
    'Bum Bum Mahakaal',
    'Har Har Mahadev',
    'Shiv Anthem',
    'Shiv Tandav Energy Song',
    'Om Namah Shivaya',
    'Maha Mrityunjaya Mantra',
    'Shiv Bhajan',
    'Devotional Music',
    'ShivMandir',
  ],
  openGraph: {
    title: 'BUM BUM MAHAKAAL Anthem & Shiv Bhajans | ShivMandir',
    description: 'Powerful Shiv Bhajans — BUM BUM MAHAKAAL, Om Namah Shivaya, Shiv Tandav & more. Har Har Mahadev 🔱',
    type: 'website',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'BUM BUM MAHAKAAL (Anthem)',
  description:
    'Powerful Shiv Anthem invoking Mahakaal energy. Mahadev Bhajan | Bum Bum Mahakaal | Har Har Mahadev | Shiv Anthem | Shiv Tandav Energy Song.',
  thumbnailUrl: 'https://img.youtube.com/vi/msSY1Od4WrE/maxresdefault.jpg',
  embedUrl: 'https://www.youtube.com/embed/msSY1Od4WrE',
  uploadDate: '2026-05-09',
  keywords: 'Mahadev Bhajan, Bum Bum Mahakaal, Har Har Mahadev, Shiv Anthem, Shiv Tandav Energy Song',
}

export default function BhajanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BhajanLibraryClient />
    </>
  )
}
