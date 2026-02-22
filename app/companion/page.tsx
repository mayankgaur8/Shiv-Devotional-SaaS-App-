'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const presetQuestions = [
  { emoji: '💼', text: 'Can I start a business this month?' },
  { emoji: '😰', text: 'I am very stressed and anxious. Help me.' },
  { emoji: '📿', text: 'Which Rudraksha should I wear?' },
  { emoji: '💔', text: 'I am going through a difficult relationship.' },
  { emoji: '🕉️', text: 'What is the meaning of Om Namah Shivaya?' },
  { emoji: '💰', text: 'I am facing financial difficulties.' },
  { emoji: '🧘', text: 'How do I start meditation?' },
  { emoji: '🌙', text: 'How should I observe Pradosh Vrat?' },
]

export default function CompanionPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Jai Shiv! 🙏 Bholenath ki kripa aap par sada bani rahe.\n\nMain Shiv Sahayak hoon — aapka digital bhakt companion. Aap mujhse kuch bhi pooch sakte ho — life decisions, spirituality, mantras, rituals, Shiva's teachings, ya koi bhi concern jo aapke mann mein hai.\n\nMain ek fellow bhakt ki tarah baat karta hoon — with love, wisdom, aur Shiva's guidance. 🕉️\n\nBolo, kya seva karun aapki?`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json()

      if (data.error) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `🙏 Kshama karo bhakt — ${data.error}\n\nPeace ho aapko. Har Har Mahadev! 🔱`,
        }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      }
    } catch (err: unknown) {
      const isStaticDeploy = err instanceof TypeError && String(err).includes('fetch')
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isStaticDeploy
          ? `Jai Shiv! 🙏\n\nAI Sahayak ke liye ek live server chahiye — GitHub Pages sirf static files serve karta hai.\n\n**Local use ke liye:** App ko apne computer par chalao:\n\`npm run dev\`\n\nTab AI Sahayak poori tarah kaam karega. 🕉️\n\nTab tak, yeh mantras aapke saath hain:\n• ॐ नमः शिवाय\n• ॐ त्र्यम्बकं यजामहे\n\nHar Har Mahadev! 🔱`
          : `Jai Shiv! 🙏 Abhi connection mein thoda rukawat hai. Thodi der mein dobara try karo.\n\nTab tak, "ॐ नमः शिवाय" ka jaap karo — Shiva hamesha sunta hai. 🕉️`,
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="text-center mb-6">
        <div className="relative inline-block mb-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-3xl mx-auto pulse-ring">
            🕉️
          </div>
        </div>
        <h1 className="text-2xl font-bold text-bhasma-100 mb-1">Shiv Sahayak</h1>
        <p className="text-bhasma-500 text-sm">Aapka AI Bhakt Companion — powered by Shiv kripa & Claude AI</p>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400">Upsthit hain — Bholenath sunta hai</span>
        </div>
      </div>

      {/* Preset Questions */}
      {messages.length <= 1 && (
        <div className="mb-4">
          <p className="text-xs text-bhasma-600 uppercase tracking-widest mb-3 text-center">Aam Sawaal</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {presetQuestions.map((q) => (
              <button
                key={q.text}
                onClick={() => sendMessage(q.text)}
                className="sacred-card text-left p-3 rounded-xl text-xs text-bhasma-400 hover:text-bhasma-200 bg-white/3 transition-all"
              >
                <span className="block text-base mb-1">{q.emoji}</span>
                {q.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-[400px] max-h-[600px]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">
                🕉️
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'chat-bubble-user text-white rounded-br-sm'
                : 'chat-bubble-ai text-bhasma-200 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-bhasma-700 flex items-center justify-center text-sm ml-2 flex-shrink-0 mt-1">
                🙏
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-sm mr-2 flex-shrink-0">
              🕉️
            </div>
            <div className="chat-bubble-ai rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1.5 items-center">
                <span className="w-2 h-2 rounded-full bg-saffron-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-saffron-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-saffron-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-bhasma-500 ml-1">Bholenath se pooch raha hoon...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-transparent">
        <div className="flex gap-3 items-end p-3 rounded-2xl"
          style={{ background: 'rgba(8,12,20,0.95)', border: '1px solid rgba(255,107,53,0.2)', backdropFilter: 'blur(20px)' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Kuch bhi poochho Bholenath se... (Enter to send)"
            className="flex-1 bg-transparent text-bhasma-200 text-sm resize-none outline-none min-h-[40px] max-h-[120px] placeholder-bhasma-700"
            rows={1}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-600 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-saffron-400 hover:to-saffron-500 transition-all flex-shrink-0 saffron-glow"
          >
            {loading ? '⏳' : '🔱'}
          </button>
        </div>
        <p className="text-center text-bhasma-700 text-xs mt-2">
          Shiv Sahayak provides spiritual guidance, not medical or legal advice • Har Har Mahadev
        </p>
      </div>
    </div>
  )
}
