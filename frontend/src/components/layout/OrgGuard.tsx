'use client'

import { useOrganization, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function OrgGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, organization } = useOrganization()
  const { isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn && !organization) {
      router.replace('/org-setup')
    }
  }, [isLoaded, isSignedIn, organization, router])

  // Still loading — render nothing to avoid flash
  if (!isLoaded) return null

  // Signed in with no org — redirect is in flight
  if (isSignedIn && !organization) return null

  return <>{children}</>
}
