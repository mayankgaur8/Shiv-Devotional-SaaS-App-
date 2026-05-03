'use client'

export default function TempleRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-bold text-bhasma-100">Temple page could not load</h2>
      <p className="mt-3 text-sm text-bhasma-400">
        {error.message || 'Please refresh the page or try again in a moment.'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Retry
      </button>
    </div>
  )
}
