import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UpgradePageClient } from '@/components/dashboard/UpgradePageClient'

async function fetchCurrentPlan(token: string): Promise<string> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/usage/`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (res.ok) {
      const data = await res.json()
      return data.plan || 'free'
    }
  } catch {}
  return 'free'
}

export default async function UpgradePage() {
  const { getToken } = auth()
  const token = await getToken()
  if (!token) redirect('/')

  const currentPlan = await fetchCurrentPlan(token)

  return <UpgradePageClient currentPlan={currentPlan} />
}
