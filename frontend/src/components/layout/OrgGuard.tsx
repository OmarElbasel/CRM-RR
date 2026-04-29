'use client'

import { useOrganization, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DEMO_MODE } from '@/lib/demo'

export function OrgGuard({ children }: { children: React.ReactNode }) {
  if (DEMO_MODE) return <>{children}</>
  return <RealOrgGuard>{children}</RealOrgGuard>
}

function RealOrgGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, organization } = useOrganization()
  const { isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn && !organization) {
      router.replace('/org-setup')
    }
  }, [isLoaded, isSignedIn, organization, router])

  if (!isLoaded) return null
  if (isSignedIn && !organization) return null

  return <>{children}</>
}
