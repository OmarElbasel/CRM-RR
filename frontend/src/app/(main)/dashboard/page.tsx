import type { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { DashboardContent } from '@/components/dashboard/DashboardContent'
import { DEMO_MODE } from '@/lib/demo'
import { getPlan, getNextPlan, type PlanId } from '@/lib/plans'
import { isEnabled } from '@/lib/flags'

export const metadata: Metadata = {
  title: 'Dashboard — Rawaj',
  description: 'Overview of your workspace, usage, and quick actions.',
}

interface UsageData {
  plan: string
  generations_used: number
  generations_limit: number | null
  tokens_in: number
  tokens_out: number
  cost_usd: number
  api_key_public: string
  reset_date: string
}

const EMPTY_USAGE: UsageData = {
  plan: 'free',
  generations_used: 0,
  generations_limit: 20,
  tokens_in: 0,
  tokens_out: 0,
  cost_usd: 0,
  api_key_public: '',
  reset_date: '-',
}

async function fetchUsage(token: string): Promise<{ data: UsageData; ok: boolean }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/usage/`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return { data: EMPTY_USAGE, ok: false }
    const json = await res.json()
    return { data: json, ok: true }
  } catch {
    return { data: EMPTY_USAGE, ok: false }
  }
}

export default async function DashboardPage() {
  if (!isEnabled('BILLING')) {
    return (
      <main className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-ds-text">Dashboard</h1>
        <p className="mt-4 text-ds-text-2">Billing features are coming soon.</p>
        <p className="text-ds-text-3 text-sm mt-1">&#x642;&#x631;&#x64A;&#x628;&#x627;&#x64B; &#x2014; &#x645;&#x64A;&#x632;&#x627;&#x62A; &#x627;&#x644;&#x641;&#x648;&#x62A;&#x64A;&#x631;&#x629;</p>
      </main>
    )
  }

  let data: UsageData = EMPTY_USAGE
  let ok = true
  if (DEMO_MODE) {
    data = {
      ...EMPTY_USAGE,
      plan: 'pro',
      generations_used: 142,
      generations_limit: 500,
      tokens_in: 84_210,
      tokens_out: 56_180,
      cost_usd: 12.4,
      api_key_public: 'pk_demo_portfolio_xxxxxxxxxxxx',
      reset_date: 'May 28, 2026',
    }
  } else {
    const { getToken } = auth()
    const token = await getToken()
    if (!token) redirect('/')
    const fetched = await fetchUsage(token)
    data = fetched.data
    ok = fetched.ok
  }

  const currentPlan = getPlan(data.plan as PlanId)
  const nextPlan = getNextPlan(data.plan as PlanId)

  return (
    <DashboardContent
      data={data}
      ok={ok}
      currentPlan={currentPlan}
      nextPlan={nextPlan}
    />
  )
}
