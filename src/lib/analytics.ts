import { runWhenIdle } from '@/src/lib/idle'

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
    gtag?: (...args: unknown[]) => void
    __MEDIA_ERRORS__?: Array<Record<string, unknown>>
    Sentry?: { captureMessage?: (message: string, context?: unknown) => void }
    LogRocket?: { track?: (event: string, payload?: unknown) => void }
  }
}

interface MediaInsights {
  playCounts: Record<string, number>
  totalListenMs: number
  listenEvents: number
  dropOffPoints: number[]
  playlistHits: Record<string, number>
}

const INSIGHTS_KEY = 'shiv-analytics-insights'

function readInsights(): MediaInsights {
  if (typeof window === 'undefined') {
    return { playCounts: {}, totalListenMs: 0, listenEvents: 0, dropOffPoints: [], playlistHits: {} }
  }
  try {
    const raw = window.localStorage.getItem(INSIGHTS_KEY)
    if (!raw) return { playCounts: {}, totalListenMs: 0, listenEvents: 0, dropOffPoints: [], playlistHits: {} }
    return JSON.parse(raw) as MediaInsights
  } catch {
    return { playCounts: {}, totalListenMs: 0, listenEvents: 0, dropOffPoints: [], playlistHits: {} }
  }
}

function writeInsights(insights: MediaInsights): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(INSIGHTS_KEY, JSON.stringify(insights))
  } catch {
    // Ignore storage failures.
  }
}

function updateInsights(event: AnalyticsEventName, payload: AnalyticsPayload): void {
  const insights = readInsights()

  if (event === 'media_play' && typeof payload.media_id === 'string') {
    insights.playCounts[payload.media_id] = (insights.playCounts[payload.media_id] || 0) + 1
  }

  if (event === 'media_pause' && typeof payload.listen_ms === 'number') {
    insights.totalListenMs += payload.listen_ms
    insights.listenEvents += 1
    if (typeof payload.drop_off_second === 'number') {
      insights.dropOffPoints.push(payload.drop_off_second)
      if (insights.dropOffPoints.length > 200) insights.dropOffPoints.shift()
    }
  }

  if (event === 'playlist_selected' && typeof payload.playlist_id === 'string') {
    insights.playlistHits[payload.playlist_id] = (insights.playlistHits[payload.playlist_id] || 0) + 1
  }

  writeInsights(insights)
}

export function trackEvent(event: AnalyticsEventName, payload: AnalyticsPayload = {}): void {
  if (typeof window === 'undefined') return

  const entry: Record<string, unknown> = {
    event,
    timestamp: Date.now(),
    ...payload,
  }

  runWhenIdle(() => {
    updateInsights(event, payload)

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(entry)
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', event, payload)
    }

    if (window.LogRocket?.track) {
      window.LogRocket.track(event, payload)
    }

    if (window.Sentry?.captureMessage && event === 'media_complete') {
      window.Sentry.captureMessage('media_complete', { extra: payload })
    }

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      try {
        const blob = new Blob([JSON.stringify(entry)], { type: 'application/json' })
        navigator.sendBeacon('/api/analytics', blob)
      } catch {
        // Ignore endpoint errors.
      }
    }
  })

  window.dispatchEvent(new CustomEvent('shivmandir-analytics', { detail: entry }))
}
