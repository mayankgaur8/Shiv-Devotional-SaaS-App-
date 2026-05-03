import type { Metadata } from 'next'
import BhajanLibraryClient from '@/components/bhajan/BhajanLibraryClient'

export const metadata: Metadata = {
  title: 'Lord Shiva Bhajans, Mantras & Aarti | ShivMandir',
  description: 'Listen to Om Namah Shivaya, Maha Mrityunjaya Mantra, Shiv Tandav Stotram, Shiva Aarti and devotional bhajans.',
}

export default function BhajanPage() {
  return <BhajanLibraryClient />
}
