'use client'

export type PaymentState = 'idle' | 'processing' | 'success' | 'failed' | 'cancelled'

interface PaymentStatusProps {
  status: PaymentState
  message?: string
  onRetry?: () => void
}

export default function PaymentStatus({ status, message, onRetry }: PaymentStatusProps) {
  if (status === 'idle') {
    return null
  }

  const styles = {
    processing: 'border-blue-400/30 bg-blue-500/10 text-blue-200',
    success: 'border-green-400/30 bg-green-500/10 text-green-200',
    failed: 'border-red-400/30 bg-red-500/10 text-red-200',
    cancelled: 'border-yellow-400/30 bg-yellow-500/10 text-yellow-200',
  }

  const defaultMessage = {
    processing: 'Payment is being processed. Please wait and do not close this window.',
    success: 'Thank you for your donation. Har Har Mahadev.',
    failed: 'Payment failed. Please retry your donation.',
    cancelled: 'Payment was cancelled before completion.',
  }

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${styles[status]}`}
      role="status"
      aria-live="polite"
    >
      <p className="font-medium">{message || defaultMessage[status]}</p>
      {(status === 'failed' || status === 'cancelled') && onRetry ? (
        <button
          type="button"
          className="mt-3 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          onClick={onRetry}
        >
          Retry Donation
        </button>
      ) : null}
    </div>
  )
}
