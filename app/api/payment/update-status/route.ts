import { NextResponse } from 'next/server'
import { getDonationByOrderId, updateDonationRecord } from '@/src/lib/temple-donations'

export const runtime = 'nodejs'

interface UpdateStatusBody {
  donationId?: string
  orderId?: string
  status: 'failed' | 'cancelled' | 'abandoned'
  reason?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as UpdateStatusBody

    if (!body.status) {
      return NextResponse.json({ success: false, error: 'Missing status.' }, { status: 400 })
    }

    const donationId = body.donationId || (body.orderId ? (await getDonationByOrderId(body.orderId))?.id : null)

    if (!donationId) {
      return NextResponse.json({ success: false, error: 'Donation not found.' }, { status: 404 })
    }

    const updated = await updateDonationRecord(donationId, {
      status: body.status,
      failureReason: body.reason,
    })

    return NextResponse.json({ success: true, donation: updated })
  } catch (error) {
    console.error('payment:update-status failed', error)
    return NextResponse.json({ success: false, error: 'Could not update payment status.' }, { status: 500 })
  }
}
