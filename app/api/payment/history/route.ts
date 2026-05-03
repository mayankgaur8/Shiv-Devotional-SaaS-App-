import { NextResponse } from 'next/server'
import { listRecentDonations } from '@/src/lib/temple-donations'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const donations = await listRecentDonations(50)
    return NextResponse.json({ success: true, donations })
  } catch (error) {
    console.error('payment:history failed', error)
    return NextResponse.json({ success: false, donations: [] }, { status: 500 })
  }
}
