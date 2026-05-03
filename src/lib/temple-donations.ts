import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { sanitizeText } from '@/src/lib/sanitize'
import Razorpay from 'razorpay'

export type DonationStatus = 'created' | 'processing' | 'success' | 'failed' | 'cancelled' | 'abandoned'
export type DonationGateway = 'razorpay'

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
  receiptId: string
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
  amount: number
  currency: 'INR'
}

const DEFAULT_PURPOSE = 'General Donation'

export class DonationValidationError extends Error {}

const DUPLICATE_PAYMENT_STATES = new Set<DonationStatus>(['success', 'processing'])

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
  try {
    const storePath = await ensureStoreFile()
    const raw = await readFile(storePath, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as DonationRecord[]) : []
  } catch (error) {
    console.error('temple-donations: read failed, using empty history', error)
    return []
  }
}

async function writeRecords(records: DonationRecord[]): Promise<void> {
  try {
    const storePath = await ensureStoreFile()
    await writeFile(storePath, JSON.stringify(records, null, 2), 'utf8')
  } catch (error) {
    console.error('temple-donations: write failed', error)
  }
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

export function getRazorpayPublicKey(): string | null {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || null
}

export function isDuplicatePaymentAttempt(record: DonationRecord | null): boolean {
  if (!record) return false
  return DUPLICATE_PAYMENT_STATES.has(record.status)
}

export async function createDonationRecord(input: CreateDonationInput): Promise<DonationRecord> {
  const payload = validateCreateDonationInput(input)
  const now = new Date().toISOString()
  const receiptId = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`

  const record: DonationRecord = {
    id: randomUUID(),
    donorName: payload.name,
    contact: payload.contact,
    purpose: payload.purpose || DEFAULT_PURPOSE,
    amount: payload.amount,
    currency: 'INR',
    gateway: 'razorpay',
    receiptId,
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

export async function getDonationByOrderId(orderId: string): Promise<DonationRecord | null> {
  const records = await readRecords()
  return records.find(r => r.gatewayOrderId === orderId) ?? null
}

export async function listRecentDonations(limit = 8): Promise<DonationRecord[]> {
  const records = await readRecords()
  return records.slice(0, limit)
}

export async function createRazorpayOrder(
  amount: number,
  receipt: string,
  notes?: { name?: string; contact?: string; purpose?: string }
): Promise<RazorpayOrderResponse> {
  const credentials = getRazorpayCredentials()
  if (!credentials) {
    throw new Error('Razorpay credentials are not configured on server.')
  }

  const razorpay = new Razorpay({
    key_id: credentials.keyId,
    key_secret: credentials.keySecret,
  })

  const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt,
      notes,
  })

  return {
    id: order.id,
    amount: Number(order.amount),
    currency: 'INR',
  }
}

export function normalizeVerifyInput(input: {
  orderId?: string
  paymentId?: string
  signature?: string
}): { orderId: string; paymentId: string; signature: string } {
  const orderId = sanitizeText(String(input.orderId || ''))
  const paymentId = sanitizeText(String(input.paymentId || ''))
  const signature = sanitizeText(String(input.signature || ''))

  if (!orderId || !paymentId || !signature) {
    throw new DonationValidationError('Missing payment verification fields.')
  }

  return { orderId, paymentId, signature }
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
