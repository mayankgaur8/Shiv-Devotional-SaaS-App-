import { NextResponse } from 'next/server'
import { updateDonationRecord, verifyRazorpaySignature } from '@/src/lib/temple-donations'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      transactionId: string
      orderId?: string
      paymentId?: string
      signature?: string
      mode: 'razorpay' | 'mock'
    }

    if (!body.transactionId) {
      return NextResponse.json({ ok: false, error: 'Missing transaction id.' }, { status: 400 })
    }

    if (body.mode === 'mock') {
      const record = await updateDonationRecord(body.transactionId, {
        status: 'success',
        gatewayPaymentId: body.paymentId || `mock_payment_${Date.now()}`,
      })

      if (!record) {
        return NextResponse.json({ ok: false, error: 'Transaction not found.' }, { status: 404 })
      }

      return NextResponse.json({ ok: true, donation: record })
    }

    if (!body.orderId || !body.paymentId || !body.signature) {
      return NextResponse.json(
        { ok: false, error: 'Missing required payment verification fields.' },
        { status: 400 }
      )
    }

    const isValid = verifyRazorpaySignature(body.orderId, body.paymentId, body.signature)

    const record = await updateDonationRecord(body.transactionId, {
      status: isValid ? 'success' : 'failed',
      gatewayOrderId: body.orderId,
      gatewayPaymentId: body.paymentId,
      gatewaySignature: body.signature,
      failureReason: isValid ? undefined : 'Invalid payment signature',
    })

    if (!record) {
      return NextResponse.json({ ok: false, error: 'Transaction not found.' }, { status: 404 })
    }

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
