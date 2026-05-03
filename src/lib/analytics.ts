export type AnalyticsEventName =
  | 'media_play'
  | 'media_pause'
  | 'media_complete'
  | 'favorite_added'
  | 'playlist_selected'

export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

export function trackEvent(event: AnalyticsEventName, payload: AnalyticsPayload = {}): void {
  if (typeof window === 'undefined') return

  const entry = {
    event,
    timestamp: Date.now(),
    ...payload,
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(entry)
  }

  window.dispatchEvent(new CustomEvent('shivmandir-analytics', { detail: entry }))
}
