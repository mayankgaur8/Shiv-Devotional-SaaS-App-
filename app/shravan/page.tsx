'use client'

import { useState, useEffect } from 'react'
import { shravan30Days, pujaChecklist } from '@/lib/shravan-data'

export default function ShravanPage() {
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set())
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})
  const [offeringAnim, setOfferingAnim] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [fastDays, setFastDays] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'challenge' | 'puja' | 'offering' | 'fast'>('challenge')

  // Persist progress in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('shravan-completed')
      if (saved) setCompletedDays(new Set(JSON.parse(saved)))
      const savedChecklist = localStorage.getItem('shravan-checklist')
      if (savedChecklist) setChecklist(JSON.parse(savedChecklist))
      const savedFast = localStorage.getItem('shravan-fast')
      if (savedFast) setFastDays(new Set(JSON.parse(savedFast)))
    } catch {}
  }, [])

  const toggleDay = (day: number) => {
    setCompletedDays(prev => {
      const next = new Set(prev)
      if (next.has(day)) next.delete(day)
      else next.add(day)
      localStorage.setItem('shravan-completed', JSON.stringify([...next]))
      return next
    })
  }

  const toggleChecklist = (id: string) => {
    setChecklist(prev => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem('shravan-checklist', JSON.stringify(next))
      return next
    })
  }

  const toggleFast = (day: string) => {
    setFastDays(prev => {
      const next = new Set(prev)
      if (next.has(day)) next.delete(day)
      else next.add(day)
      localStorage.setItem('shravan-fast', JSON.stringify([...next]))
      return next
    })
  }

  const offerBilva = () => {
    setOfferingAnim(true)
    setTimeout(() => setOfferingAnim(false), 3000)
  }

  const completionPct = Math.round((completedDays.size / 30) * 100)
  const checklistPct = Math.round((Object.values(checklist).filter(Boolean).length / pujaChecklist.length) * 100)

  const mondaysInShravan = ['Sawan Somvar 1', 'Sawan Somvar 2', 'Sawan Somvar 3', 'Sawan Somvar 4']
  const ekadashiDays = ['Sawan Ekadashi 1', 'Sawan Ekadashi 2']
  const pradoshDays = ['Pradosh Vrat 1', 'Pradosh Vrat 2', 'Pradosh Vrat 3', 'Pradosh Vrat 4']

  const selectedDayData = selectedDay ? shravan30Days.find(d => d.day === selectedDay) : null

  return (
    <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3 animate-float">🌧️</div>
        <h1 className="text-3xl font-bold mb-2">
          <span className="gold-shimmer">Shravan Special Mode</span>
        </h1>
        <p className="text-bhasma-500 text-sm">30 din, 30 sadhana — Shiv ke saath ek mahine ka safar 🕉️</p>

        {/* Stats Bar */}
        <div className="flex justify-center gap-6 mt-4 flex-wrap">
          <div className="text-center">
            <p className="text-2xl font-bold text-saffron-400">{completedDays.size}</p>
            <p className="text-xs text-bhasma-600">Days Complete</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gold-400">{completionPct}%</p>
            <p className="text-xs text-bhasma-600">Progress</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{fastDays.size}</p>
            <p className="text-xs text-bhasma-600">Fasts Done</p>
          </div>
        </div>

        {/* Main Progress Bar */}
        <div className="max-w-md mx-auto mt-4">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full sacred-progress rounded-full transition-all duration-700"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { id: 'challenge' as const, label: '30 Din Challenge', icon: '🔥' },
          { id: 'puja' as const, label: 'Puja Checklist', icon: '🪔' },
          { id: 'offering' as const, label: 'Bilva Offering', icon: '🍃' },
          { id: 'fast' as const, label: 'Fast Tracker', icon: '🌙' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-saffron-500 text-white saffron-glow'
                : 'bg-white/5 text-bhasma-400 hover:bg-white/10'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: 30 Din Challenge */}
      {activeTab === 'challenge' && (
        <div>
          {/* Day Detail Modal */}
          {selectedDayData && (
            <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedDay(null)}>
              <div className="sacred-card rounded-2xl p-6 max-w-md w-full"
                style={{ background: 'linear-gradient(135deg, #0C1A26, #080C14)' }}
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-saffron-400 uppercase tracking-widest">Day {selectedDayData.day}</span>
                  <button onClick={() => setSelectedDay(null)} className="text-bhasma-600 hover:text-bhasma-400 text-lg">✕</button>
                </div>
                <h3 className="text-xl font-bold text-gold-400 mb-4">{selectedDayData.theme}</h3>
                <div className="space-y-3 mb-5">
                  <div className="bg-white/3 rounded-xl p-3">
                    <p className="text-xs text-bhasma-500 mb-1">Aaj Ka Mantra</p>
                    <p className="text-gold-300 text-sm font-devanagari">{selectedDayData.mantra}</p>
                  </div>
                  <div className="bg-white/3 rounded-xl p-3">
                    <p className="text-xs text-bhasma-500 mb-1">Aaj Ki Sadhana</p>
                    <p className="text-bhasma-300 text-sm">{selectedDayData.ritual}</p>
                  </div>
                  <div className="bg-white/3 rounded-xl p-3">
                    <p className="text-xs text-bhasma-500 mb-1">Offering</p>
                    <p className="text-bhasma-300 text-sm">{selectedDayData.offering}</p>
                  </div>
                  <div className="bg-saffron-500/10 border border-saffron-500/20 rounded-xl p-3">
                    <p className="text-xs text-saffron-400 mb-1">Labh — Benefit</p>
                    <p className="text-bhasma-200 text-sm">{selectedDayData.benefit}</p>
                  </div>
                </div>
                <button
                  onClick={() => { toggleDay(selectedDayData.day); setSelectedDay(null) }}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                    completedDays.has(selectedDayData.day)
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-gradient-to-r from-saffron-500 to-gold-500 text-white saffron-glow'
                  }`}
                >
                  {completedDays.has(selectedDayData.day) ? '✅ Completed! Jai Shiv!' : '🙏 Mark as Complete'}
                </button>
              </div>
            </div>
          )}

          {/* 30-day Grid */}
          <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2">
            {shravan30Days.map((day) => (
              <button
                key={day.day}
                onClick={() => setSelectedDay(day.day)}
                className={`relative aspect-square rounded-xl text-sm font-bold transition-all hover:scale-105 ${
                  completedDays.has(day.day)
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20'
                    : 'bg-white/5 text-bhasma-400 border border-white/10 hover:border-saffron-500/30 hover:text-saffron-400'
                }`}
              >
                {completedDays.has(day.day) ? '✓' : day.day}
                {[7, 14, 21, 28].includes(day.day) && (
                  <span className="absolute -top-1 -right-1 text-xs">🌙</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-4 text-xs text-bhasma-600">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span>Complete</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-white/10 border border-white/20" />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🌙</span>
              <span>Sawan Somvar</span>
            </div>
          </div>

          {/* Today's Challenge */}
          {(() => {
            const today = shravan30Days[new Date().getDate() % 30]
            return (
              <div className="mt-6 sacred-card rounded-2xl p-5"
                style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(8,12,20,1))' }}>
                <p className="text-xs uppercase tracking-widest text-saffron-400 mb-2">Aaj Ki Sadhana — Day {today.day}</p>
                <h3 className="text-lg font-bold text-bhasma-100 mb-2">{today.theme}</h3>
                <p className="text-bhasma-400 text-sm mb-3">{today.ritual}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleDay(today.day)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      completedDays.has(today.day)
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white saffron-glow'
                    }`}
                  >
                    {completedDays.has(today.day) ? '✅ Done! Jai Shiv!' : '🙏 Mark Complete'}
                  </button>
                  <button onClick={() => setSelectedDay(today.day)}
                    className="px-4 py-2.5 rounded-xl text-sm bg-white/5 text-bhasma-400 border border-white/10 hover:bg-white/10">
                    Details →
                  </button>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Tab: Puja Checklist */}
      {activeTab === 'puja' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-bhasma-100">Aaj Ki Puja Checklist</h2>
            <span className="text-sm text-saffron-400 font-medium">{checklistPct}% done</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-6">
            <div className="h-full sacred-progress rounded-full transition-all duration-500" style={{ width: `${checklistPct}%` }} />
          </div>
          <div className="space-y-3">
            {pujaChecklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left ${
                  checklist[item.id]
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-white/3 border border-white/8 hover:border-saffron-500/30'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className={`flex-1 text-sm font-medium ${checklist[item.id] ? 'text-green-300 line-through' : 'text-bhasma-200'}`}>
                  {item.label}
                </span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  checklist[item.id]
                    ? 'border-green-400 bg-green-400 text-white'
                    : 'border-bhasma-700'
                }`}>
                  {checklist[item.id] && <span className="text-xs">✓</span>}
                </div>
              </button>
            ))}
          </div>
          {checklistPct === 100 && (
            <div className="mt-6 text-center p-5 rounded-2xl bg-green-500/10 border border-green-500/30">
              <p className="text-3xl mb-2">🙏</p>
              <p className="text-green-300 font-bold">Wah Bhakt! Aaj ki puja poori ho gayi!</p>
              <p className="text-green-500 text-sm mt-1">Bholenath sab dekh raha hai. Har Har Mahadev! 🕉️</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Digital Bilva Offering */}
      {activeTab === 'offering' && (
        <div className="text-center">
          <div className="max-w-md mx-auto">
            <p className="text-bhasma-500 text-sm mb-8 leading-relaxed">
              Bilva leaf is most sacred to Lord Shiva. Even a digital offering made with sincere heart reaches Bholenath.
              Your intention is the real puja.
            </p>

            <div className="relative w-48 h-48 mx-auto mb-8">
              <div className={`w-full h-full rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                offeringAnim
                  ? 'border-green-400 bg-green-400/10 scale-110'
                  : 'border-saffron-500/40 bg-saffron-500/5'
              }`}>
                <div className="text-center">
                  <div className={`text-7xl transition-all duration-300 ${offeringAnim ? 'scale-125 animate-bounce' : ''}`}>
                    {offeringAnim ? '✨' : '🍃'}
                  </div>
                  <p className="text-xs text-bhasma-600 mt-2">{offeringAnim ? 'Swikaara!' : 'Bilva Patra'}</p>
                </div>
              </div>
              {offeringAnim && (
                <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-30" />
              )}
            </div>

            {offeringAnim ? (
              <div className="mb-6">
                <p className="text-2xl font-bold text-green-300 mb-2">Swikaaro Prabhu! 🙏</p>
                <p className="text-bhasma-400 text-sm">
                  ॐ नमः शिवाय — Shiva has accepted your offering, bhakt. Your sincere heart is the truest bilva.
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-gold-400 text-lg font-devanagari mb-2">ॐ नमः शिवाय</p>
                <p className="text-bhasma-500 text-sm">Touch the bilva leaf to offer with devotion</p>
              </div>
            )}

            <button
              onClick={offerBilva}
              disabled={offeringAnim}
              className={`w-full py-4 rounded-2xl text-base font-semibold transition-all ${
                offeringAnim
                  ? 'bg-green-500/20 text-green-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:opacity-90 shadow-lg shadow-green-500/20'
              }`}
            >
              {offeringAnim ? '🙏 Shiva Swikaaro... Om Namah Shivaya' : '🍃 Shiva Ko Bilva Chadhao'}
            </button>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { item: 'Dhatura', emoji: '🌸', mantra: 'ॐ नमः शिवाय' },
                { item: 'Gangajal', emoji: '💧', mantra: 'ॐ गंगायै नमः' },
                { item: 'Vibhuti', emoji: '🌫️', mantra: 'ॐ भस्मोद्भवाय नमः' },
              ].map((o) => (
                <button
                  key={o.item}
                  className="sacred-card p-4 rounded-xl bg-white/3 text-center hover:border-saffron-500/30 transition-all"
                >
                  <span className="text-3xl block mb-2">{o.emoji}</span>
                  <p className="text-xs text-bhasma-400 mb-1">{o.item}</p>
                  <p className="text-xs text-gold-600 font-devanagari">{o.mantra}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Fast Tracker */}
      {activeTab === 'fast' && (
        <div>
          <h2 className="text-lg font-bold text-bhasma-100 mb-2">Upvas Tracker — Fast Tracker</h2>
          <p className="text-bhasma-500 text-sm mb-6">Track your Sawan fasts. Somvar, Ekadashi, Pradosh — sab yahan.</p>

          <div className="space-y-4">
            {[
              { title: 'Sawan Somvar', days: mondaysInShravan, icon: '🌙', desc: 'Shiva\'s day — most sacred Sawan fast' },
              { title: 'Ekadashi', days: ekadashiDays, icon: '🌓', desc: 'Fortnightly Vishnu-Shiva fast' },
              { title: 'Pradosh Vrat', days: pradoshDays, icon: '⭐', desc: 'Trayodashi — twilight Shiva fast' },
            ].map((category) => (
              <div key={category.title} className="sacred-card rounded-2xl p-5 bg-white/3">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-bhasma-200">{category.title}</h3>
                    <p className="text-xs text-bhasma-600">{category.desc}</p>
                  </div>
                  <span className="ml-auto text-xs text-saffron-400 font-bold">
                    {category.days.filter(d => fastDays.has(d)).length}/{category.days.length}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {category.days.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleFast(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        fastDays.has(day)
                          ? 'bg-saffron-500 text-white saffron-glow'
                          : 'bg-white/5 text-bhasma-500 border border-white/10 hover:border-saffron-500/30'
                      }`}
                    >
                      {fastDays.has(day) ? '✓ ' : ''}{day.split(' ').pop()}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-saffron-500/5 border border-saffron-500/15">
            <p className="text-xs text-saffron-400 font-semibold mb-1">Fast Breaking Niyam</p>
            <p className="text-bhasma-500 text-xs leading-relaxed">
              Sawan Somvar: Break fast after sunset with Shiv prasad (milk, fruits, sabudana).
              Ekadashi: Break on Dwadashi after sunrise puja. Pradosh: Break after evening Shiv aarti at dusk.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
