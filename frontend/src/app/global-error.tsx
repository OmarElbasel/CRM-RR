'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body className="min-h-screen flex flex-col items-center justify-center bg-paper px-6">
        <h1 className="text-3xl font-extrabold text-ds-text tracking-tight font-headline">
          Something went wrong
        </h1>
        <p className="mt-2 text-ds-text-2 max-w-sm text-center">
          We apologize for the inconvenience.
        </p>
        <button
          onClick={() => reset()}
          className="mt-6 px-4 py-2.5 rounded-lg bg-ds-primary text-white text-sm font-semibold hover:bg-ds-primary/90 transition-colors"
        >
          Try again
        </button>
      </body>
    </html>
  )
}
