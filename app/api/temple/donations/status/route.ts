import { NextResponse } from 'next/server'
import { listRecentDonations } from '@/src/lib/temple-donations'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const donations = await listRecentDonations(10)
    return NextResponse.json({ ok: true, donations })
  } catch (error) {
    console.error('Fetch donation status failed:', error)
    return NextResponse.json({ ok: false, donations: [] }, { status: 500 })
  }
}
