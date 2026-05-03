import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('server-only', () => ({}))

class RazorpayMock {
	on() {}
	open() {}
}

if (typeof window !== 'undefined') {
	;(window as Window & { Razorpay?: typeof RazorpayMock }).Razorpay = RazorpayMock
}

if (typeof globalThis.fetch === 'undefined') {
	globalThis.fetch = vi.fn(async () => new Response('{}', { status: 200 })) as typeof fetch
}

if (typeof HTMLMediaElement !== 'undefined') {
	vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(async () => undefined)
	vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined)
}
