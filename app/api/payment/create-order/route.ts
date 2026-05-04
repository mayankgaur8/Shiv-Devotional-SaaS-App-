import { NextResponse } from 'next/server'
import {
  DonationValidationError,
  createDonationRecord,
  createRazorpayOrder,
  getRazorpayCredentials,
  getRazorpayPublicKey,
  listRecentDonations,
  updateDonationRecord,
} from '@/src/lib/temple-donations'

export const runtime = 'nodejs'

interface CreateOrderBody {
  amount: number
  name: string
  contact?: string
  purpose?: string
}

function matchesDuplicate(
  existing: { donorName: string; contact?: string; amount: number; purpose: string; status: string; createdAt: string },
  incoming: CreateOrderBody
): boolean {
  if (!['created', 'processing', 'success'].includes(existing.status)) {
    return false
  }

  const existingAt = new Date(existing.createdAt).getTime()
  const now = Date.now()
  const withinWindow = now - existingAt <= 2 * 60 * 1000

  if (!withinWindow) {
    return false
  }

  const incomingContact = String(incoming.contact || '').trim()
  const existingContact = String(existing.contact || '').trim()

  return (
    existing.amount === incoming.amount &&
    existing.purpose.toLowerCase() === String(incoming.purpose || 'General Donation').trim().toLowerCase() &&
    existing.donorName.toLowerCase() === incoming.name.trim().toLowerCase() &&
    incomingContact === existingContact
  )
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderBody
    console.log('[create-order] Request received', { amount: body.amount, name: body.name, purpose: body.purpose })

    if (!getRazorpayCredentials()) {
      console.error('[create-order] Razorpay credentials missing — set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Azure App Settings')
      return NextResponse.json(
        { success: false, error: 'Razorpay credentials missing. Please configure server environment.' },
        { status: 500 }
      )
    }

    const recent = await listRecentDonations(25)
    const duplicate = recent.find(item => matchesDuplicate(item, body))
    if (duplicate?.gatewayOrderId) {
      return NextResponse.json({
        success: true,
        donationId: duplicate.id,
        orderId: duplicate.gatewayOrderId,
        amount: duplicate.amount * 100,
        currency: 'INR',
        key: getRazorpayPublicKey(),
        duplicate: true,
      })
    }

    const donation = await createDonationRecord({
      name: body.name,
      contact: body.contact,
      amount: body.amount,
      purpose: body.purpose,
    })

    const order = await createRazorpayOrder(donation.amount, donation.receiptId, {
      name: donation.donorName,
      contact: donation.contact,
      purpose: donation.purpose,
    })
    console.log('[create-order] Razorpay order created', { orderId: order.id, amount: order.amount })

    await updateDonationRecord(donation.id, {
      status: 'processing',
      gatewayOrderId: order.id,
    })

    return NextResponse.json({
      success: true,
      donationId: donation.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: getRazorpayPublicKey(),
    })
  } catch (error) {
    if (error instanceof DonationValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    console.error('payment:create-order failed', error)
    return NextResponse.json(
      { success: false, error: 'Unable to initialize payment at the moment.' },
      { status: 500 }
    )
  }
}
