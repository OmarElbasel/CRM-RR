'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { ArrowLeft } from 'lucide-react'

function BrandMark() {
  return (
    <div className="w-10 h-10 rounded-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #C8FE5E, #594FBF)' }}>
      <div className="absolute inset-[3px] rounded-lg bg-ink" />
      <div className="absolute left-1/2 top-[3px] bottom-[3px] w-[2px] bg-[#C8FE5E] z-[1]" />
    </div>
  )
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { isSignedIn } = useAuth()

  useEffect(() => {
    // Sentry will be available once integrated
    // import * as Sentry from '@sentry/nextjs'
    // Sentry.captureException(error)
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper px-6">
      <BrandMark />
      <h1 className="mt-6 text-3xl font-extrabold text-ds-text tracking-tight font-headline">
        Something went wrong
      </h1>
      <p className="mt-2 text-ds-text-2 max-w-sm text-center">
        We apologize for the inconvenience. Our team has been notified.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="px-4 py-2.5 rounded-lg bg-ds-primary text-white text-sm font-semibold hover:bg-ds-primary/90 transition-colors"
        >
          Try again
        </button>
        <Link
          href={isSignedIn ? '/dashboard' : '/'}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-ds-line text-ds-text text-sm font-semibold hover:bg-paper-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {isSignedIn ? 'Dashboard' : 'Home'}
        </Link>
      </div>
    </div>
  )
}
