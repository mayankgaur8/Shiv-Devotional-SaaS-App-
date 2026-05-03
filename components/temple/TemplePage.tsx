'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import DonationCard from '@/components/temple/DonationCard'
import DonationModal from '@/components/temple/DonationModal'
import PaymentStatus, { PaymentState } from '@/components/temple/PaymentStatus'

type DonationRow = {
  id: string
  donorName: string
  amount: number
  purpose: string
  status: 'created' | 'processing' | 'success' | 'failed' | 'cancelled' | 'abandoned'
  createdAt: string
}

const cards = [
  {
    title: 'Nitya Aarti Seva',
    description: 'Support daily aarti and diya seva at the temple sanctum.',
    amount: 251,
    purpose: 'Daily Aarti Seva',
  },
  {
    title: 'Rudra Abhishek',
    description: 'Contribute towards sacred jal, bilva patra, and abhishek offerings.',
    amount: 501,
    purpose: 'Rudra Abhishek',
  },
  {
    title: 'Annadan Seva',
    description: 'Help provide prasadam and meals to visiting devotees.',
    amount: 1001,
    purpose: 'Prasad Distribution',
  },
]

export default function TemplePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [seedAmount, setSeedAmount] = useState(101)
  const [seedPurpose, setSeedPurpose] = useState('General Donation')
  const [recentDonations, setRecentDonations] = useState<DonationRow[]>([])
  const [historyState, setHistoryState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [bannerStatus, setBannerStatus] = useState<PaymentState>('idle')

  const successfulTotal = useMemo(() => {
    return recentDonations
      .filter(d => d.status === 'success')
      .reduce((sum, item) => sum + item.amount, 0)
  }, [recentDonations])

  const refreshRecentDonations = async () => {
    setHistoryState('loading')
    try {
      const response = await fetch('/api/payment/history', { cache: 'no-store' })
      const result = (await response.json()) as { success: boolean; donations: DonationRow[] }
      if (response.ok && result.success) {
        setRecentDonations(Array.isArray(result.donations) ? result.donations : [])
        setHistoryState('ready')
        return
      }
      setRecentDonations([])
      setHistoryState('error')
    } catch {
      setRecentDonations([])
      setHistoryState('error')
    }
  }

  useEffect(() => {
    void refreshRecentDonations()
  }, [])

  const launchDonation = (amount: number, purpose: string) => {
    setSeedAmount(amount)
    setSeedPurpose(purpose)
    setBannerStatus('idle')
    setIsModalOpen(true)
  }

  return (
    <section className="mx-auto min-h-screen w-full max-w-6xl px-3 pb-24 pt-6 sm:px-4 sm:pt-8 md:pb-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border border-saffron-500/20 bg-gradient-to-br from-saffron-500/10 via-[#101727] to-[#0a101b] p-4 sm:p-6"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-saffron-400">Temple Seva</p>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-bhasma-100 sm:text-3xl md:text-4xl">
          Offer your devotion with secure digital donation
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-bhasma-300 sm:text-base">
          Every contribution supports daily puja, annadan, and temple upkeep. Fast checkout, instant status,
          and respectful devotional experience.
        </p>

        <div className="mt-4 grid gap-3 text-xs text-bhasma-300 sm:grid-cols-3 sm:text-sm">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">Secure payment gateway</div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">Receipt confirmation support</div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">Temple-backed transparency</div>
        </div>
      </motion.div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
          >
            <DonationCard {...card} onDonate={launchDonation} />
          </motion.div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-bhasma-100">Recent donation status</h2>
            <p className="text-xs text-bhasma-500 sm:text-sm">Track successful and pending contributions in real time.</p>
          </div>
          <div className="rounded-xl border border-green-400/30 bg-green-500/10 px-3 py-2 text-sm font-semibold text-green-300">
            Successful total: Rs {successfulTotal.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {historyState === 'loading' ? (
            <p className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-bhasma-400">
              Loading recent donations...
            </p>
          ) : historyState === 'error' ? (
            <p className="rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">
              Unable to load recent donations right now. Please try again shortly.
            </p>
          ) : recentDonations.length === 0 ? (
            <p className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-bhasma-400">
              No recent donations yet.
            </p>
          ) : (
            recentDonations.map(item => (
              <article
                key={item.id}
                className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-bhasma-200">{item.donorName}</p>
                  <p className="truncate text-xs text-bhasma-500">{item.purpose}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-saffron-400">Rs {item.amount.toLocaleString('en-IN')}</p>
                  <p className="text-xs capitalize text-bhasma-500">{item.status}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      <div className="mt-6">
        <PaymentStatus status={bannerStatus} />
      </div>

      <DonationModal
        isOpen={isModalOpen}
        initialAmount={seedAmount}
        initialPurpose={seedPurpose}
        onClose={() => setIsModalOpen(false)}
        onDonationComplete={() => {
          setBannerStatus('success')
          setIsModalOpen(false)
          void refreshRecentDonations()
        }}
      />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-saffron-500/20 bg-[#0c1220]/95 p-3 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => launchDonation(101, 'General Donation')}
          className="w-full rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 px-4 py-3 text-sm font-semibold text-white shadow-lg"
          aria-label="Open donation form"
        >
          Donate Now
        </button>
      </div>
    </section>
  )
}
