'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getTodaysGuidance, upcomingMuhurtas } from '@/lib/mantras'
import type { DailyGuidance } from '@/lib/mantras'

export default function Dashboard() {
  const [guidance, setGuidance] = useState<DailyGuidance | null>(null)
  const [today, setToday] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [shared, setShared] = useState(false)
  const [offeringDone, setOfferingDone] = useState(false)

  useEffect(() => {
    setGuidance(getTodaysGuidance())
    setToday(new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }))
    const tick = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }))
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  const featureCards = [
    {
      href: '/companion',
      icon: '🤖',
      title: 'AI Shiv Sahayak',
      subtitle: 'Ask Bholenath anything',
      gradient: 'from-neelkanth-600/40 to-neelkanth-800/40',
      border: 'border-neelkanth-500/30',
      badge: 'AI Powered',
      badgeColor: 'bg-blue-500/20 text-blue-300',
    },
    {
      href: '/rudraksha',
      icon: '📿',
      title: 'Rudraksha Advisor',
      subtitle: 'Find your sacred bead',
      gradient: 'from-amber-600/20 to-orange-800/20',
      border: 'border-amber-500/30',
      badge: 'Personalized',
      badgeColor: 'bg-amber-500/20 text-amber-300',
    },
    {
      href: '/shravan',
      icon: '🌧️',
      title: 'Shravan Challenge',
      subtitle: '30 days with Shiva',
      gradient: 'from-saffron-600/20 to-saffron-800/20',
      border: 'border-saffron-500/30',
      badge: '🔥 Seasonal',
      badgeColor: 'bg-saffron-500/20 text-saffron-300',
    },
    {
      href: '/temple',
      icon: '🛕',
      title: 'Temple Dashboard',
      subtitle: 'For temple trusts',
      gradient: 'from-purple-600/20 to-purple-800/20',
      border: 'border-purple-500/30',
      badge: 'B2B',
      badgeColor: 'bg-purple-500/20 text-purple-300',
    },
    {
      href: '/bhajan',
      icon: '🎵',
      title: 'Bhajan & Kirtan',
      subtitle: 'Sacred mantras & bhajans',
      gradient: 'from-yellow-600/20 to-amber-800/20',
      border: 'border-yellow-500/30',
      badge: '🎶 New',
      badgeColor: 'bg-yellow-500/20 text-yellow-300',
    },
  ]

  return (
    <div className="min-h-screen max-w-7xl mx-auto">

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[72vh] flex items-center justify-center mb-14 -mx-4 md:-mx-8 overflow-hidden rounded-b-3xl">
        {/* Shiva image — graceful fallback if file missing */}
        <Image
          src="/images/shiva/mahadev-hero.svg"
          alt="Lord Shiva — Har Har Mahadev"
          fill
          unoptimized
          className="object-cover opacity-30"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        {/* Sacred atmosphere gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#080C14]/60 to-[#080C14]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#3a1200]/40 via-transparent to-[#0C1A26]/30" />
        {/* Ambient glow orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-saffron-500/6 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full bg-gold-500/6 blur-2xl pointer-events-none" />
        {/* Decorative symbols */}
        <div className="absolute top-8 right-8 text-6xl opacity-10 animate-float select-none pointer-events-none">🔱</div>
        <div className="absolute top-8 left-8 text-5xl opacity-8 select-none pointer-events-none">🕉️</div>
        <div className="absolute bottom-10 left-12 text-3xl opacity-6 select-none pointer-events-none">🙏</div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 py-12">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="w-10 h-px bg-gradient-to-r from-transparent to-saffron-500/60" />
            <p className="text-saffron-400/90 text-xs uppercase tracking-[0.22em] font-semibold">
              {today}&nbsp;•&nbsp;{currentTime}
            </p>
            <span className="w-10 h-px bg-gradient-to-l from-transparent to-saffron-500/60" />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 leading-tight">
            <span className="gold-shimmer">Har Har Mahadev</span>
          </h1>
          <p className="text-2xl md:text-3xl font-devanagari text-saffron-300/90 mb-5 mantra-text">
            ॐ नमः शिवाय
          </p>
          <p className="text-bhasma-300 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Experience daily mantra, bhajan, digital seva, and Shiv wisdom in one sacred space.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
            <a
              href="#mantra"
              className="px-8 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-saffron-500 to-gold-500 text-white hover:opacity-90 transition-all shadow-lg saffron-glow text-center"
            >
              🕉️ Start Mantra
            </a>
            <Link
              href="/bhajan"
              className="px-8 py-3.5 rounded-xl text-sm font-semibold border border-saffron-500/40 text-saffron-300 hover:bg-saffron-500/10 transition-all text-center"
            >
              🎵 Listen Bhajans
            </Link>
            <Link
              href="/temple"
              className="px-8 py-3.5 rounded-xl text-sm font-semibold border border-gold-500/40 text-gold-300 hover:bg-gold-500/10 transition-all text-center"
            >
              🛕 Donate Seva
            </Link>
          </div>
        </div>
      </section>

      <div className="px-4 pb-10">

        {/* ── DAILY MANTRA CARD ── */}
        {guidance && (
          <div
            id="mantra"
            className="relative mb-10 rounded-2xl overflow-hidden sacred-card scroll-mt-24"
            style={{
              background: 'linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(8,12,20,1) 40%, rgba(30,58,95,0.15) 100%)',
              border: '1px solid rgba(255,107,53,0.2)',
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-saffron-500 to-transparent opacity-60" />
            <div className="absolute top-4 right-4 text-5xl opacity-8 select-none">🕉️</div>

            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-saffron-400 animate-pulse flex-shrink-0" />
                <span className="text-xs uppercase tracking-widest text-saffron-400 font-semibold">Aaj Ka Mantra</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-saffron-500/10 text-saffron-400 border border-saffron-500/20 flex-shrink-0">
                  {guidance.dayTheme}
                </span>
              </div>

              <div className="text-center py-6">
                <p className="text-3xl md:text-4xl font-devanagari text-gold-400 mantra-text leading-relaxed mb-3">
                  {guidance.mantra}
                </p>
                <p className="text-saffron-300 text-lg font-medium italic mb-2">
                  {guidance.mantraTransliteration}
                </p>
                <p className="text-bhasma-400 text-sm max-w-2xl mx-auto leading-relaxed">
                  {guidance.mantraTranslation}
                </p>
              </div>

              <div className="bg-white/3 rounded-xl p-4 border border-white/5 mb-4">
                <p className="text-bhasma-300 text-sm leading-relaxed">
                  <span className="text-saffron-400 font-medium">Shiv Sandesh: </span>
                  {guidance.energyMessage}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                <div className="flex items-center gap-3 bg-white/3 rounded-xl p-3">
                  <span className="text-2xl flex-shrink-0">⏰</span>
                  <div>
                    <p className="text-xs text-bhasma-500 uppercase tracking-wide">Best Dhyan Samay</p>
                    <p className="text-sm text-bhasma-200 font-medium">{guidance.meditationTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/3 rounded-xl p-3">
                  <span className="text-2xl flex-shrink-0">📿</span>
                  <div>
                    <p className="text-xs text-bhasma-500 uppercase tracking-wide">Rudra Sadhana</p>
                    <p className="text-sm text-bhasma-200 leading-snug">{guidance.rudraReminder.slice(0, 60)}…</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const text = `🕉️ Aaj Ka Shiv Mantra\n\n${guidance.mantra}\n${guidance.mantraTransliteration}\n\n${guidance.mantraTranslation}\n\nHar Har Mahadev! 🔱`
                    if (navigator.share) {
                      navigator.share({ title: 'Aaj Ka Shiv Mantra', text })
                    } else {
                      navigator.clipboard.writeText(text)
                      setShared(true)
                      setTimeout(() => setShared(false), 2000)
                    }
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-saffron-500/20 text-saffron-400 border border-saffron-500/30 hover:bg-saffron-500/30 transition-all"
                >
                  {shared ? '✅ Copied!' : '📤 WhatsApp Share'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOfferingDone(true)
                    setTimeout(() => setOfferingDone(false), 3000)
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    offeringDone
                      ? 'bg-green-500/30 text-green-300 border border-green-500/30'
                      : 'bg-gold-500/20 text-gold-400 border border-gold-500/30 hover:bg-gold-500/30'
                  }`}
                >
                  {offeringDone ? '🙏 Bilva Offered! Jai Shiv!' : '🍃 Digital Bilva Offer'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MUHURTA TIMELINE ── */}
        <div className="mb-10">
          <h2 className="text-xs uppercase tracking-widest text-bhasma-500 font-semibold mb-4">Aaj Ke Shubh Muhurta</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-thin">
            {upcomingMuhurtas.map((m, i) => (
              <div
                key={i}
                className="flex-shrink-0 snap-start bg-white/3 border border-white/8 rounded-xl p-3.5 min-w-[160px] hover:border-saffron-500/30 transition-all"
              >
                <p className="text-saffron-400 font-bold text-sm">{m.time}</p>
                <p className="text-bhasma-200 text-xs font-medium mt-1">{m.name}</p>
                <p className="text-bhasma-500 text-xs mt-0.5 leading-snug">{m.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SHIVA DARSHAN VISUAL CARDS ── */}
        <div className="mb-10">
          <h2 className="text-xs uppercase tracking-widest text-bhasma-500 font-semibold mb-4">Shiv Darshan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                src: '/images/shiva/mahadev-hero.svg',
                label: 'Mahadev',
                gradient: 'from-orange-900/70 via-neelkanth-900/60 to-black',
                icon: '🔱',
                caption: 'Har Har Mahadev',
              },
              {
                src: '/images/shiva/shiva-meditation.svg',
                label: 'Shiv Dhyan',
                gradient: 'from-neelkanth-900/70 via-purple-900/50 to-black',
                icon: '🧘',
                caption: 'Bholenath in eternal meditation',
              },
              {
                src: '/images/shiva/shivling-diya.svg',
                label: 'Shivling',
                gradient: 'from-amber-900/70 via-yellow-900/40 to-black',
                icon: '🪔',
                caption: 'Sacred Shivling with diya',
              },
            ].map((visual) => (
              <div key={visual.label} className="relative rounded-2xl overflow-hidden aspect-[4/3] sacred-card group cursor-default">
                <Image
                  src={visual.src}
                  alt={visual.label}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                {/* Gradient fallback — always behind image */}
                <div className={`absolute inset-0 bg-gradient-to-br ${visual.gradient}`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl mb-2 drop-shadow-lg">{visual.icon}</span>
                  <p className="text-bhasma-300 text-xs font-medium text-center px-3 leading-snug">{visual.caption}</p>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs text-white/70 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">{visual.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEVA KENDRA CARDS ── */}
        <h2 className="text-xs uppercase tracking-widest text-bhasma-500 font-semibold mb-4">Shiv Seva Kendra</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {featureCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`sacred-card relative rounded-2xl p-5 bg-gradient-to-br ${card.gradient} border ${card.border} block group`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{card.icon}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${card.badgeColor}`}>{card.badge}</span>
              </div>
              <h3 className="text-bhasma-100 font-semibold text-sm mb-1">{card.title}</h3>
              <p className="text-bhasma-500 text-xs">{card.subtitle}</p>
              <div className="absolute bottom-4 right-4 text-bhasma-600 group-hover:text-saffron-400 transition-colors text-lg">→</div>
            </Link>
          ))}
        </div>

        {/* ── BHAJAN PREVIEW BANNER ── */}
        <div
          className="rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-center gap-5"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(8,12,20,1) 60%, rgba(212,175,55,0.05) 100%)',
            border: '1px solid rgba(212,175,55,0.2)',
          }}
        >
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs uppercase tracking-widest text-gold-500 font-semibold mb-1">Divine Sounds</p>
            <h2 className="text-xl font-bold text-bhasma-100 mb-2">Listen to Divine Shiva Mantras</h2>
            <p className="text-bhasma-500 text-sm leading-relaxed">
              Om Namah Shivaya, Maha Mrityunjaya, Shiv Tandav, Aarti — all in one sacred library.
            </p>
          </div>
          <Link
            href="/bhajan"
            className="flex-shrink-0 w-full md:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-gold-500 to-saffron-500 text-white hover:opacity-90 transition-opacity shadow-lg text-center"
          >
            🎵 Open Bhajan Library
          </Link>
        </div>

        {/* ── TEMPLE SEVA + RUDRAKSHA ROW ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div
            className="rounded-2xl p-5 border border-purple-500/20"
            style={{ background: 'linear-gradient(135deg, rgba(88,28,135,0.15) 0%, rgba(8,12,20,1) 100%)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🛕</span>
              <div>
                <h3 className="text-bhasma-100 font-semibold text-sm">Temple Seva</h3>
                <p className="text-bhasma-500 text-xs">Digital pooja &amp; donations</p>
              </div>
            </div>
            <p className="text-bhasma-500 text-xs leading-relaxed mb-4">
              Contribute to temple seva and earn divine blessings through our verified temple network.
            </p>
            <Link
              href="/temple"
              className="block w-full text-center py-2.5 rounded-xl text-xs font-semibold border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 transition-all"
            >
              🙏 Donate Seva
            </Link>
          </div>

          <div
            className="rounded-2xl p-5 border border-amber-500/20"
            style={{ background: 'linear-gradient(135deg, rgba(120,53,15,0.15) 0%, rgba(8,12,20,1) 100%)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">📿</span>
              <div>
                <h3 className="text-bhasma-100 font-semibold text-sm">Rudraksha Advisor</h3>
                <p className="text-bhasma-500 text-xs">Sacred bead guidance</p>
              </div>
            </div>
            <p className="text-bhasma-500 text-xs leading-relaxed mb-4">
              AI-powered guidance to find your perfect Rudraksha based on your rashi, goals, and spiritual path.
            </p>
            <Link
              href="/rudraksha"
              className="block w-full text-center py-2.5 rounded-xl text-xs font-semibold border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 transition-all"
            >
              📿 Find My Rudraksha
            </Link>
          </div>
        </div>

        {/* ── AI SAHAYAK CTA ── */}
        <div
          className="rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-5"
          style={{
            background: 'linear-gradient(135deg, rgba(30,58,95,0.3) 0%, rgba(8,12,20,1) 60%)',
            border: '1px solid rgba(30,58,95,0.5)',
          }}
        >
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-2xl">🤖</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/20">AI Powered</span>
            </div>
            <h2 className="text-xl font-bold text-bhasma-100 mb-2">AI Shiv Sahayak</h2>
            <p className="text-bhasma-500 text-sm leading-relaxed">
              Ask Bholenath anything — mantras, rituals, spiritual guidance, and remedies.
            </p>
          </div>
          <Link
            href="/companion"
            className="flex-shrink-0 w-full md:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg text-center border border-neelkanth-400/30"
            style={{ background: 'linear-gradient(135deg, #1E3A5F, #122539)' }}
          >
            💬 Talk to Sahayak
          </Link>
        </div>

        {/* ── PRICING STRIP ── */}
        <div
          className="rounded-2xl p-6 mb-8 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(212,175,55,0.05), rgba(255,107,53,0.1))',
            border: '1px solid rgba(255,107,53,0.2)',
          }}
        >
          <p className="text-xs uppercase tracking-widest text-saffron-400 mb-4">Shiv Kripa Plans</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-5">
            {[
              { plan: 'Free', price: '₹0', feature: 'Daily Mantra' },
              { plan: 'Bhakt', price: '₹99/mo', feature: 'AI Companion + Guidance' },
              { plan: 'Sadhak', price: '₹499/yr', feature: 'Rudraksha + Remedies' },
              { plan: 'Temple', price: '₹1999/mo', feature: 'Full B2B Dashboard' },
            ].map((p) => (
              <div key={p.plan} className="text-center">
                <p className="text-xs text-bhasma-500 mb-0.5">{p.plan}</p>
                <p className="text-saffron-400 font-bold text-base">{p.price}</p>
                <p className="text-bhasma-600 text-xs">{p.feature}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="px-8 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-saffron-500 to-gold-500 text-white hover:opacity-90 transition-opacity saffron-glow"
          >
            Start Free — Har Har Mahadev 🕉️
          </button>
        </div>

        {/* ── FOOTER ── */}
        <div className="text-center py-6 border-t border-white/5">
          <p className="text-gold-500/80 font-devanagari text-xl mb-2">ॐ नमः शिवाय 🔱</p>
          <p className="text-bhasma-600 text-xs mb-1">ShivMandir — Your Personal Digital Shiv Mandir | Built with devotion</p>
          <p className="text-bhasma-700 text-xs">Har Har Mahadev &nbsp;•&nbsp; Jai Bholenath &nbsp;•&nbsp; Om Namah Shivaya</p>
        </div>

      </div>
    </div>
  )
}
