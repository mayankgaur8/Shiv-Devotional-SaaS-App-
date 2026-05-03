'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import PaymentStatus, { PaymentState } from '@/components/temple/PaymentStatus'

const PRESET_AMOUNTS = [51, 101, 251, 501, 1001]

interface DonationModalProps {
  isOpen: boolean
  initialAmount?: number
  initialPurpose?: string
  onClose: () => void
  onDonationComplete: () => void
}

interface CreateOrderResponse {
  success: boolean
  error?: string
  donationId?: string
  orderId?: string
  amount?: number
  currency?: 'INR'
  key?: string
  duplicate?: boolean
}

type RazorpayHandlerResponse = {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

type RazorpayOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayHandlerResponse) => void
  prefill?: {
    name?: string
    contact?: string
  }
  modal?: {
    ondismiss?: () => void
  }
  theme?: {
    color?: string
  }
}

type RazorpayInstance = {
  open: () => void
  on: (event: 'payment.failed', handler: (response: { error?: { description?: string } }) => void) => void
}

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance

interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  text: string
}

async function requestWithRetry(input: RequestInfo | URL, init: RequestInit, retries = 2): Promise<Response> {
  let attempt = 0
  let lastError: unknown = null

  while (attempt <= retries) {
    try {
      return await fetch(input, init)
    } catch (error) {
      lastError = error
      attempt += 1
      if (attempt > retries) break
      await new Promise(resolve => setTimeout(resolve, 250 * attempt))
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Network request failed.')
}

function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return Promise.resolve(false)
  }

  if ((window as Window & { Razorpay?: RazorpayConstructor }).Razorpay) {
    return Promise.resolve(true)
  }

  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function DonationModal({
  isOpen,
  initialAmount = PRESET_AMOUNTS[1],
  initialPurpose = 'General Donation',
  onClose,
  onDonationComplete,
}: DonationModalProps) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [purpose, setPurpose] = useState(initialPurpose)
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount)
  const [customAmount, setCustomAmount] = useState('')
  const [status, setStatus] = useState<PaymentState>('idle')
  const [feedback, setFeedback] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const pushToast = (type: ToastMessage['type'], text: string) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    setToasts(prev => [...prev, { id, type, text }])
    window.setTimeout(() => {
      setToasts(prev => prev.filter(item => item.id !== id))
    }, 2800)
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setPurpose(initialPurpose)
    setSelectedAmount(initialAmount)
    setCustomAmount('')
    setStatus('idle')
    setFeedback('')
    setToasts([])
  }, [isOpen, initialAmount, initialPurpose])

  const amount = useMemo(() => {
    const parsedCustom = Number(customAmount)
    if (Number.isInteger(parsedCustom) && parsedCustom > 0) {
      return parsedCustom
    }
    return selectedAmount
  }, [customAmount, selectedAmount])

  const validate = (): string | null => {
    if (name.trim().length < 2) {
      return 'Please enter your name.'
    }

    if (!Number.isInteger(amount) || amount < 10) {
      return 'Please enter a valid amount of at least Rs 10.'
    }

    const trimmed = contact.trim()
    if (trimmed && !/^([0-9]{10}|[^\s@]+@[^\s@]+\.[^\s@]+)$/.test(trimmed)) {
      return 'Contact should be a 10-digit mobile number or valid email.'
    }

    return null
  }

  const updateRemoteStatus = async (
    donationId: string,
    nextStatus: 'failed' | 'cancelled' | 'abandoned',
    reason?: string
  ) => {
    await requestWithRetry('/api/payment/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ donationId, status: nextStatus, reason }),
    })
  }

  const openRazorpayCheckout = async (
    data: Required<Pick<CreateOrderResponse, 'donationId' | 'orderId' | 'key' | 'amount' | 'currency'>>
  ) => {
    if (typeof window === 'undefined') {
      throw new Error('Payment checkout is only available in browser context.')
    }

    const hasScript = await loadRazorpayScript()

    const Razorpay = (window as Window & { Razorpay?: RazorpayConstructor }).Razorpay

    if (!hasScript || !Razorpay) {
      throw new Error('Unable to load payment gateway right now.')
    }

    const options: RazorpayOptions = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: 'Shiv Mandir',
      description: purpose,
      order_id: data.orderId,
      prefill: {
        name,
        contact,
      },
      handler: async (response: RazorpayHandlerResponse) => {
        try {
          const verifyResponse = await requestWithRetry('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              donationId: data.donationId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })

          const verifyResult = await verifyResponse.json()

          if (!verifyResponse.ok || !verifyResult.success) {
            throw new Error(verifyResult.error || 'Payment verification failed.')
          }

          setStatus('success')
          setFeedback(`🙏 Thank you for your donation of Rs ${amount}. Receipt ref: ${response.razorpay_payment_id}`)
          pushToast('success', 'Donation received successfully.')
          onDonationComplete()
        } catch (error) {
          setStatus('failed')
          setFeedback(error instanceof Error ? error.message : 'Payment verification failed.')
          pushToast('error', 'Verification failed. Please retry.')
        } finally {
          setIsSubmitting(false)
        }
      },
      modal: {
        ondismiss: () => {
          void updateRemoteStatus(data.donationId, 'abandoned', 'Checkout closed by user')
          setStatus('abandoned')
          setFeedback('Payment popup was closed. You can retry anytime.')
          pushToast('info', 'Payment was not completed.')
          setIsSubmitting(false)
        },
      },
      theme: {
        color: '#FF6B35',
      },
    }

    const checkout = new Razorpay(options)
    checkout.on('payment.failed', (response) => {
      void updateRemoteStatus(data.donationId, 'failed', response.error?.description)
      setStatus('failed')
      setFeedback(response.error?.description || 'Payment failed. Please retry.')
      pushToast('error', 'Payment failed. Please retry.')
      setIsSubmitting(false)
    })

    checkout.open()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }

    const validationError = validate()
    if (validationError) {
      setStatus('failed')
      setFeedback(validationError)
      return
    }

    setIsSubmitting(true)
    setStatus('processing')
    setFeedback('Initializing secure payment...')

    try {
      const response = await requestWithRetry('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, amount, purpose }),
      })

      const result = (await response.json()) as CreateOrderResponse

      if (!response.ok || !result.success || !result.donationId) {
        if (!response.ok && result.error?.toLowerCase().includes('credentials')) {
          throw new Error('Payment is temporarily unavailable: Razorpay keys are not configured on server.')
        }
        throw new Error(result.error || 'Unable to initialize donation.')
      }

      if (!result.orderId || !result.key || !result.amount || !result.currency) {
        throw new Error('Payment gateway configuration incomplete on server.')
      }

      await openRazorpayCheckout({
        donationId: result.donationId,
        orderId: result.orderId,
        key: result.key,
        amount: result.amount,
        currency: result.currency,
      })

      if (result.duplicate) {
        pushToast('info', 'Duplicate attempt detected, reusing active order.')
      }
    } catch (error) {
      setStatus('failed')
      setFeedback(error instanceof Error ? error.message : 'Donation could not be started.')
      pushToast('error', 'Payment initialization failed.')
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-3 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Donation form">
      <div className="pointer-events-none absolute right-4 top-4 z-[80] w-72 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg border px-3 py-2 text-xs shadow-lg ${
              toast.type === 'success'
                ? 'border-green-400/40 bg-green-500/20 text-green-100'
                : toast.type === 'error'
                  ? 'border-red-400/40 bg-red-500/20 text-red-100'
                  : 'border-blue-400/40 bg-blue-500/20 text-blue-100'
            }`}
          >
            {toast.text}
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d1420] p-4 shadow-2xl sm:p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-bhasma-100">Offer Your Donation</h2>
            <p className="mt-1 text-xs text-bhasma-500">Secure payment with instant receipt confirmation.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm text-bhasma-400 hover:bg-white/10 hover:text-bhasma-200"
            disabled={isSubmitting}
            aria-label="Close donation modal"
          >
            Close
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-bhasma-300">Select amount</legend>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {PRESET_AMOUNTS.map(value => (
                <button
                  key={value}
                  type="button"
                  className={`rounded-lg border px-2 py-2 text-sm font-semibold transition ${
                    selectedAmount === value && !customAmount
                      ? 'border-saffron-400 bg-saffron-500/20 text-saffron-300'
                      : 'border-white/10 bg-white/5 text-bhasma-300 hover:border-saffron-500/50'
                  }`}
                  onClick={() => {
                    setSelectedAmount(value)
                    setCustomAmount('')
                  }}
                >
                  Rs {value}
                </button>
              ))}
            </div>
            <label className="mt-3 block text-xs text-bhasma-500" htmlFor="customAmount">Custom amount</label>
            <input
              id="customAmount"
              type="number"
              min={10}
              value={customAmount}
              onChange={event => setCustomAmount(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-bhasma-100 outline-none focus:border-saffron-500/50"
              placeholder="Enter custom amount"
            />
          </fieldset>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-bhasma-500" htmlFor="donorName">Name *</label>
              <input
                id="donorName"
                type="text"
                value={name}
                onChange={event => setName(event.target.value)}
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-bhasma-100 outline-none focus:border-saffron-500/50"
                placeholder="Your full name"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-bhasma-500" htmlFor="contact">Email or mobile (optional)</label>
              <input
                id="contact"
                type="text"
                value={contact}
                onChange={event => setContact(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-bhasma-100 outline-none focus:border-saffron-500/50"
                placeholder="For receipt confirmation"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-bhasma-500" htmlFor="purpose">Purpose</label>
              <input
                id="purpose"
                type="text"
                value={purpose}
                onChange={event => setPurpose(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-bhasma-100 outline-none focus:border-saffron-500/50"
                placeholder="General Donation"
              />
            </div>
          </div>

          <PaymentStatus status={status} message={feedback} onRetry={() => setStatus('idle')} />

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-bhasma-500">By continuing, you agree to secure payment processing.</p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-saffron-400 hover:to-saffron-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Processing payment...' : `Donate Rs ${amount}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
