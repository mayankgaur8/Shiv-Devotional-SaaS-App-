'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" className="dark">
      <body className="sacred-bg min-h-screen bg-black text-white">
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-saffron-400">ShivMandir</p>
          <h1 className="mt-4 text-3xl font-bold text-bhasma-100">Something went wrong loading content</h1>
          <p className="mt-3 text-sm leading-relaxed text-bhasma-400">
            {error.message || 'Please retry in a moment. The page failed safely instead of crashing the app.'}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}