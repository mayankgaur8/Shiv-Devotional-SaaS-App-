'use client'

interface DonationCardProps {
  title: string
  description: string
  amount: number
  purpose: string
  onDonate: (amount: number, purpose: string) => void
}

export default function DonationCard({ title, description, amount, purpose, onDonate }: DonationCardProps) {
  return (
    <article className="sacred-card rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <h3 className="text-base font-semibold text-bhasma-100">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-bhasma-400">{description}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-bhasma-600">Suggested seva</p>
          <p className="text-lg font-bold text-saffron-400">Rs {amount.toLocaleString('en-IN')}</p>
        </div>
        <button
          type="button"
          onClick={() => onDonate(amount, purpose)}
          className="rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-saffron-400 hover:to-saffron-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400"
          aria-label={`Donate Rs ${amount} for ${purpose}`}
        >
          Donate
        </button>
      </div>
    </article>
  )
}
