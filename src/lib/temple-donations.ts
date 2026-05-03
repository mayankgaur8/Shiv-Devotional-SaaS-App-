import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { sanitizeText } from '@/src/lib/sanitize'

export type DonationStatus = 'created' | 'processing' | 'success' | 'failed' | 'cancelled'
export type DonationGateway = 'razorpay' | 'mock'

export interface DonationRecord {
  id: string
  donorName: string
  contact?: string
  purpose: string
  amount: number
  currency: 'INR'
  gateway: DonationGateway
  gatewayOrderId?: string
  gatewayPaymentId?: string
  gatewaySignature?: string
  status: DonationStatus
  failureReason?: string
  createdAt: string
  updatedAt: string
}

interface CreateDonationInput {
  name: string
  contact?: string
  purpose?: string
  amount: number
}

interface RazorpayOrderResponse {
  id: string
}

const DEFAULT_PURPOSE = 'General Donation'

export class DonationValidationError extends Error {}

function getStorePath(): string {
  return process.env.TEMPLE_DONATION_DB_FILE || path.join(process.cwd(), 'src/data/temple-donations.json')
}

async function ensureStoreFile(): Promise<string> {
  const storePath = getStorePath()
  await mkdir(path.dirname(storePath), { recursive: true })
  try {
    await readFile(storePath, 'utf8')
  } catch {
    await writeFile(storePath, '[]', 'utf8')
  }
  return storePath
}

async function readRecords(): Promise<DonationRecord[]> {
  const storePath = await ensureStoreFile()
  const raw = await readFile(storePath, 'utf8')
  return JSON.parse(raw) as DonationRecord[]
}

async function writeRecords(records: DonationRecord[]): Promise<void> {
  const storePath = await ensureStoreFile()
  await writeFile(storePath, JSON.stringify(records, null, 2), 'utf8')
}

export function validateCreateDonationInput(input: CreateDonationInput): CreateDonationInput {
  const name = sanitizeText(String(input.name || ''))
  const contact = sanitizeText(String(input.contact || ''))
  const purpose = sanitizeText(String(input.purpose || DEFAULT_PURPOSE))
  const amount = Number(input.amount)

  if (name.length < 2) {
    throw new DonationValidationError('Name must be at least 2 characters.')
  }

  if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount < 10) {
    throw new DonationValidationError('Amount must be an integer of at least Rs 10.')
  }

  if (contact && !/^([0-9]{10}|[^\s@]+@[^\s@]+\.[^\s@]+)$/.test(contact)) {
    throw new DonationValidationError('Contact must be a valid 10-digit mobile number or email.')
  }

  if (purpose.length < 3 || purpose.length > 120) {
    throw new DonationValidationError('Purpose must be between 3 and 120 characters.')
  }

  return {
    name,
    contact: contact || undefined,
    purpose,
    amount,
  }
}

export function getRazorpayCredentials(): { keyId: string; keySecret: string } | null {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    return null
  }

  return { keyId, keySecret }
}

export async function createDonationRecord(input: CreateDonationInput): Promise<DonationRecord> {
  const payload = validateCreateDonationInput(input)
  const now = new Date().toISOString()

  const record: DonationRecord = {
    id: randomUUID(),
    donorName: payload.name,
    contact: payload.contact,
    purpose: payload.purpose || DEFAULT_PURPOSE,
    amount: payload.amount,
    currency: 'INR',
    gateway: getRazorpayCredentials() ? 'razorpay' : 'mock',
    status: 'created',
    createdAt: now,
    updatedAt: now,
  }

  const records = await readRecords()
  records.unshift(record)
  await writeRecords(records)

  return record
}

export async function updateDonationRecord(
  donationId: string,
  patch: Partial<Omit<DonationRecord, 'id' | 'createdAt'>>
): Promise<DonationRecord | null> {
  const records = await readRecords()
  const index = records.findIndex(r => r.id === donationId)

  if (index < 0) {
    return null
  }

  const updated: DonationRecord = {
    ...records[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  }

  records[index] = updated
  await writeRecords(records)

  return updated
}

export async function getDonationById(donationId: string): Promise<DonationRecord | null> {
  const records = await readRecords()
  return records.find(r => r.id === donationId) ?? null
}

export async function listRecentDonations(limit = 8): Promise<DonationRecord[]> {
  const records = await readRecords()
  return records.slice(0, limit)
}

export async function createRazorpayOrder(amount: number, receipt: string): Promise<RazorpayOrderResponse | null> {
  const credentials = getRazorpayCredentials()
  if (!credentials) {
    return null
  }

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${credentials.keyId}:${credentials.keySecret}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amount * 100,
      currency: 'INR',
      receipt,
      payment_capture: 1,
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to create Razorpay order.')
  }

  return (await response.json()) as RazorpayOrderResponse
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  const credentials = getRazorpayCredentials()
  if (!credentials) {
    return false
  }

  const digest = createHmac('sha256', credentials.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  if (digest.length !== signature.length) {
    return false
  }

  return timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
}
