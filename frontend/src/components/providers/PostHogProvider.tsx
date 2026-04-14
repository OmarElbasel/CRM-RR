'use client'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com',
      capture_pageview: false,
    })
  }, [])

  const pathname = usePathname()
  useEffect(() => {
    posthog.capture('$pageview')
  }, [pathname])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
