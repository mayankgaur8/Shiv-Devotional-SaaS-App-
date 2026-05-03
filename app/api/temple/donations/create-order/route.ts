import { NextResponse } from 'next/server'
import {
  DonationValidationError,
  createDonationRecord,
  createRazorpayOrder,
  updateDonationRecord,
  getRazorpayCredentials,
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
    const credentials = getRazorpayCredentials()

    if (credentials) {
      const order = await createRazorpayOrder(donation.amount, donation.id)

      if (!order) {
        throw new Error('Payment order creation failed.')
      }

      const updated = await updateDonationRecord(donation.id, {
        status: 'processing',
        gatewayOrderId: order.id,
      })

      return NextResponse.json({
        ok: true,
        paymentMode: 'razorpay',
        transactionId: donation.id,
        orderId: order.id,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || credentials.keyId,
        donation: updated,
      })
    }

    const updated = await updateDonationRecord(donation.id, {
      status: 'processing',
      gatewayOrderId: `mock_order_${donation.id}`,
    })

    return NextResponse.json({
      ok: true,
      paymentMode: 'mock',
      transactionId: donation.id,
      orderId: updated?.gatewayOrderId,
      donation: updated,
      message: 'Razorpay keys not configured. Running in mock mode.',
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
