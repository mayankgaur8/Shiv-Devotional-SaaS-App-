'use client'

import { useState, useEffect } from 'react'
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
      gradient: 'from-yellow-600/20 to-gold-800/20',
      border: 'border-gold-500/30',
      badge: '🎶 New',
      badgeColor: 'bg-gold-500/20 text-yellow-300',
    },
  ]

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-bhasma-500 text-sm mb-1">{today} • {currentTime}</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          <span className="gold-shimmer">Har Har Mahadev</span>
        </h1>
        <p className="text-bhasma-400 text-base">
          Bholenath ki kripa aap par sada bani rahe 🙏
        </p>
      </div>

      {/* Daily Mantra Hero Card */}
      {guidance && (
        <div className="relative mb-8 rounded-2xl overflow-hidden sacred-card"
          style={{
            background: 'linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(8,12,20,1) 40%, rgba(30,58,95,0.15) 100%)',
            border: '1px solid rgba(255,107,53,0.2)',
          }}>
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-saffron-500 to-transparent opacity-60" />
          <div className="absolute top-4 right-4 text-5xl opacity-10 select-none">🕉️</div>

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-saffron-400 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-saffron-400 font-semibold">Aaj Ka Mantra</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-saffron-500/10 text-saffron-400 border border-saffron-500/20">
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
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="text-xs text-bhasma-500 uppercase tracking-wide">Best Dhyan Samay</p>
                  <p className="text-sm text-bhasma-200 font-medium">{guidance.meditationTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/3 rounded-xl p-3">
                <span className="text-2xl">📿</span>
                <div>
                  <p className="text-xs text-bhasma-500 uppercase tracking-wide">Rudra Sadhana</p>
                  <p className="text-sm text-bhasma-200 leading-snug">{guidance.rudraReminder.slice(0, 60)}...</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
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

      {/* Muhurta Timeline */}
      <div className="mb-8">
        <h2 className="text-sm uppercase tracking-widest text-bhasma-500 font-semibold mb-4">Aaj Ke Shubh Muhurta</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {upcomingMuhurtas.map((m, i) => (
            <div key={i} className="flex-shrink-0 bg-white/3 border border-white/8 rounded-xl p-3.5 min-w-[160px] hover:border-saffron-500/30 transition-all">
              <p className="text-saffron-400 font-bold text-sm">{m.time}</p>
              <p className="text-bhasma-200 text-xs font-medium mt-1">{m.name}</p>
              <p className="text-bhasma-500 text-xs mt-0.5 leading-snug">{m.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards Grid */}
      <h2 className="text-sm uppercase tracking-widest text-bhasma-500 font-semibold mb-4">Shiv Seva Kendra</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {featureCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`sacred-card relative rounded-2xl p-5 bg-gradient-to-br ${card.gradient} border ${card.border} block group`}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl group-hover:scale-110 transition-transform">{card.icon}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${card.badgeColor}`}>{card.badge}</span>
            </div>
            <h3 className="text-bhasma-100 font-semibold text-sm mb-1">{card.title}</h3>
            <p className="text-bhasma-500 text-xs">{card.subtitle}</p>
            <div className="absolute bottom-4 right-4 text-bhasma-600 group-hover:text-saffron-400 transition-colors text-lg">→</div>
          </Link>
        ))}
      </div>

      {/* Bhajan / Listen Section */}
      <div className="rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-5"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(8,12,20,1) 60%, rgba(212,175,55,0.05) 100%)', border: '1px solid rgba(212,175,55,0.2)' }}>
        <div className="flex-1 text-center md:text-left">
          <p className="text-xs uppercase tracking-widest text-gold-500 font-semibold mb-1">Divine Sounds</p>
          <h2 className="text-xl font-bold text-bhasma-100 mb-2">Listen to Divine Shiva Mantras</h2>
          <p className="text-bhasma-500 text-sm leading-relaxed">
            Om Namah Shivaya, Maha Mrityunjaya, Shiv Tandav, Aarti — all in one place.
          </p>
        </div>
        <Link
          href="/bhajan"
          className="flex-shrink-0 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-gold-500 to-saffron-500 text-white hover:opacity-90 transition-opacity shadow-lg"
        >
          🎵 Open Bhajan Library
        </Link>
      </div>

      {/* Pricing Strip */}
      <div className="rounded-2xl p-6 mb-8 text-center"
        style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(212,175,55,0.05), rgba(255,107,53,0.1))', border: '1px solid rgba(255,107,53,0.2)' }}>
        <p className="text-xs uppercase tracking-widest text-saffron-400 mb-2">Shiv Kripa Plans</p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {[
            { plan: 'Free', price: '₹0', feature: 'Daily Mantra' },
            { plan: 'Bhakt', price: '₹99/mo', feature: 'AI Companion + Guidance' },
            { plan: 'Sadhak', price: '₹499/yr', feature: 'Rudraksha + Remedies' },
            { plan: 'Temple', price: '₹1999/mo', feature: 'Full B2B Dashboard' },
          ].map((p) => (
            <div key={p.plan} className="text-center">
              <p className="text-xs text-bhasma-500 mb-0.5">{p.plan}</p>
              <p className="text-saffron-400 font-bold text-sm">{p.price}</p>
              <p className="text-bhasma-600 text-xs">{p.feature}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-saffron-500 to-gold-500 text-white hover:opacity-90 transition-opacity saffron-glow">
          Start Free — Har Har Mahadev 🕉️
        </button>
      </div>

      {/* Footer */}
      <p className="text-center text-bhasma-700 text-xs pb-4">
        🔱 ShivMandir — Your Personal Digital Shiv Mandir | Built with devotion
      </p>
    </div>
  )
}
