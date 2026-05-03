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

export default function VideoMediaCard({ item, onError }: VideoMediaCardProps) {
  // .mov is not browser-supported; auto-use YouTube embed when available
  const [useYoutube, setUseYoutube] = useState(() => !!(item.src.endsWith('.mov') && item.youtubeId))
  const [videoFailed, setVideoFailed] = useState(false)
  const [thumbFailed, setThumbFailed] = useState(false)
  const [isLoadingVideo, setIsLoadingVideo] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const [mountPlayer, setMountPlayer] = useState(false)
  const [loadLimited, setLoadLimited] = useState(false)
  const countedRef = useRef(false)

  const videoSrc = useMemo(() => getMediaUrl(item.src, item.cdnSrc), [item.cdnSrc, item.src])
  const thumbSrc = useMemo(() => getMediaUrl(item.thumbnail), [item.thumbnail])

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

        {!useYoutube && !videoFailed && (!canMount || loadLimited) && (
          <button
            type="button"
            onClick={() => {
              setMountPlayer(true)
              setLoadLimited(false)
              setIsLoadingVideo(true)
            }}
            className="h-[220px] w-full text-center px-4 bg-gradient-to-br from-neelkanth-900 via-neelkanth-800 to-saffron-900/50 text-bhasma-200 text-sm"
            aria-label={`Load video ${item.title}`}
          >
            {loadLimited ? 'Load Limit Reached' : 'Load Video'}
            <p className="text-xs text-bhasma-400 mt-2">Tap to mount player and reduce background media load.</p>
            <p className="text-[10px] text-bhasma-500 mt-1">Max active loads target: {mediaSourceConfig.maxSimultaneousLoads}</p>
          </button>
        )}

        {useYoutube && item.youtubeId && (
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${item.youtubeId}?rel=0`}
              title={sanitizeText(item.title)}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
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
              onClick={() => setUseYoutube(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-400/60"
              aria-label={`Watch ${item.title} on YouTube`}
            >
              Watch on YouTube
            </button>
          )}
          {useYoutube && (
            <button
              type="button"
              onClick={() => setUseYoutube(false)}
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
