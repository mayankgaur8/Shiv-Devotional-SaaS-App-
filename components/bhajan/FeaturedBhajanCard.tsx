'use client'

import { useState } from 'react'

const VIDEO_ID = 'msSY1Od4WrE'
const YOUTUBE_WATCH = `https://www.youtube.com/watch?v=${VIDEO_ID}`
const EMBED_BASE = `https://www.youtube.com/embed/${VIDEO_ID}`
const THUMB_MAXRES = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`
const THUMB_HQ = `https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`

const SEO_TAGS = [
  'Mahadev Bhajan',
  'Bum Bum Mahakaal',
  'Har Har Mahadev',
  'Shiv Anthem',
  'Shiv Tandav Energy',
]

// Pre-computed so positions never cause hydration mismatch or re-render jitter
const SECTION_PARTICLES = [
  { size: '6px', x: '5%',  y: '20%', color: '#FF6B35', opacity: 0.30, delay: '0s',    dur: '6s'   },
  { size: '4px', x: '20%', y: '75%', color: '#D4AF37', opacity: 0.25, delay: '1.4s',  dur: '7s'   },
  { size: '7px', x: '42%', y: '8%',  color: '#FF8C42', opacity: 0.20, delay: '0.6s',  dur: '5.5s' },
  { size: '5px', x: '65%', y: '88%', color: '#FF6B35', opacity: 0.28, delay: '2.1s',  dur: '8s'   },
  { size: '4px', x: '80%', y: '18%', color: '#D4AF37', opacity: 0.22, delay: '1.9s',  dur: '6.5s' },
  { size: '6px', x: '93%', y: '58%', color: '#FF6B35', opacity: 0.18, delay: '0.9s',  dur: '7.5s' },
  { size: '3px', x: '55%', y: '92%', color: '#FFD700', opacity: 0.32, delay: '3s',    dur: '5.5s' },
  { size: '5px', x: '12%', y: '48%', color: '#FF8C42', opacity: 0.18, delay: '2.6s',  dur: '6s'   },
]

const THUMB_PARTICLES = [
  { size: '5px', x: '8%',  y: '18%', color: '#FF6B35', opacity: 0.55, delay: '0.3s', dur: '5s'   },
  { size: '4px', x: '82%', y: '12%', color: '#D4AF37', opacity: 0.50, delay: '1s',   dur: '6s'   },
  { size: '6px', x: '28%', y: '78%', color: '#FF8C42', opacity: 0.45, delay: '1.5s', dur: '7s'   },
  { size: '3px', x: '72%', y: '68%', color: '#FFD700', opacity: 0.50, delay: '2s',   dur: '5.5s' },
  { size: '5px', x: '50%', y: '88%', color: '#FF6B35', opacity: 0.40, delay: '0.7s', dur: '6.5s' },
  { size: '4px', x: '90%', y: '38%', color: '#D4AF37', opacity: 0.45, delay: '2.4s', dur: '5s'   },
  { size: '3px', x: '18%', y: '55%', color: '#FF8C42', opacity: 0.38, delay: '1.1s', dur: '7.5s' },
]

interface Props {
  isFreePlan?: boolean
}

export default function FeaturedBhajanCard({ isFreePlan = true }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [thumbSrc, setThumbSrc] = useState(THUMB_MAXRES)
  const [thumbFailed, setThumbFailed] = useState(false)

  function handleThumbError() {
    if (thumbSrc === THUMB_MAXRES) {
      setThumbSrc(THUMB_HQ)
    } else {
      setThumbFailed(true)
    }
  }

  return (
    <section
      aria-label="Featured Shiv Bhajan — BUM BUM MAHAKAAL Anthem"
      className="relative mb-10"
    >
      {/* Ambient particles behind the section */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
        aria-hidden="true"
      >
        {SECTION_PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: p.size,
              height: p.size,
              left: p.x,
              top: p.y,
              background: p.color,
              opacity: p.opacity,
              filter: 'blur(1.5px)',
              animationDelay: p.delay,
              animationDuration: p.dur,
            }}
          />
        ))}
      </div>

      {/* Section divider */}
      <div className="relative mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-saffron-500/30" />
        <span className="text-xs uppercase tracking-[0.18em] text-saffron-400/80 font-semibold px-3 flex items-center gap-1.5">
          <span aria-hidden="true">✨</span>
          Featured Bhajan
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-saffron-500/30" />
      </div>

      {/* Main card */}
      <article
        className="relative rounded-2xl overflow-hidden border border-saffron-500/25 bg-gradient-to-br from-[#100800] via-neelkanth-900/80 to-[#0a0c18] transition-all duration-300 hover:border-saffron-500/55 hover:shadow-[0_0_50px_rgba(255,107,53,0.13),0_8px_32px_rgba(0,0,0,0.5)] hover:scale-[1.003]"
      >
        {/* Inner top glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl z-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(255,107,53,0.07) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />

        {/* ── Video area ── */}
        <div className="relative z-10">
          {isPlaying ? (
            /* Active iframe player */
            <iframe
              className="w-full aspect-video"
              src={`${EMBED_BASE}?autoplay=1&rel=0&modestbranding=1`}
              title="BUM BUM MAHAKAAL (Anthem) — Shiv Bhajan"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            /* Cinematic thumbnail + play overlay */
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              aria-label="Play BUM BUM MAHAKAAL Shiv Bhajan"
              className="relative w-full aspect-video overflow-hidden group focus:outline-none focus:ring-2 focus:ring-inset focus:ring-saffron-400/60"
            >
              {/* Background */}
              {!thumbFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbSrc}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={handleThumbError}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#2d0a00] via-[#1a0d00] to-[#0c1a26]">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,107,53,0.22) 0%, transparent 68%), radial-gradient(ellipse 40% 30% at 25% 70%, rgba(212,175,55,0.10) 0%, transparent 60%)',
                    }}
                  />
                </div>
              )}

              {/* Cinematic gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-br from-saffron-900/15 via-transparent to-neelkanth-900/35" />

              {/* Large ambient trishul */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                aria-hidden="true"
              >
                <span
                  className="text-[clamp(80px,18vw,180px)] leading-none opacity-[0.055] animate-pulse-sacred"
                  style={{ filter: 'drop-shadow(0 0 28px rgba(255,107,53,0.65))' }}
                >
                  🔱
                </span>
              </div>

              {/* Floating energy particles inside thumbnail */}
              <div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                aria-hidden="true"
              >
                {THUMB_PARTICLES.map((p, i) => (
                  <span
                    key={i}
                    className="absolute rounded-full animate-float"
                    style={{
                      width: p.size,
                      height: p.size,
                      left: p.x,
                      top: p.y,
                      background: p.color,
                      opacity: p.opacity,
                      filter: 'blur(2px)',
                      animationDelay: p.delay,
                      animationDuration: p.dur,
                    }}
                  />
                ))}
              </div>

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full border-2 border-saffron-400/55 animate-ping"
                    aria-hidden="true"
                  />
                  <div className="relative h-[clamp(52px,8vw,68px)] w-[clamp(52px,8vw,68px)] rounded-full bg-saffron-500/25 border-2 border-saffron-400/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-saffron-500/50 group-hover:scale-110 group-hover:border-saffron-300 transition-all duration-200">
                    <svg
                      className="h-6 w-6 text-white ml-1"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom badges */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <span className="text-xs px-2.5 py-1 rounded-full bg-gold-500/20 text-yellow-300 border border-gold-500/30 font-semibold backdrop-blur-sm">
                  Bhajan
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-black/65 text-bhasma-300 backdrop-blur-sm tabular-nums">
                  03:02
                </span>
              </div>
            </button>
          )}
        </div>

        {/* ── Info area ── */}
        <div className="relative z-10 p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <h2 className="text-bhasma-50 text-lg font-bold leading-snug">
                BUM BUM MAHAKAAL{' '}
                <span className="text-saffron-400 text-sm font-semibold">(Anthem)</span>
              </h2>
              <p className="text-bhasma-400 text-xs mt-1 leading-relaxed">
                Powerful Shiv Anthem invoking Mahakaal energy.
              </p>
            </div>
            <span className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full bg-gold-500/15 text-yellow-300 border border-gold-500/25 font-medium">
              Bhajan
            </span>
          </div>

          {/* SEO-friendly tag chips */}
          <div className="flex flex-wrap gap-1.5 mb-4" aria-label="Tags">
            {SEO_TAGS.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-saffron-500/10 text-saffron-400/80 border border-saffron-500/20"
              >
                #{tag.replace(/ /g, '')}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              aria-label="Play BUM BUM MAHAKAAL Bhajan inline"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md shadow-saffron-500/25 hover:shadow-saffron-500/50 hover:from-saffron-400 hover:to-saffron-500 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-saffron-400/60"
            >
              <svg
                className="h-4 w-4 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              Play Bhajan
            </button>

            <a
              href={YOUTUBE_WATCH}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Watch BUM BUM MAHAKAAL on YouTube (opens new tab)"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-red-600/15 text-red-400 border border-red-500/30 hover:bg-red-600/30 hover:border-red-400/50 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400/60"
            >
              {/* YouTube icon */}
              <svg
                className="h-4 w-4 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.2 3 12 3 12 3s-4.2 0-6.8.9c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.2v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.2 21.6 12 21.6 12 21.6s4.2 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z" />
              </svg>
              Watch on YouTube
            </a>
          </div>
        </div>

        {/* YouTube subscribe CTA */}
        <div className="relative z-10 px-5 pb-4 flex items-center gap-2">
          <svg
            className="h-3.5 w-3.5 text-red-500 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.2 3 12 3 12 3s-4.2 0-6.8.9c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.2v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.2 21.6 12 21.6 12 21.6s4.2 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z" />
          </svg>
          <a
            href={YOUTUBE_WATCH}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-bhasma-500 hover:text-saffron-300 transition-colors focus:outline-none focus:underline"
            aria-label="Subscribe for more Mahadev Bhajans on YouTube"
          >
            Subscribe for more Mahadev Bhajans 🔱
          </a>
        </div>
      </article>

      {/* Free plan upgrade banner */}
      {isFreePlan && (
        <div className="mt-3 rounded-xl border border-saffron-500/20 bg-gradient-to-r from-saffron-900/25 via-neelkanth-800/20 to-saffron-900/25 px-4 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-bhasma-200 text-sm font-semibold">
              Unlock Unlimited Shiv Bhajans
            </p>
            <p className="text-bhasma-500 text-xs mt-0.5">
              Access the full devotional library — Upgrade ₹99/mo
            </p>
          </div>
          <button
            type="button"
            className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md shadow-saffron-500/20 hover:shadow-saffron-500/40 hover:from-saffron-400 hover:to-saffron-500 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-saffron-400/60 whitespace-nowrap"
            aria-label="Upgrade to paid plan to unlock unlimited Shiv Bhajans"
          >
            Upgrade ₹99/mo
          </button>
        </div>
      )}
    </section>
  )
}
