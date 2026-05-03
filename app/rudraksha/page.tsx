'use client'

import { useState } from 'react'
import { challenges, goals, getRecommendation } from '@/lib/rudraksha-data'
import type { RudrakshaRecommendation, QuizAnswer } from '@/lib/rudraksha-data'

type Step = 'intro' | 'challenge' | 'goal' | 'preference' | 'result'

const preferences = [
  { value: 'single', label: 'Single Bead', description: 'One powerful bead, worn as pendant', icon: '🟤' },
  { value: 'mala', label: 'Full Mala (108)', description: 'Complete rosary for chanting', icon: '📿' },
  { value: 'combination', label: 'Combination Mala', description: 'Multiple mukhis for various benefits', icon: '✨' },
]

export default function RudrakshaPage() {
  const [step, setStep] = useState<Step>('intro')
  const [answers, setAnswers] = useState<QuizAnswer>({ challenge: '', goal: '', preference: '', ageGroup: '' })
  const [results, setResults] = useState<RudrakshaRecommendation[]>([])
  const [selectedBead, setSelectedBead] = useState<RudrakshaRecommendation | null>(null)

  const handleChallenge = (value: string) => {
    setAnswers(prev => ({ ...prev, challenge: value }))
    setStep('goal')
  }

  const handleGoal = (value: string) => {
    setAnswers(prev => ({ ...prev, goal: value }))
    setStep('preference')
  }

  const handlePreference = (value: string) => {
    const finalAnswers = { ...answers, preference: value }
    setAnswers(finalAnswers)
    const recs = getRecommendation(finalAnswers)
    setResults(recs)
    setSelectedBead(recs[0])
    setStep('result')
  }

  const reset = () => {
    setStep('intro')
    setAnswers({ challenge: '', goal: '', preference: '', ageGroup: '' })
    setResults([])
    setSelectedBead(null)
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">📿</div>
        <h1 className="text-3xl font-bold mb-2">
          <span className="gold-shimmer">Rudraksha Advisor</span>
        </h1>
        <p className="text-bhasma-500 text-sm max-w-md mx-auto">
          Discover your sacred bead based on your life situation, goals, and Shiva&apos;s guidance.
        </p>
      </div>

      {/* Progress Bar */}
      {step !== 'intro' && step !== 'result' && (
        <div className="mb-8">
          <div className="flex justify-between text-xs text-bhasma-600 mb-2">
            <span>Step {step === 'challenge' ? 1 : step === 'goal' ? 2 : 3} of 3</span>
            <span>{step === 'challenge' ? 'Challenge' : step === 'goal' ? 'Goal' : 'Preference'}</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full sacred-progress rounded-full transition-all duration-500"
              style={{ width: step === 'challenge' ? '33%' : step === 'goal' ? '66%' : '100%' }}
            />
          </div>
        </div>
      )}

      {/* INTRO */}
      {step === 'intro' && (
        <div className="text-center">
          <div className="sacred-card rounded-2xl p-8 mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(8,12,20,1), rgba(255,107,53,0.05))' }}>
            <h2 className="text-xl font-bold text-bhasma-100 mb-4">Aapka Rudraksha Khojein</h2>
            <p className="text-bhasma-400 text-sm mb-6 leading-relaxed max-w-md mx-auto">
              Rudraksha — Shiva&apos;s tears — are living beads carrying specific divine frequencies.
              Each mukhi (face) connects to a deity, planet, and life force.
              This 3-step quiz helps you find your perfect match.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { icon: '🎯', text: 'Tell us your challenge' },
                { icon: '⭐', text: 'Share your goal' },
                { icon: '📿', text: 'Get your recommendation' },
              ].map((item, i) => (
                <div key={i} className="bg-white/3 rounded-xl p-3">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-xs text-bhasma-500">{item.text}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep('challenge')}
              className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-saffron-500 to-gold-500 text-white hover:opacity-90 transition-all saffron-glow"
            >
              Shuru Karo — Start Quiz 📿
            </button>
          </div>

          {/* All Rudraksha Info */}
          <h3 className="text-sm uppercase tracking-widest text-bhasma-500 mb-4">Rudraksha Knowledge</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { mukhi: 1, name: 'Ek Mukhi', deity: 'Shiva', for: 'Liberation', icon: '🌕' },
              { mukhi: 5, name: 'Panch Mukhi', deity: 'Kalagni Rudra', for: 'Health & Peace', icon: '⭐' },
              { mukhi: 6, name: 'Shash Mukhi', deity: 'Kartikeya', for: 'Willpower', icon: '🔱' },
              { mukhi: 7, name: 'Sapt Mukhi', deity: 'Mahalakshmi', for: 'Prosperity', icon: '💎' },
              { mukhi: 8, name: 'Asht Mukhi', deity: 'Ganesha', for: 'Remove Obstacles', icon: '🐘' },
              { mukhi: 11, name: 'Gyarah Mukhi', deity: '11 Rudras', for: 'Protection', icon: '🛡️' },
            ].map((r) => (
              <div key={r.mukhi} className="sacred-card bg-white/3 rounded-xl p-4 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{r.icon}</span>
                  <span className="text-xs font-bold text-gold-400">{r.mukhi} Mukhi</span>
                </div>
                <p className="text-sm font-medium text-bhasma-200">{r.name}</p>
                <p className="text-xs text-bhasma-600 mb-1">Deity: {r.deity}</p>
                <p className="text-xs text-saffron-400">{r.for}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: CHALLENGE */}
      {step === 'challenge' && (
        <div>
          <h2 className="text-xl font-bold text-bhasma-100 mb-2 text-center">Aapki Sabse Badi Takleef Kya Hai?</h2>
          <p className="text-bhasma-500 text-sm text-center mb-6">Be honest — Shiva sees your truth with love, not judgment.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {challenges.map((c) => (
              <button
                key={c.value}
                onClick={() => handleChallenge(c.value)}
                className="sacred-card flex items-center gap-4 p-4 rounded-xl bg-white/3 text-left hover:border-saffron-500/50 transition-all group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{c.emoji}</span>
                <div>
                  <p className="text-bhasma-200 font-medium text-sm">{c.label}</p>
                </div>
                <span className="ml-auto text-bhasma-700 group-hover:text-saffron-400 transition-colors">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: GOAL */}
      {step === 'goal' && (
        <div>
          <h2 className="text-xl font-bold text-bhasma-100 mb-2 text-center">Aapka Sabse Bada Sapna Kya Hai?</h2>
          <p className="text-bhasma-500 text-sm text-center mb-6">Your deepest aspiration guides Shiva&apos;s recommendation for you.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goals.map((g) => (
              <button
                key={g.value}
                onClick={() => handleGoal(g.value)}
                className="sacred-card flex items-center gap-4 p-4 rounded-xl bg-white/3 text-left hover:border-gold-500/50 transition-all group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{g.emoji}</span>
                <p className="text-bhasma-200 font-medium text-sm">{g.label}</p>
                <span className="ml-auto text-bhasma-700 group-hover:text-gold-400 transition-colors">→</span>
              </button>
            ))}
          </div>
          <button onClick={() => setStep('challenge')} className="mt-4 w-full text-center text-xs text-bhasma-600 hover:text-bhasma-400">
            ← Back
          </button>
        </div>
      )}

      {/* STEP 3: PREFERENCE */}
      {step === 'preference' && (
        <div>
          <h2 className="text-xl font-bold text-bhasma-100 mb-2 text-center">Aap Kaise Pehenna Chahte Ho?</h2>
          <p className="text-bhasma-500 text-sm text-center mb-6">Each form carries its own energy and purpose.</p>
          <div className="space-y-3">
            {preferences.map((p) => (
              <button
                key={p.value}
                onClick={() => handlePreference(p.value)}
                className="sacred-card w-full flex items-center gap-4 p-5 rounded-xl bg-white/3 text-left hover:border-saffron-500/50 transition-all group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{p.icon}</span>
                <div>
                  <p className="text-bhasma-100 font-semibold">{p.label}</p>
                  <p className="text-bhasma-500 text-xs mt-0.5">{p.description}</p>
                </div>
                <span className="ml-auto text-bhasma-700 group-hover:text-saffron-400 transition-colors text-lg">→</span>
              </button>
            ))}
          </div>
          <button onClick={() => setStep('goal')} className="mt-4 w-full text-center text-xs text-bhasma-600 hover:text-bhasma-400">
            ← Back
          </button>
        </div>
      )}

      {/* RESULT */}
      {step === 'result' && results.length > 0 && (
        <div>
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🙏</div>
            <h2 className="text-2xl font-bold text-bhasma-100 mb-1">Bholenath ka Aashirwad</h2>
            <p className="text-bhasma-500 text-sm">Based on your answers, Shiva guides you toward:</p>
          </div>

          {/* Tab Selector */}
          {results.length > 1 && (
            <div className="flex gap-2 mb-4 justify-center">
              {results.map((r) => (
                <button
                  key={r.mukhi}
                  onClick={() => setSelectedBead(r)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedBead?.mukhi === r.mukhi
                      ? 'bg-saffron-500 text-white saffron-glow'
                      : 'bg-white/5 text-bhasma-400 hover:bg-white/10'
                  }`}
                >
                  {r.mukhi} Mukhi
                </button>
              ))}
            </div>
          )}

          {/* Selected Bead Detail */}
          {selectedBead && (
            <div className="sacred-card rounded-2xl overflow-hidden mb-6"
              style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.06), rgba(8,12,20,1) 50%, rgba(255,107,53,0.06))' }}>
              <div className={`h-1 w-full bg-gradient-to-r ${selectedBead.color}`} />
              <div className="p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400/20 to-saffron-500/20 border border-gold-500/30 flex items-center justify-center text-4xl">
                    {selectedBead.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gold-400">{selectedBead.mukhi} Mukhi Rudraksha</h3>
                    <p className="text-bhasma-300 text-sm">{selectedBead.name}</p>
                    <p className="text-bhasma-500 text-xs">Deity: {selectedBead.deity} | Planet: {selectedBead.planet}</p>
                  </div>
                </div>

                <div className="bg-white/3 rounded-xl p-4 mb-4 border border-gold-500/10">
                  <p className="text-xs text-gold-500 uppercase tracking-widest mb-2">Sacred Mantra</p>
                  <p className="text-gold-300 text-lg font-devanagari">{selectedBead.mantra}</p>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-saffron-400 uppercase tracking-widest mb-2">Labh — Benefits</p>
                  <div className="space-y-2">
                    {selectedBead.benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 flex-shrink-0" />
                        <p className="text-bhasma-300 text-sm">{b}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-neelkanth-900/50 border border-neelkanth-500/20 rounded-xl p-4 mb-4">
                  <p className="text-xs text-blue-400 uppercase tracking-widest mb-2">Dharan Vidhi — Wearing Ritual</p>
                  <p className="text-bhasma-300 text-sm leading-relaxed">{selectedBead.wearingRitual}</p>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-saffron-500 to-gold-500 text-white hover:opacity-90 transition-all saffron-glow">
                    Buy Authentic {selectedBead.mukhi} Mukhi →
                  </button>
                  <button
                    onClick={() => {
                      const text = `📿 Mera Rudraksha: ${selectedBead.mukhi} Mukhi\n${selectedBead.name}\nMantra: ${selectedBead.mantra}\n\nShivMandir App se mila! 🕉️ Har Har Mahadev!`
                      navigator.clipboard.writeText(text)
                    }}
                    className="px-4 py-3 rounded-xl text-sm bg-white/5 text-bhasma-400 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    📤 Share
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={reset}
            className="w-full py-3 rounded-xl text-sm text-bhasma-500 border border-white/10 hover:border-saffron-500/30 hover:text-saffron-400 transition-all"
          >
            🔄 Quiz Dobara Lo — Retake Quiz
          </button>
        </div>
      )}
    </div>
  )
}
