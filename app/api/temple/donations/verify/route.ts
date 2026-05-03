import { NextResponse } from 'next/server'
import {
  getDonationById,
  getDonationByOrderId,
  normalizeVerifyInput,
  updateDonationRecord,
  verifyRazorpaySignature,
} from '@/src/lib/temple-donations'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      transactionId: string
      orderId?: string
      paymentId?: string
      signature?: string
    }

    if (!body.transactionId && !body.orderId) {
      return NextResponse.json({ ok: false, error: 'Missing transaction id.' }, { status: 400 })
    }

    const verified = normalizeVerifyInput({ orderId: body.orderId, paymentId: body.paymentId, signature: body.signature })
    const donation = body.transactionId ? await getDonationById(body.transactionId) : await getDonationByOrderId(verified.orderId)

    if (!donation) {
      return NextResponse.json({ ok: false, error: 'Transaction not found.' }, { status: 404 })
    }

    if (donation.status === 'success' && donation.gatewayPaymentId === verified.paymentId) {
      return NextResponse.json({ ok: true, duplicate: true, donation })
    }

    const isValid = verifyRazorpaySignature(verified.orderId, verified.paymentId, verified.signature)

    const record = await updateDonationRecord(donation.id, {
      status: isValid ? 'success' : 'failed',
      gatewayOrderId: verified.orderId,
      gatewayPaymentId: verified.paymentId,
      gatewaySignature: verified.signature,
      failureReason: isValid ? undefined : 'Invalid payment signature',
    })

    if (!isValid) {
      return NextResponse.json(
        { ok: false, error: 'Payment signature mismatch. Transaction marked failed.', donation: record },
        { status: 400 }
      )
    }

    return NextResponse.json({ ok: true, donation: record })
  } catch (error) {
    console.error('Verify donation failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Unable to verify payment right now. Please contact support.' },
      { status: 500 }
    )
  }
}
