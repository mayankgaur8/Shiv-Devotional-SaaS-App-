import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { devotionalMedia, getMediaBySlug, getMediaCandidateUrls, getMediaUrl } from '@/src/data/devotionalMedia'

interface TrackPageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return devotionalMedia.map((item) => ({ slug: item.slug }))
}

export function generateMetadata({ params }: TrackPageProps): Metadata {
  const item = getMediaBySlug(params.slug)
  if (!item) {
    return {
      title: 'Bhajan Not Found | ShivMandir',
      description: 'Requested devotional track could not be found.',
    }
  }

  const title = `${item.title} | ShivMandir Bhajan`
  const description = item.description
  const image = getMediaUrl(item.thumbnail)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: 'music.song',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default function BhajanTrackPage({ params }: TrackPageProps) {
  const item = getMediaBySlug(params.slug)

  if (!item) notFound()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: item.title,
    byArtist: {
      '@type': 'MusicGroup',
      name: item.artist,
    },
    inAlbum: {
      '@type': 'MusicAlbum',
      name: 'ShivMandir Devotional Collection',
    },
    duration: item.duration,
    genre: item.category,
    description: item.description,
    isAccessibleForFree: true,
    url: `/bhajan/${item.slug}`,
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <Link href="/bhajan" className="text-xs text-saffron-300 hover:text-saffron-200">
        ← Back to Bhajan Library
      </Link>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/3 p-6">
        <p className="text-xs uppercase tracking-widest text-bhasma-500 mb-2">{item.category}</p>
        <h1 className="text-2xl font-bold text-bhasma-100 mb-1">{item.title}</h1>
        <p className="text-bhasma-500 text-sm mb-4">{item.artist} • {item.duration}</p>
        <p className="text-bhasma-400 text-sm leading-relaxed mb-5">{item.description}</p>

        {item.type === 'audio' ? (
          <audio controls preload="metadata" className="w-full">
            {getMediaCandidateUrls(item.src, item.cdnSrc).map((src) => (
              <source key={src} src={src} type="audio/mpeg" />
            ))}
            Your browser does not support audio playback.
          </audio>
        ) : (
          <video controls preload="metadata" className="w-full" src={getMediaUrl(item.src, item.cdnSrc)} />
        )}

        <div className="mt-5 space-y-3 text-sm">
          <div>
            <p className="text-saffron-300 font-semibold mb-1">Sanskrit / Hindi</p>
            <p className="text-bhasma-200">{item.lyricsHindi}</p>
          </div>
          <div>
            <p className="text-saffron-300 font-semibold mb-1">Transliteration</p>
            <p className="text-bhasma-300">{item.transliteration}</p>
          </div>
          <div>
            <p className="text-saffron-300 font-semibold mb-1">Meaning</p>
            <p className="text-bhasma-400">{item.meaning}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
