'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  categories,
  devotionalMedia,
  devotionalPlaylists,
  getMediaCandidateUrls,
  getMediaUrl,
  mediaSourceConfig,
} from '@/src/data/devotionalMedia'
import { trackEvent } from '@/src/lib/analytics'
import { filterAndSortMedia, isMissingMedia, nextPlayState, toRecentlyPlayed, toggleFavoriteId } from '@/src/lib/bhajan-utils'
import { safeStorageParse, safeStorageSet } from '@/src/lib/safe-storage'
import { sanitizeText } from '@/src/lib/sanitize'
import type { DevotionalMediaItem, SortOption } from '@/src/data/devotionalMedia'
import VideoMediaCard from '@/components/bhajan/VideoMediaCard'

type RepeatMode = 'off' | 'one' | 'all'

const categoryColors: Record<string, string> = {
  All: 'bg-white/10 text-bhasma-300 border-white/10',
  Mantra: 'bg-neelkanth-500/20 text-blue-300 border-neelkanth-500/30',
  Aarti: 'bg-saffron-500/20 text-saffron-300 border-saffron-500/30',
  Bhajan: 'bg-gold-500/20 text-yellow-300 border-gold-500/30',
  Stotra: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Meditation: 'bg-green-500/20 text-green-300 border-green-500/30',
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function itemSourceLabel(item: DevotionalMediaItem, currentSrc: string): string {
  if (!currentSrc) return item.src
  try {
    const url = new URL(currentSrc)
    return `${url.pathname}${url.search}`
  } catch {
    return currentSrc
  }
}

function buildShareText(item: DevotionalMediaItem): string {
  return `🕉️ ${sanitizeText(item.title)}\n\n${sanitizeText(item.lyricsHindi)}\n\n${sanitizeText(item.transliteration)}\n\nMeaning: ${sanitizeText(item.meaning)}\n\nHar Har Mahadev 🔱`
}

interface ResumePosition {
  trackId: string
  time: number
  updatedAt: number
}

function formatResumeLabel(seconds: number): string {
  const sec = Math.max(0, Math.floor(seconds))
  const mins = Math.floor(sec / 60)
  const remainder = sec % 60
  return `${mins}:${remainder.toString().padStart(2, '0')}`
}

function pushGlobalMediaError(payload: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  const holder = window as Window & { __MEDIA_ERRORS__?: Array<Record<string, unknown>> }
  if (!Array.isArray(holder.__MEDIA_ERRORS__)) {
    holder.__MEDIA_ERRORS__ = []
  }
  holder.__MEDIA_ERRORS__.push({ ...payload, timestamp: Date.now() })
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isResumePosition(value: unknown): value is ResumePosition {
  return Boolean(
    value
    && typeof value === 'object'
    && 'trackId' in value
    && 'time' in value
    && typeof (value as ResumePosition).trackId === 'string'
    && typeof (value as ResumePosition).time === 'number',
  )
}

export default function BhajanClientPage() {
  const pathname = usePathname()
  const audioRef = useRef<HTMLAudioElement>(null)
  const retryCountRef = useRef<Map<string, number>>(new Map())
  const pendingSeekRef = useRef<number | null>(null)
  const listenStartMsRef = useRef<number | null>(null)
  const lastSavedSecondRef = useRef<number>(-1)

  const [rawSearchTerm, setRawSearchTerm] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('All')
  const [sortBy, setSortBy] = useState<SortOption>('popular')
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null)
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)

  const [favorites, setFavorites] = useState<string[]>([])
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([])
  const [mediaErrors, setMediaErrors] = useState<Set<string>>(new Set())

  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off')
  const [shuffle, setShuffle] = useState(false)
  const [expandedLyricsId, setExpandedLyricsId] = useState<string | null>(null)
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [isTrackLoading, setIsTrackLoading] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [resumePosition, setResumePosition] = useState<ResumePosition | null>(null)
  const [playerErrorMessage, setPlayerErrorMessage] = useState<string | null>(null)
  const [playerVisible, setPlayerVisible] = useState(true)

  const mediaItems = useMemo(() => (Array.isArray(devotionalMedia) ? devotionalMedia : []), [])

  useEffect(() => {
    try {
      setFavorites(safeStorageParse('shiv-favorites', [], isStringArray))
      setRecentlyPlayed(safeStorageParse('shiv-recently-played', [], isStringArray))

      const parsedResume = safeStorageParse<ResumePosition | null>(
        'shiv-last-track-position',
        null,
        (value): value is ResumePosition | null => value === null || isResumePosition(value),
      )

      if (parsedResume?.trackId) {
        setResumePosition(parsedResume)
      }
    } catch {
      setStorageAvailable(false)
    }

    setIsOffline(typeof navigator !== 'undefined' ? !navigator.onLine : false)

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchTerm(rawSearchTerm)
    }, 300)

    return () => window.clearTimeout(timer)
  }, [rawSearchTerm])

  useEffect(() => {
    const ok = safeStorageSet('shiv-favorites', JSON.stringify(favorites))
    if (!ok) {
      setStorageAvailable(false)
    }
  }, [favorites])

  useEffect(() => {
    const ok = safeStorageSet('shiv-recently-played', JSON.stringify(recentlyPlayed.slice(0, 12)))
    if (!ok) {
      setStorageAvailable(false)
    }
  }, [recentlyPlayed])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setIsPlaying(false)
    setIsTrackLoading(false)
    setIsBuffering(false)
  }, [pathname])

  const baseItems = useMemo(() => {
    if (!activePlaylistId) return mediaItems
    const playlist = devotionalPlaylists.find(p => p.id === activePlaylistId)
    if (!playlist) return mediaItems
    const idSet = new Set(playlist.trackIds)
    return mediaItems.filter(item => idSet.has(item.id))
  }, [activePlaylistId, mediaItems])

  const filteredSortedMedia = useMemo(() => {
    return filterAndSortMedia(baseItems, {
      searchTerm,
      activeCategory,
      showOnlyFavorites,
      favorites,
      sortBy,
    })
  }, [activeCategory, baseItems, favorites, searchTerm, showOnlyFavorites, sortBy])

  const audioQueue = useMemo(() => {
    return filteredSortedMedia.filter(item => item.type === 'audio')
  }, [filteredSortedMedia])

  const currentTrack = useMemo(() => {
    if (!currentTrackId) return null
    return mediaItems.find(item => item.id === currentTrackId && item.type === 'audio') || null
  }, [currentTrackId, mediaItems])

  const currentQueueIndex = useMemo(() => {
    if (!currentTrackId) return -1
    return audioQueue.findIndex(item => item.id === currentTrackId)
  }, [audioQueue, currentTrackId])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const willAdd = !prev.includes(id)
      if (willAdd) {
        trackEvent('favorite_added', { media_id: id })
      }
      return toggleFavoriteId(prev, id)
    })
  }, [])

  const handleMediaError = useCallback((id: string, reason = 'media-load-failed') => {
    console.error('[bhajan:media-error]', { id, reason })
    setMediaErrors(prev => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    pushGlobalMediaError({ id, reason })
  }, [])

  const addToRecent = useCallback((id: string) => {
    setRecentlyPlayed(prev => toRecentlyPlayed(prev, id, 12))
  }, [])

  const handleSelectTrack = useCallback((trackId: string, options?: { autoplay?: boolean; startAt?: number }) => {
    const audio = audioRef.current
    const track = mediaItems.find(item => item.id === trackId && item.type === 'audio')
    if (!audio || !track) return

    if (mediaErrors.has(trackId)) {
      return
    }

    setCurrentTrackId(trackId)
    setPlayerVisible(true)
    setCurrentTime(options?.startAt || 0)
    setIsTrackLoading(true)
    setIsBuffering(false)
    setPlayerErrorMessage(null)
    retryCountRef.current.set(trackId, 0)
    pendingSeekRef.current = options?.startAt || 0

    const candidateUrls = getMediaCandidateUrls(track.src, track.cdnSrc)
    audio.src = candidateUrls[0] || getMediaUrl(track.src, track.cdnSrc)
    audio.load()

    if (options?.autoplay === false) {
      setIsPlaying(false)
      return
    }

    audio.play()
      .then(() => {
        setIsPlaying(nextPlayState(false, 'play'))
        addToRecent(trackId)
      })
      .catch(() => {
        setIsPlaying(nextPlayState(true, 'pause'))
        setIsTrackLoading(false)
        setPlayerErrorMessage(`Playback was blocked for ${sanitizeText(track.title)}. Tap play again to retry.`)
      })
  }, [addToRecent, mediaErrors, mediaItems])

  useEffect(() => {
    if (!resumePosition || currentTrackId) return

    const trackExists = mediaItems.some(item => item.id === resumePosition.trackId && item.type === 'audio')
    if (!trackExists) return

    handleSelectTrack(resumePosition.trackId, { autoplay: false, startAt: resumePosition.time })
  }, [currentTrackId, handleSelectTrack, mediaItems, resumePosition])

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(nextPlayState(true, 'pause'))
      return
    }

    audio.play()
      .then(() => {
        setIsPlaying(nextPlayState(false, 'play'))
      })
      .catch(() => setIsPlaying(nextPlayState(true, 'pause')))
  }, [currentTrack, isPlaying])

  const goToNext = useCallback(() => {
    if (!audioQueue.length) return

    if (shuffle && audioQueue.length > 1) {
      const currentId = currentTrackId
      const options = audioQueue.filter(t => t.id !== currentId)
      const pick = options[Math.floor(Math.random() * options.length)]
      if (pick) handleSelectTrack(pick.id)
      return
    }

    const nextIndex = currentQueueIndex + 1
    if (nextIndex < audioQueue.length) {
      handleSelectTrack(audioQueue[nextIndex].id)
      return
    }

    if (repeatMode === 'all' && audioQueue.length > 0) {
      handleSelectTrack(audioQueue[0].id)
    }
  }, [audioQueue, currentQueueIndex, currentTrackId, handleSelectTrack, repeatMode, shuffle])

  const goToPrevious = useCallback(() => {
    if (!audioQueue.length) return

    const prevIndex = currentQueueIndex - 1
    if (prevIndex >= 0) {
      handleSelectTrack(audioQueue[prevIndex].id)
      return
    }

    if (repeatMode === 'all') {
      handleSelectTrack(audioQueue[audioQueue.length - 1].id)
    }
  }, [audioQueue, currentQueueIndex, handleSelectTrack, repeatMode])

  const handleEnded = useCallback(() => {
    if (!audioRef.current) return

    if (currentTrack) {
      trackEvent('media_complete', { media_id: currentTrack.id, media_title: currentTrack.title })
    }

    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0
      audioRef.current.play()
      return
    }

    goToNext()
  }, [currentTrack, goToNext, repeatMode])

  const handleProgressChange = useCallback((value: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value
    setCurrentTime(value)
  }, [])

  const handleVolumeChange = useCallback((value: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = value
    setVolume(value)
  }, [])

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode(prev => prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off')
  }, [])

  const copyMantra = useCallback(async (item: DevotionalMediaItem) => {
    const text = buildShareText(item)
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Clipboard may fail on unsupported contexts.
    }
  }, [])

  const shareOnWhatsApp = useCallback((item: DevotionalMediaItem) => {
    const message = encodeURIComponent(buildShareText(item))
    window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener,noreferrer')
  }, [])

  const saveResumePosition = useCallback((trackId: string, time: number) => {
    const payload: ResumePosition = {
      trackId,
      time,
      updatedAt: Date.now(),
    }
    const ok = safeStorageSet('shiv-last-track-position', JSON.stringify(payload))
    if (!ok) setStorageAvailable(false)
    setResumePosition(payload)
  }, [])

  const recentlyPlayedItems = useMemo(() => {
    const idMap = new Map(mediaItems.map(item => [item.id, item]))
    return recentlyPlayed
      .map(id => idMap.get(id))
      .filter((item): item is DevotionalMediaItem => Boolean(item))
      .slice(0, 6)
  }, [mediaItems, recentlyPlayed])

  const favoriteItems = useMemo(() => {
    const set = new Set(favorites)
    return mediaItems.filter(item => set.has(item.id)).slice(0, 8)
  }, [favorites, mediaItems])

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto pb-56 md:pb-44">
      <audio
        ref={audioRef}
        preload="metadata"
        controls
        aria-label="ShivMandir audio player"
        className={currentTrack ? 'mb-4 w-full rounded-xl border border-white/10 bg-black/20' : 'sr-only'}
        onLoadStart={() => {
          setIsTrackLoading(true)
          setPlayerErrorMessage(null)
        }}
        onTimeUpdate={(e) => {
          const time = (e.target as HTMLAudioElement).currentTime
          setCurrentTime(time)

          if (!currentTrackId) return
          const second = Math.floor(time)
          if (second % 5 === 0 && second !== lastSavedSecondRef.current) {
            lastSavedSecondRef.current = second
            saveResumePosition(currentTrackId, second)
          }
        }}
        onLoadedMetadata={(e) => {
          const el = e.target as HTMLAudioElement
          setDuration(el.duration || 0)

          if (pendingSeekRef.current !== null) {
            el.currentTime = pendingSeekRef.current
            setCurrentTime(pendingSeekRef.current)
            pendingSeekRef.current = null
          }

          setIsTrackLoading(false)
          setIsBuffering(false)
        }}
        onCanPlay={() => {
          setIsTrackLoading(false)
          setIsBuffering(false)
        }}
        onWaiting={() => setIsBuffering(true)}
        onStalled={() => setIsBuffering(true)}
        onPause={() => {
          setIsPlaying(nextPlayState(true, 'pause'))
          setIsBuffering(false)
          if (currentTrack) {
            const now = Date.now()
            const listenMs = listenStartMsRef.current ? Math.max(0, now - listenStartMsRef.current) : 0
            trackEvent('media_pause', {
              media_id: currentTrack.id,
              media_title: sanitizeText(currentTrack.title),
              listen_ms: listenMs,
              drop_off_second: Math.floor(currentTime),
            })
            listenStartMsRef.current = null
            saveResumePosition(currentTrack.id, currentTime)
          }
        }}
        onPlay={() => {
          setIsPlaying(nextPlayState(false, 'play'))
          setIsBuffering(false)
          listenStartMsRef.current = Date.now()
          if (currentTrack) {
            trackEvent('media_play', { media_id: currentTrack.id, media_title: sanitizeText(currentTrack.title) })
          }
        }}
        onEnded={handleEnded}
        onError={(event) => {
          if (currentTrackId) {
            const retries = retryCountRef.current.get(currentTrackId) || 0
            const failedSrc = (event.currentTarget as HTMLAudioElement).currentSrc || currentTrack?.src || ''
            console.error('[bhajan:audio-player-error]', {
              id: currentTrackId,
              failedSrc,
              retry: retries,
            })
            if (currentTrack) {
              const candidateUrls = getMediaCandidateUrls(currentTrack.src, currentTrack.cdnSrc)
              const nextCandidate = candidateUrls[retries + 1]
              const audio = audioRef.current
              if (audio && nextCandidate) {
                retryCountRef.current.set(currentTrackId, retries + 1)
                audio.src = nextCandidate
                audio.load()
                audio.play().catch(() => {
                  console.error('[bhajan:audio-fallback-failed]', {
                    id: currentTrackId,
                    attemptedSrc: nextCandidate,
                  })
                  handleMediaError(currentTrackId, 'audio-fallback-failed')
                })
                return
              }
            }

            setPlayerErrorMessage(`Unable to load ${sanitizeText(currentTrack?.title || 'this track')}. The file may be missing at ${sanitizeText(currentTrack?.src || failedSrc || '/audio')}.`)
            handleMediaError(currentTrackId, 'audio-retries-exhausted')
          }
          setIsPlaying(false)
          setIsTrackLoading(false)
          setIsBuffering(false)
        }}
      />

      {isOffline && (
        <div className="mb-4 rounded-xl border border-neelkanth-500/40 bg-neelkanth-800/40 px-4 py-2 text-xs text-blue-200">
          Offline Mode - Playing cached content only.
        </div>
      )}

      {!storageAvailable && (
        <div className="mb-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-xs text-yellow-200">
          Favorites and recently played are in temporary mode because browser storage is unavailable.
        </div>
      )}

      {playerErrorMessage && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-200">
          {playerErrorMessage}
        </div>
      )}

      {resumePosition && !isPlaying && currentTrackId === resumePosition.trackId && (
        <div className="mb-4 rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-3 flex items-center justify-between gap-3">
          <p className="text-xs text-yellow-200">
            Continue listening from {formatResumeLabel(resumePosition.time)}
          </p>
          <button
            type="button"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = resumePosition.time
                audioRef.current.play().catch(() => {
                  // Autoplay can be blocked; keep state paused.
                })
              }
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gold-500/20 text-yellow-300 border border-gold-500/30"
            aria-label="Resume listening"
          >
            Resume
          </button>
        </div>
      )}

      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🎵</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="gold-shimmer">Bhajan / Songs Library</span>
        </h1>
        <p className="text-bhasma-400 text-sm max-w-2xl mx-auto">
          Listen to Om Namah Shivaya, Maha Mrityunjaya, Shiv Tandav, Aarti and Shiva bhajans.
        </p>
      </div>

      <section className="mb-6 grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6">
          <label htmlFor="search-media" className="sr-only">Search devotional media</label>
          <input
            id="search-media"
            type="text"
            value={rawSearchTerm}
            onChange={(e) => setRawSearchTerm(e.target.value)}
            placeholder="Search by title, mantra, or tag"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-bhasma-200 placeholder:text-bhasma-600 focus:outline-none focus:ring-2 focus:ring-saffron-400/50"
          />
        </div>

        <div className="md:col-span-3">
          <label htmlFor="sort-media" className="sr-only">Sort media</label>
          <select
            id="sort-media"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-bhasma-200 focus:outline-none focus:ring-2 focus:ring-saffron-400/50"
          >
            <option value="popular">Sort: Popular</option>
            <option value="latest">Sort: Latest</option>
            <option value="duration">Sort: Duration</option>
          </select>
        </div>

        <div className="md:col-span-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowOnlyFavorites(prev => !prev)}
            aria-pressed={showOnlyFavorites}
            className={`px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-gold-400/60 ${
              showOnlyFavorites
                ? 'bg-gold-500/20 border-gold-500/30 text-yellow-300'
                : 'bg-white/5 border-white/10 text-bhasma-400'
            }`}
          >
            Favorites Only
          </button>
          <button
            type="button"
            onClick={() => {
              setActivePlaylistId(null)
              setActiveCategory('All')
              setRawSearchTerm('')
              setShowOnlyFavorites(false)
            }}
            className="px-3 py-2 rounded-xl text-xs border border-white/10 bg-white/5 text-bhasma-400 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-saffron-400/60"
            aria-label="Reset filters"
          >
            Reset
          </button>
        </div>
      </section>

      <section className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-saffron-400/60 ${
              activeCategory === cat
                ? `${categoryColors[cat]} shadow`
                : 'bg-white/5 text-bhasma-500 border-white/10 hover:bg-white/10'
            }`}
            aria-label={`Filter category ${cat}`}
          >
            {cat}
          </button>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-xs uppercase tracking-widest text-bhasma-500 font-semibold mb-3">Devotional Playlists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {devotionalPlaylists.map((playlist) => (
            <button
              key={playlist.id}
              type="button"
              onClick={() => {
                setActivePlaylistId(prev => prev === playlist.id ? null : playlist.id)
                trackEvent('playlist_selected', { playlist_id: playlist.id, playlist_title: playlist.title })
              }}
              className={`text-left rounded-xl p-4 border transition-colors focus:outline-none focus:ring-2 focus:ring-saffron-400/60 ${
                activePlaylistId === playlist.id
                  ? 'bg-saffron-500/10 border-saffron-500/30'
                  : 'bg-white/3 border-white/10 hover:border-white/20'
              }`}
              aria-label={`Open playlist ${playlist.title}`}
            >
              <p className="text-lg mb-1">{playlist.icon}</p>
              <h3 className="text-bhasma-100 font-semibold text-sm">{playlist.title}</h3>
              <p className="text-bhasma-500 text-xs mt-1">{playlist.description}</p>
              <p className="text-bhasma-600 text-xs mt-2">{playlist.trackIds.length} tracks</p>
            </button>
          ))}
        </div>
      </section>

      {recentlyPlayedItems.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-bhasma-500 font-semibold mb-3">Recently Played</h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {recentlyPlayedItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => item.type === 'audio' ? handleSelectTrack(item.id) : undefined}
                className="flex-shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left min-w-[220px] hover:border-saffron-500/30"
                aria-label={`Play recently played ${item.title}`}
              >
                  <p className="text-bhasma-200 text-xs font-medium">{sanitizeText(item.title)}</p>
                <p className="text-bhasma-500 text-xs">{item.category} • {item.duration}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {favoriteItems.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-bhasma-500 font-semibold mb-3">Favorites</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {favoriteItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 bg-white/3 p-3">
                <p className="text-bhasma-200 text-xs font-medium truncate">{sanitizeText(item.title)}</p>
                <p className="text-bhasma-500 text-xs">{item.category} • {item.duration}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {filteredSortedMedia.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/3 p-8 text-center">
          <p className="text-4xl mb-2">🔍</p>
          <h3 className="text-bhasma-100 font-semibold mb-1">No bhajans found</h3>
          <p className="text-bhasma-500 text-sm">Try a different search term, category, or reset filters.</p>
        </div>
      ) : (
        <>
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-widest text-bhasma-500 font-semibold mb-4">Audio Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSortedMedia.filter(item => item.type === 'audio').map((item) => {
                const isFavorite = favorites.includes(item.id)
                const unavailable = isMissingMedia(mediaErrors, item.id)
                const isCurrent = currentTrackId === item.id

                return (
                  <article
                    key={item.id}
                    className={`rounded-2xl p-4 border ${
                      isCurrent
                        ? 'bg-saffron-500/10 border-saffron-500/40'
                        : 'bg-white/3 border-white/10 hover:border-white/20'
                    }`}
                    data-testid={`audio-card-${item.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-bhasma-100 text-sm font-semibold">{sanitizeText(item.title)}</h3>
                        <p className="text-bhasma-500 text-xs">{sanitizeText(item.artist)}</p>
                        <p className="text-bhasma-600 text-xs mt-1">{item.category} • {item.duration}</p>
                        {isCurrent && (
                          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-saffron-500/20 text-saffron-300 border border-saffron-500/30">
                            Now Playing
                          </span>
                        )}
                      </div>

                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => toggleFavorite(item.id)}
                          aria-label={isFavorite ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}
                          className={`w-8 h-8 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gold-400/60 ${
                            isFavorite
                              ? 'bg-gold-500/20 border-gold-500/30 text-yellow-300'
                              : 'bg-white/5 border-white/10 text-bhasma-400'
                          }`}
                        >
                          {isFavorite ? '★' : '☆'}
                        </button>

                        <button
                          type="button"
                          onClick={() => setExpandedLyricsId(prev => prev === item.id ? null : item.id)}
                          className="w-8 h-8 rounded-lg border bg-white/5 border-white/10 text-bhasma-300 focus:outline-none focus:ring-2 focus:ring-saffron-400/60"
                          aria-label={`Toggle lyrics for ${item.title}`}
                        >
                          ॐ
                        </button>
                      </div>
                    </div>

                    <p className="text-bhasma-500 text-xs leading-relaxed mt-2">{sanitizeText(item.description)}</p>

                    {unavailable ? (
                      <div className="mt-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-bhasma-400">
                        Audio not available. Expected local file URL: {item.src}
                      </div>
                    ) : (
                      <div className="mt-3 space-y-3">
                        <audio
                          controls
                          preload="metadata"
                          className="w-full"
                          onError={(event) => {
                            const failedSrc = (event.currentTarget as HTMLAudioElement).currentSrc || item.src
                            console.error('[bhajan:audio-card-error]', { id: item.id, src: failedSrc })
                            handleMediaError(item.id, 'audio-card-load-failed')
                          }}
                        >
                          <source src={item.src} type="audio/mpeg" />
                          Your browser does not support audio.
                        </audio>

                        <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectTrack(item.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-saffron-500/20 text-saffron-300 border border-saffron-500/30 hover:bg-saffron-500/30 focus:outline-none focus:ring-2 focus:ring-saffron-400/60"
                          aria-label={`Play ${item.title}`}
                          data-testid={`play-${item.id}`}
                        >
                          {isCurrent && isPlaying ? 'Pause in Player' : 'Play in Player'}
                        </button>
                        {item.allowDownload && (
                          <a
                            href={getMediaUrl(item.src, item.cdnSrc)}
                            download
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neelkanth-500/20 text-blue-300 border border-neelkanth-500/30 hover:bg-neelkanth-500/30"
                            aria-label={`Download ${item.title}`}
                          >
                            Download
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => copyMantra(item)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-bhasma-300 border border-white/10 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-saffron-400/60"
                          aria-label={`Copy mantra text for ${item.title}`}
                        >
                          Copy Mantra
                        </button>
                        <button
                          type="button"
                          onClick={() => shareOnWhatsApp(item)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-400/60"
                          aria-label={`Share ${item.title} on WhatsApp`}
                        >
                          Share WhatsApp
                        </button>
                        <Link
                          href={`/bhajan/${item.slug}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-bhasma-300 border border-white/10 hover:bg-white/10"
                          aria-label={`Open details for ${item.title}`}
                        >
                          Details
                        </Link>
                        </div>
                      </div>
                    )}

                    {expandedLyricsId === item.id && (
                      <div className="mt-3 rounded-xl bg-black/20 border border-white/10 p-3 text-xs space-y-2">
                        <div>
                          <p className="text-saffron-300 font-semibold mb-1">Sanskrit / Hindi</p>
                          <p className="text-bhasma-200 leading-relaxed">{sanitizeText(item.lyricsHindi)}</p>
                        </div>
                        <div>
                          <p className="text-saffron-300 font-semibold mb-1">Transliteration</p>
                          <p className="text-bhasma-300 leading-relaxed">{sanitizeText(item.transliteration)}</p>
                        </div>
                        <div>
                          <p className="text-saffron-300 font-semibold mb-1">Meaning</p>
                          <p className="text-bhasma-400 leading-relaxed">{sanitizeText(item.meaning)}</p>
                        </div>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-widest text-bhasma-500 font-semibold mb-4">Video Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredSortedMedia.filter(item => item.type === 'video').map((item) => (
                <div key={item.id}>
                  <VideoMediaCard item={item} onError={(id) => handleMediaError(id, 'video-load-failed')} />
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="rounded-xl p-4 bg-white/3 border border-white/10 text-xs text-bhasma-500 space-y-1">
        <p>Use only licensed, self-created, or royalty-free devotional media.</p>
        <p>Configure media source with NEXT_PUBLIC_MEDIA_BASE_URL for CDN or alternate hosting.</p>
        <p>Signed media access is supported with NEXT_PUBLIC_MEDIA_TOKEN / NEXT_PUBLIC_MEDIA_SIGNATURE.</p>
        <p>Max simultaneous media loads target: {mediaSourceConfig.maxSimultaneousLoads}.</p>
      </section>

      {currentTrack && playerVisible && (
        <section className="fixed bottom-3 left-3 right-3 z-50 rounded-2xl border border-saffron-500/30 bg-neelkanth-900/95 backdrop-blur-md p-3 shadow-2xl relative">
          <button
            type="button"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause()
              }
              setIsPlaying(false)
              setPlayerVisible(false)
            }}
            title="Close player"
            aria-label="Close audio player"
            className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-neelkanth-800 border border-saffron-500/40 flex items-center justify-center text-bhasma-400 hover:text-white hover:border-saffron-400 transition-all focus:outline-none focus:ring-2 focus:ring-saffron-400/60 text-xs z-10 shadow-md"
          >
            ✕
          </button>
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="min-w-0 md:w-1/3">
              <p className="text-bhasma-100 text-sm font-semibold truncate">{currentTrack.title}</p>
              <p className="text-bhasma-500 text-xs truncate">{currentTrack.artist}</p>
              {isTrackLoading && <p className="text-[10px] text-saffron-300 mt-1">Loading audio metadata...</p>}
              {isBuffering && <p className="text-[10px] text-yellow-300 mt-1">Buffering on slow network...</p>}
              {!isTrackLoading && !isBuffering && (
                <p className="text-[10px] text-bhasma-500 mt-1 break-all">Source: {itemSourceLabel(currentTrack, audioRef.current?.currentSrc || '')}</p>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-bhasma-500 w-10 text-right">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={Math.min(currentTime, duration || 0)}
                  onChange={(e) => handleProgressChange(Number(e.target.value))}
                  className="w-full accent-saffron-500"
                  aria-label="Seek playback position"
                />
                <span className="text-xs text-bhasma-500 w-10">{formatTime(duration)}</span>
              </div>

              <div className="mt-2 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setShuffle(prev => !prev)}
                  aria-pressed={shuffle}
                  aria-label="Toggle shuffle"
                  className={`px-2.5 py-1 rounded-lg text-xs border focus:outline-none focus:ring-2 focus:ring-saffron-400/60 ${
                    shuffle ? 'bg-saffron-500/20 border-saffron-500/30 text-saffron-300' : 'bg-white/5 border-white/10 text-bhasma-400'
                  }`}
                >
                  Shuffle
                </button>
                <button
                  type="button"
                  onClick={goToPrevious}
                  aria-label="Previous track"
                  className="px-2.5 py-1 rounded-lg text-xs border bg-white/5 border-white/10 text-bhasma-300 focus:outline-none focus:ring-2 focus:ring-saffron-400/60"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={togglePlayPause}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="px-3 py-1 rounded-lg text-xs font-semibold border bg-saffron-500/20 border-saffron-500/30 text-saffron-300 focus:outline-none focus:ring-2 focus:ring-saffron-400/60"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Next track"
                  className="px-2.5 py-1 rounded-lg text-xs border bg-white/5 border-white/10 text-bhasma-300 focus:outline-none focus:ring-2 focus:ring-saffron-400/60"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={cycleRepeatMode}
                  aria-label="Toggle repeat mode"
                  className="px-2.5 py-1 rounded-lg text-xs border bg-white/5 border-white/10 text-bhasma-300 focus:outline-none focus:ring-2 focus:ring-saffron-400/60"
                >
                  Repeat: {repeatMode}
                </button>
              </div>
            </div>

            <div className="md:w-1/5 flex items-center gap-2">
              <label htmlFor="volume" className="text-xs text-bhasma-500">Vol</label>
              <input
                id="volume"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full accent-saffron-500"
                aria-label="Volume control"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
