'use client'

import { useCallback, useState } from 'react'

export interface FeaturedBhajanCardProps {
  videoId: string
  title: string
  subtitle: string
  category?: string
  description: string
  duration?: string
  isFreePlan?: boolean
}

// Static pre-computed data — prevents hydration mismatch and re-render jitter
const SECTION_PARTICLES = [
  { w: '6px', x: '5%',  y: '18%', c: '#FF6B35', o: 0.30, d: '0s',   t: '6s'   },
  { w: '4px', x: '18%', y: '72%', c: '#D4AF37', o: 0.25, d: '1.4s', t: '7.5s' },
  { w: '7px', x: '40%', y: '8%',  c: '#FF8C42', o: 0.20, d: '0.6s', t: '5.5s' },
  { w: '5px', x: '62%', y: '85%', c: '#FF6B35', o: 0.28, d: '2.1s', t: '8s'   },
  { w: '4px', x: '78%', y: '20%', c: '#D4AF37', o: 0.22, d: '1.9s', t: '6.5s' },
  { w: '6px', x: '92%', y: '55%', c: '#FF6B35', o: 0.18, d: '0.9s', t: '7s'   },
  { w: '3px', x: '52%', y: '90%', c: '#FFD700', o: 0.32, d: '3s',   t: '5.5s' },
  { w: '5px', x: '14%', y: '44%', c: '#FF8C42', o: 0.18, d: '2.6s', t: '6s'   },
  { w: '4px', x: '35%', y: '60%', c: '#D4AF37', o: 0.15, d: '1.2s', t: '8.5s' },
  { w: '3px', x: '88%', y: '78%', c: '#FF6B35', o: 0.25, d: '0.4s', t: '5s'   },
]

const THUMB_PARTICLES = [
  { w: '5px', x: '7%',  y: '15%', c: '#FF6B35', o: 0.60, d: '0.3s', t: '5s'   },
  { w: '4px', x: '84%', y: '10%', c: '#D4AF37', o: 0.55, d: '1s',   t: '6s'   },
  { w: '6px', x: '25%', y: '80%', c: '#FF8C42', o: 0.50, d: '1.5s', t: '7s'   },
  { w: '3px', x: '70%', y: '70%', c: '#FFD700', o: 0.55, d: '2s',   t: '5.5s' },
  { w: '5px', x: '48%', y: '88%', c: '#FF6B35', o: 0.40, d: '0.7s', t: '6.5s' },
  { w: '4px', x: '92%', y: '35%', c: '#D4AF37', o: 0.45, d: '2.4s', t: '5s'   },
  { w: '3px', x: '15%', y: '52%', c: '#FF8C42', o: 0.38, d: '1.1s', t: '7.5s' },
  { w: '4px', x: '60%', y: '22%', c: '#FFD700', o: 0.42, d: '3.2s', t: '6s'   },
]

export default function FeaturedBhajanCard({
  videoId,
  title,
  subtitle,
  category = 'Featured Bhajan',
  description,
  duration = '—',
  isFreePlan = true,
}: FeaturedBhajanCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [thumbSrc, setThumbSrc] = useState(
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  )
  const [thumbFailed, setThumbFailed] = useState(false)
  const [addedToPlaylist, setAddedToPlaylist] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  function handleThumbError() {
    if (thumbSrc.includes('maxresdefault')) {
      setThumbSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)
    } else {
      setThumbFailed(true)
    }
  }

  const handleAddToPlaylist = useCallback(() => {
    setAddedToPlaylist(true)
    setTimeout(() => setAddedToPlaylist(false), 2200)
  }, [])

  const handleShare = useCallback(async () => {
    const url = `https://www.youtube.com/watch?v=${videoId}`
    const text = `🔱 ${title} — ${subtitle}\nHar Har Mahadev 🕉️`
    try {
      // Alias via window.navigator avoids TypeScript's global-narrowing
      // of the `navigator` identifier across control-flow branches.
      const nav = window.navigator as Navigator & { share?: (d: ShareData) => Promise<void> }
      if (nav.share) {
        await nav.share({ title, text, url })
      } else {
        await nav.clipboard.writeText(`${text}\n${url}`)
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2200)
      }
    } catch {
      // share dismissed or clipboard unavailable
    }
  }, [videoId, title, subtitle])

  const youtubeWatch = `https://www.youtube.com/watch?v=${videoId}`

  return (
    <section
      aria-label={`Featured Bhajan: ${title}`}
      className="relative mb-8"
    >
      {/* Ambient section particles */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
        aria-hidden="true"
      >
        {SECTION_PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full animate-float motion-reduce:animate-none"
            style={{
              width: p.w, height: p.w, left: p.x, top: p.y,
              background: p.c, opacity: p.o,
              filter: 'blur(1.5px)',
              animationDelay: p.d, animationDuration: p.t,
            }}
          />
        ))}
      </div>

      {/* Section divider label */}
      <div className="relative mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-saffron-500/20 to-saffron-500/40" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-saffron-400/80 font-semibold px-3 flex items-center gap-1.5">
          <span aria-hidden="true">✨</span>
          Featured Bhajan
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-saffron-500/20 to-saffron-500/40" />
      </div>

      {/* Gradient border wrapper — the 1px border IS the gradient */}
      <div className="p-px rounded-2xl bg-gradient-to-br from-saffron-500/40 via-gold-500/15 to-neelkanth-600/25 featured-aura">
        <article
          className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-neelkanth-900/95 via-[#0d0800]/95 to-neelkanth-900/95 backdrop-blur-xl transition-transform duration-500 hover:-translate-y-0.5 hover:shadow-[0_24px_64px_rgba(255,107,53,0.15),0_8px_32px_rgba(0,0,0,0.6)] motion-reduce:transition-none group"
        >
          {/* Top glow bar */}
          <div
            className="absolute top-0 inset-x-0 h-px z-10 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(255,107,53,0.70) 35%, rgba(212,175,55,0.50) 65%, transparent 95%)' }}
            aria-hidden="true"
          />

          {/* Radial inner top glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 35% at 50% 0%, rgba(255,107,53,0.08) 0%, transparent 70%)' }}
            aria-hidden="true"
          />

          {/* ── VIDEO / THUMBNAIL AREA ── */}
          {isPlaying ? (
            <iframe
              className="w-full aspect-video"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              aria-label={`Play ${title}`}
              className="relative w-full aspect-video overflow-hidden group/play focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-saffron-400/70"
            >
              {/* Thumbnail or CSS cinematic fallback */}
              {!thumbFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbSrc}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/play:scale-105 motion-reduce:transition-none"
                  onError={handleThumbError}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#2d0a00] via-[#1a0d00] to-[#0c1a26]">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,107,53,0.22) 0%, transparent 68%), ' +
                        'radial-gradient(ellipse 40% 30% at 25% 70%, rgba(212,175,55,0.10) 0%, transparent 60%)',
                    }}
                  />
                </div>
              )}

              {/* Layered cinematic overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-neelkanth-900/45 via-transparent to-neelkanth-900/25" />
              <div className="absolute inset-0 bg-gradient-to-br from-saffron-900/10 via-transparent to-neelkanth-900/30" />

              {/* Trishul watermark — centered */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                aria-hidden="true"
              >
                <span
                  className="text-[clamp(90px,20vw,200px)] leading-none opacity-[0.055] animate-pulse-sacred motion-reduce:animate-none"
                  style={{ filter: 'drop-shadow(0 0 32px rgba(255,107,53,0.70))' }}
                >
                  🔱
                </span>
              </div>

              {/* Om watermark — bottom right */}
              <div
                className="absolute bottom-10 right-4 pointer-events-none select-none"
                aria-hidden="true"
              >
                <span
                  className="text-5xl opacity-[0.07] animate-om-spin motion-reduce:animate-none"
                  style={{ filter: 'drop-shadow(0 0 16px rgba(212,175,55,0.8))' }}
                >
                  🕉️
                </span>
              </div>

              {/* Floating energy particles */}
              <div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                aria-hidden="true"
              >
                {THUMB_PARTICLES.map((p, i) => (
                  <span
                    key={i}
                    className="absolute rounded-full animate-float motion-reduce:animate-none"
                    style={{
                      width: p.w, height: p.w, left: p.x, top: p.y,
                      background: p.c, opacity: p.o,
                      filter: 'blur(2px)',
                      animationDelay: p.d, animationDuration: p.t,
                    }}
                  />
                ))}
              </div>

              {/* Divine aura blob behind play button */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                aria-hidden="true"
              >
                <div
                  className="w-40 h-40 rounded-full blur-3xl opacity-[0.18] animate-pulse-sacred motion-reduce:animate-none"
                  style={{ background: 'radial-gradient(circle, #FF6B35 0%, #D4AF37 50%, transparent 80%)' }}
                />
              </div>

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Outer ping ring */}
                  <div
                    className="absolute inset-0 rounded-full border-2 border-saffron-400/50 animate-ping motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  {/* Middle fade ring */}
                  <div
                    className="absolute -inset-3 rounded-full border border-saffron-300/20 animate-pulse motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  {/* Button circle */}
                  <div className="relative w-[clamp(52px,9vw,70px)] h-[clamp(52px,9vw,70px)] rounded-full bg-gradient-to-br from-saffron-500/40 to-saffron-700/30 border-2 border-saffron-400/80 backdrop-blur-md flex items-center justify-center transition-all duration-200 group-hover/play:from-saffron-400/60 group-hover/play:to-saffron-600/50 group-hover/play:scale-110 group-hover/play:border-saffron-300 group-hover/play:shadow-[0_0_30px_rgba(255,107,53,0.55)] motion-reduce:transition-none">
                    <svg
                      className="w-7 h-7 text-white ml-1 drop-shadow-md"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* LIVE FEATURED badge — top left */}
              <div className="absolute top-3 left-3 z-10">
                <span className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full bg-black/50 text-saffron-300 border border-saffron-500/35 backdrop-blur-sm font-semibold tracking-wide">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-saffron-400 animate-pulse motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  LIVE FEATURED
                </span>
              </div>

              {/* Category + duration — bottom */}
              <div className="absolute bottom-3 inset-x-3 flex items-end justify-between">
                <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-saffron-500/25 to-gold-500/20 text-yellow-300 border border-gold-500/30 font-semibold backdrop-blur-sm">
                  {category}
                </span>
                {duration !== '—' && (
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-black/60 text-bhasma-300 backdrop-blur-sm tabular-nums font-medium">
                    {duration}
                  </span>
                )}
              </div>
            </button>
          )}

          {/* ── INFO AREA ── */}
          <div className="p-5 md:p-6">
            {/* Title + badge row */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-devanagari text-bhasma-50 text-xl md:text-2xl font-bold leading-snug">
                  {title}
                </h3>
                <p className="text-saffron-400/80 text-sm mt-0.5 font-medium">{subtitle}</p>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                <span className="text-xs px-2.5 py-1 rounded-full bg-gold-500/15 text-yellow-300 border border-gold-500/25 font-medium whitespace-nowrap">
                  {category}
                </span>
                {duration !== '—' && (
                  <span className="text-[10px] text-bhasma-600 tabular-nums">{duration}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-bhasma-400 text-sm leading-relaxed mt-1 mb-4 line-clamp-2">
              {description}
            </p>

            {/* Subtle divider */}
            <div
              className="h-px mb-4"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
              aria-hidden="true"
            />

            {/* 4 action buttons */}
            <div className="flex flex-wrap gap-2" role="group" aria-label="Bhajan actions">
              {/* ▶ Play Bhajan */}
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                aria-label={`Play ${title}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md shadow-saffron-500/25 hover:shadow-saffron-500/50 hover:from-saffron-400 hover:to-saffron-500 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400/70 motion-reduce:transition-none"
              >
                <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                ▶ Play Bhajan
              </button>

              {/* 📿 Add to Playlist */}
              <button
                type="button"
                onClick={handleAddToPlaylist}
                aria-label={addedToPlaylist ? 'Added to playlist' : 'Add to playlist'}
                aria-pressed={addedToPlaylist}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70 motion-reduce:transition-none ${
                  addedToPlaylist
                    ? 'bg-gold-500/20 text-yellow-300 border-gold-500/40'
                    : 'bg-white/5 text-bhasma-300 border-white/10 hover:bg-gold-500/10 hover:text-yellow-200 hover:border-gold-500/30'
                }`}
              >
                <span aria-hidden="true">{addedToPlaylist ? '✓' : '📿'}</span>
                {addedToPlaylist ? 'Added!' : 'Add to Playlist'}
              </button>

              {/* 📤 Share Bhajan */}
              <button
                type="button"
                onClick={handleShare}
                aria-label={shareCopied ? 'Link copied to clipboard' : 'Share this bhajan'}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neelkanth-400/70 motion-reduce:transition-none ${
                  shareCopied
                    ? 'bg-green-500/15 text-green-300 border-green-500/30'
                    : 'bg-white/5 text-bhasma-300 border-white/10 hover:bg-neelkanth-500/20 hover:text-blue-200 hover:border-neelkanth-400/30'
                }`}
              >
                <span aria-hidden="true">{shareCopied ? '✓' : '📤'}</span>
                {shareCopied ? 'Copied!' : 'Share Bhajan'}
              </button>

              {/* 🕉 Open in Temple Player */}
              <a
                href={youtubeWatch}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${title} in Temple Player (YouTube, opens new tab)`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 text-bhasma-300 border border-white/10 hover:bg-purple-500/10 hover:text-purple-200 hover:border-purple-400/30 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 motion-reduce:transition-none"
              >
                <span aria-hidden="true">🕉</span>
                Open in Temple Player
              </a>
            </div>
          </div>

          {/* Subscribe CTA */}
          <div className="px-5 md:px-6 pb-5 flex items-center gap-2">
            <svg
              className="h-3.5 w-3.5 text-red-500 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.2 3 12 3 12 3s-4.2 0-6.8.9c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.2v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.2 21.6 12 21.6 12 21.6s4.2 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z" />
            </svg>
            <a
              href={youtubeWatch}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-bhasma-500 hover:text-saffron-300 transition-colors focus-visible:outline-none focus-visible:underline"
              aria-label="Subscribe for more Mahadev Bhajans on YouTube"
            >
              Subscribe for more Mahadev Bhajans 🔱
            </a>
          </div>

          {/* Bottom glow bar */}
          <div
            className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.35) 35%, rgba(255,107,53,0.35) 65%, transparent 95%)' }}
            aria-hidden="true"
          />
        </article>
      </div>

      {/* Free plan upgrade banner */}
      {isFreePlan && (
        <div className="mt-3 rounded-xl border border-saffron-500/20 bg-gradient-to-r from-saffron-900/25 via-neelkanth-800/20 to-saffron-900/25 px-4 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-bhasma-200 text-sm font-semibold">Unlock Unlimited Shiv Bhajans</p>
            <p className="text-bhasma-500 text-xs mt-0.5">Access the full devotional library — Upgrade ₹99/mo</p>
          </div>
          <button
            type="button"
            className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md shadow-saffron-500/20 hover:shadow-saffron-500/40 hover:from-saffron-400 hover:to-saffron-500 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400/60 whitespace-nowrap motion-reduce:transition-none"
            aria-label="Upgrade to paid plan to unlock unlimited Shiv Bhajans"
          >
            Upgrade ₹99/mo
          </button>
        </div>
      )}
    </section>
  )
}
