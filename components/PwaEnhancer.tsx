'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export default function PwaEnhancer() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

      if (isLocalhost) {
        navigator.serviceWorker.getRegistrations()
          .then((registrations) => Promise.all(registrations.map((reg) => reg.unregister())))
          .catch(() => {
            // Ignore cleanup failures in dev.
          })
      } else {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Ignore registration failures in unsupported contexts.
        })
      }
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  if (!showInstall || !installEvent) return null

  return (
    <button
      type="button"
      onClick={async () => {
        await installEvent.prompt()
        await installEvent.userChoice
        setShowInstall(false)
      }}
      className="fixed bottom-20 right-4 z-50 px-3 py-2 rounded-lg text-xs font-medium bg-saffron-500/90 text-white border border-saffron-400/60 shadow-xl"
      aria-label="Install ShivMandir app"
    >
      Install ShivMandir App
    </button>
  )
}
