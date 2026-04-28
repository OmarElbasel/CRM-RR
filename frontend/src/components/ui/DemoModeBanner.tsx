'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export function DemoModeBanner() {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('demo-banner-dismissed') === 'true'
    setDismissed(isDismissed)
  }, [])

  if (dismissed || process.env.NEXT_PUBLIC_USE_DUMMY_DATA !== 'true') {
    return null
  }

  return (
    <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center justify-between">
      <p className="text-sm text-amber-800">
        Demo data — connect a channel to see real metrics
      </p>
      <button
        onClick={() => {
          sessionStorage.setItem('demo-banner-dismissed', 'true')
          setDismissed(true)
        }}
        className="p-1 hover:bg-amber-100 rounded-md transition-colors"
        aria-label="Dismiss demo banner"
      >
        <X className="w-4 h-4 text-amber-700" />
      </button>
    </div>
  )
}
