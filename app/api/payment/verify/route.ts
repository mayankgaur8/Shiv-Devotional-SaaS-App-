import { NextResponse } from 'next/server'
import {
  DonationValidationError,
  getDonationById,
  getDonationByOrderId,
  normalizeVerifyInput,
  updateDonationRecord,
  verifyRazorpaySignature,
} from '@/src/lib/temple-donations'

export const runtime = 'nodejs'

interface VerifyBody {
  donationId?: string
  razorpay_order_id?: string
  razorpay_payment_id?: string
  razorpay_signature?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyBody
    const verified = normalizeVerifyInput({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    })

    const donation = body.donationId
      ? await getDonationById(body.donationId)
      : await getDonationByOrderId(verified.orderId)

    if (!donation) {
      return NextResponse.json({ success: false, error: 'Donation record not found.' }, { status: 404 })
    }

    if (donation.status === 'success' && donation.gatewayPaymentId === verified.paymentId) {
      return NextResponse.json({ success: true, duplicate: true, donation })
    }

    const isValid = verifyRazorpaySignature(verified.orderId, verified.paymentId, verified.signature)

    const updated = await updateDonationRecord(donation.id, {
      status: isValid ? 'success' : 'failed',
      gatewayOrderId: verified.orderId,
      gatewayPaymentId: verified.paymentId,
      gatewaySignature: verified.signature,
      failureReason: isValid ? undefined : 'Invalid payment signature',
    })

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Signature verification failed.', donation: updated },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, donation: updated })
  } catch (error) {
    if (error instanceof DonationValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    console.error('payment:verify failed', error)
    return NextResponse.json(
      { success: false, error: 'Payment verification failed due to a server error.' },
      { status: 500 }
    )
  }
}
