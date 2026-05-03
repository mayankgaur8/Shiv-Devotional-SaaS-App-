import { describe, expect, it } from 'vitest'
import { DonationValidationError, validateCreateDonationInput } from '@/src/lib/temple-donations'

describe('temple donation validation', () => {
  it('accepts valid donation payload', () => {
    const payload = validateCreateDonationInput({
      name: 'Mahadev Bhakt',
      contact: '9876543210',
      amount: 501,
      purpose: 'Rudra Abhishek',
    })

    expect(payload.name).toBe('Mahadev Bhakt')
    expect(payload.contact).toBe('9876543210')
    expect(payload.amount).toBe(501)
  })

  it('rejects too-small amount', () => {
    expect(() =>
      validateCreateDonationInput({
        name: 'Bhakt',
        amount: 5,
      })
    ).toThrow(DonationValidationError)
  })

  it('rejects invalid contact format', () => {
    expect(() =>
      validateCreateDonationInput({
        name: 'Bhakt',
        amount: 101,
        contact: 'invalid-contact',
      })
    ).toThrow('Contact must be a valid 10-digit mobile number or email.')
  })
})
