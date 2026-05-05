'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { getMediaUrl, mediaSourceConfig } from '@/src/data/devotionalMedia'
import { sanitizeText } from '@/src/lib/sanitize'
import type { DevotionalMediaItem } from '@/src/data/devotionalMedia'

interface VideoMediaCardProps {
  item: DevotionalMediaItem
  onError: (id: string) => void
}

const categoryBadge: Record<string, string> = {
  Mantra: 'bg-neelkanth-500/20 text-blue-300',
  Aarti: 'bg-saffron-500/20 text-saffron-300',
  Bhajan: 'bg-gold-500/20 text-yellow-300',
  Stotra: 'bg-purple-500/20 text-purple-300',
  Meditation: 'bg-green-500/20 text-green-300',
}

let activeVideoLoads = 0

interface PlayOverlayProps {
  thumbnailSrc: string
  label: string
  badge?: string
  onClick: () => void
}

function PlayOverlay({ thumbnailSrc, label, badge, onClick }: PlayOverlayProps) {
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="relative h-[220px] w-full overflow-hidden group focus:outline-none focus:ring-2 focus:ring-saffron-400/60"
    >
      {imgFailed ? (
        <div className="absolute inset-0 bg-gradient-to-br from-neelkanth-900 via-neelkanth-800 to-saffron-900/50" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailSrc}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImgFailed(true)}
        />
      )}

      <div className="absolute inset-0 bg-black/45 group-hover:bg-black/30 transition-colors" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-14 w-14 rounded-full bg-white/20 border-2 border-white/70 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-150">
          <svg className="h-6 w-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {badge && (
        <span className="absolute bottom-2 right-2 text-[10px] px-2 py-0.5 rounded bg-black/60 text-bhasma-400">
          {badge}
        </span>
      )}
    </button>
  )
}

export default function VideoMediaCard({ item, onError }: VideoMediaCardProps) {
  const [useYoutube, setUseYoutube] = useState(
    () => !!(item.youtubeId && (!item.src || item.src.endsWith('.mov')))
  )
  const [youtubeActive, setYoutubeActive] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [thumbFailed, setThumbFailed] = useState(false)
  const [isLoadingVideo, setIsLoadingVideo] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const [mountPlayer, setMountPlayer] = useState(false)
  const [loadLimited, setLoadLimited] = useState(false)
  const countedRef = useRef(false)

  const videoSrc = useMemo(() => getMediaUrl(item.src, item.cdnSrc), [item.cdnSrc, item.src])
  const thumbSrc = useMemo(() => getMediaUrl(item.thumbnail), [item.thumbnail])
  const youtubeThumbnailSrc = item.youtubeId
    ? `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`
    : thumbSrc

  const canMount = mountPlayer || retryCount > 0

  useEffect(() => {
    if (!canMount || countedRef.current) return

    if (activeVideoLoads >= mediaSourceConfig.maxSimultaneousLoads) {
      setLoadLimited(true)
      return
    }

    countedRef.current = true
    activeVideoLoads += 1

    return () => {
      if (countedRef.current) {
        activeVideoLoads = Math.max(0, activeVideoLoads - 1)
        countedRef.current = false
      }
    }
  }, [canMount])

  return (
    <article className="rounded-2xl overflow-hidden border border-white/10 bg-white/3 hover:border-white/20 transition-colors">
      <div className="relative bg-neelkanth-900/60 min-h-[220px]">

        {/* ── Local video: playing ── */}
        {!useYoutube && !videoFailed && canMount && !loadLimited && (
          <>
            {isLoadingVideo && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-neelkanth-900 via-neelkanth-800 to-saffron-900/40" />
            )}
            <video
              src={`${videoSrc}${videoSrc.includes('?') ? '&' : '?'}attempt=${retryCount}`}
              controls
              preload="metadata"
              poster={thumbFailed ? undefined : thumbSrc}
              className="w-full h-full max-h-[320px] bg-neelkanth-900"
              aria-label={`Watch ${sanitizeText(item.title)}`}
              onLoadedData={() => setIsLoadingVideo(false)}
              onWaiting={() => setIsLoadingVideo(true)}
              onError={() => {
                const nextRetry = retryCount + 1
                if (nextRetry <= 2) {
                  setRetryCount(nextRetry)
                  setIsLoadingVideo(true)
                  return
                }
                setVideoFailed(true)
                setIsLoadingVideo(false)
                onError(item.id)
              }}
            >
              {item.captionsSrc && (
                <track
                  kind="captions"
                  src={getMediaUrl(item.captionsSrc)}
                  srcLang="en"
                  label="English captions"
                  default
                />
              )}
            </video>
          </>
        )}

        {/* ── Local video: failed → static thumbnail ── */}
        {!useYoutube && videoFailed && (
          <div className="relative h-[220px]">
            {!thumbFailed ? (
              <Image
                src={thumbSrc}
                alt={`${item.title} thumbnail`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-70"
                onError={() => setThumbFailed(true)}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-neelkanth-900 via-neelkanth-800 to-saffron-900/50" />
            )}
            <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center px-4 text-center">
              <p className="text-bhasma-200 text-sm mb-1">Video not available locally</p>
              <p className="text-bhasma-400 text-xs break-all">{videoSrc}</p>
            </div>
          </div>
        )}

        {/* ── Local video: not yet mounted → thumbnail + play ── */}
        {!useYoutube && !videoFailed && (!canMount || loadLimited) && (
          <PlayOverlay
            thumbnailSrc={thumbSrc}
            label={
              loadLimited
                ? `Load limit reached — tap to force-load ${sanitizeText(item.title)}`
                : `Play ${sanitizeText(item.title)}`
            }
            badge={loadLimited ? 'Load limit reached' : undefined}
            onClick={() => {
              setMountPlayer(true)
              setLoadLimited(false)
              setIsLoadingVideo(true)
            }}
          />
        )}

        {/* ── YouTube: iframe active ── */}
        {useYoutube && item.youtubeId && youtubeActive && (
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${item.youtubeId}?rel=0&autoplay=1`}
              title={sanitizeText(item.title)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}

        {/* ── YouTube: thumbnail + play ── */}
        {useYoutube && item.youtubeId && !youtubeActive && (
          <PlayOverlay
            thumbnailSrc={youtubeThumbnailSrc}
            label={`Play ${sanitizeText(item.title)}`}
            onClick={() => setYoutubeActive(true)}
          />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-bhasma-100 text-sm font-semibold">{sanitizeText(item.title)}</h3>
          <span className="text-bhasma-500 text-xs">{item.duration}</span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${categoryBadge[item.category]}`}>
            {item.category}
          </span>
          <p className="text-bhasma-500 text-xs">{sanitizeText(item.artist)}</p>
        </div>

        <p className="text-bhasma-500 text-xs leading-relaxed">{sanitizeText(item.description)}</p>

        <div className="mt-3 flex gap-2">
          {item.youtubeId && !useYoutube && (
            <button
              type="button"
              onClick={() => {
                setUseYoutube(true)
                setYoutubeActive(true)
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-400/60"
              aria-label={`Watch ${item.title} on YouTube`}
            >
              Watch on YouTube
            </button>
          )}
          {useYoutube && (
            <button
              type="button"
              onClick={() => {
                setUseYoutube(false)
                setYoutubeActive(false)
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-bhasma-300 border border-white/10 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-saffron-400/60"
              aria-label={`Switch ${item.title} to local video`}
            >
              Use Local Video
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
