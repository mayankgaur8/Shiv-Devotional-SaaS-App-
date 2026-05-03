import { NextResponse } from 'next/server'
import {
  DonationValidationError,
  createDonationRecord,
  createRazorpayOrder,
  updateDonationRecord,
  getRazorpayPublicKey,
} from '@/src/lib/temple-donations'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name: string
      contact?: string
      amount: number
      purpose?: string
    }

    const donation = await createDonationRecord(body)
    const order = await createRazorpayOrder(donation.amount, donation.receiptId, {
      name: donation.donorName,
      contact: donation.contact,
      purpose: donation.purpose,
    })

    const updated = await updateDonationRecord(donation.id, {
      status: 'processing',
      gatewayOrderId: order.id,
    })

    return NextResponse.json({
      ok: true,
      paymentMode: 'razorpay',
      transactionId: donation.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayPublicKey(),
      donation: updated,
    })
  } catch (error) {
    if (error instanceof DonationValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
    }

    console.error('Create donation order failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Could not initialize donation. Please try again.' },
      { status: 500 }
    )
  }
}
