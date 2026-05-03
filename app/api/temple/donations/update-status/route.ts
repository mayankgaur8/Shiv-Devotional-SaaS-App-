import { NextResponse } from 'next/server'
import { updateDonationRecord } from '@/src/lib/temple-donations'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      transactionId: string
      status: 'failed' | 'cancelled'
      reason?: string
    }

    if (!body.transactionId || !body.status) {
      return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 })
    }

    const donation = await updateDonationRecord(body.transactionId, {
      status: body.status,
      failureReason: body.reason,
    })

    if (!donation) {
      return NextResponse.json({ ok: false, error: 'Transaction not found.' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, donation })
  } catch (error) {
    console.error('Update donation status failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Unable to update donation status right now.' },
      { status: 500 }
    )
  }
}
