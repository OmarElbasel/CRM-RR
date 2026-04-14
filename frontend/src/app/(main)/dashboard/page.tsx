import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UsageRing } from '@/components/dashboard/UsageRing'
import { getPlan, getNextPlan, type PlanId } from '@/lib/plans'
import { formatPrice } from '@/lib/currency'
import { isEnabled } from '@/lib/flags'
import { PageHeader } from '@/components/ui/PageHeader'
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist'
import { Sparkles, Key, Code2 } from 'lucide-react'
import Link from 'next/link'

interface UsageData {
  plan: string
  generations_used: number
  generations_limit: number | null
  tokens_in: number
  tokens_out: number
  cost_usd: number
  cost_qar: number
  cost_sar: number
  api_key_public: string
  reset_date: string
}

const DUMMY_USAGE: UsageData = {
  plan: 'pro',
  generations_used: 847,
  generations_limit: 2000,
  tokens_in: 412300,
  tokens_out: 198700,
  cost_usd: 12.45,
  cost_qar: 45.32,
  cost_sar: 46.69,
  api_key_public: 'pk_live_demo_xxxxxxxxxxxx',
  reset_date: 'May 1, 2026',
}

async function fetchUsage(token: string): Promise<UsageData | null> {
  if (process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true') return DUMMY_USAGE
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/usage/`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function DashboardPage() {
  if (!isEnabled('BILLING')) {
    return (
      <main className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-4 text-gray-500">Billing features are coming soon.</p>
        <p className="text-gray-400 text-sm mt-1">قريباً — ميزات الفوترة</p>
      </main>
    )
  }

  const { getToken } = auth()
  const token = await getToken()
  if (!token) redirect('/')

  const data = await fetchUsage(token)
  if (!data) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <p className="text-red-500">Failed to load usage data. Please try again.</p>
      </>
    )
  }

  const currentPlan = getPlan(data.plan as PlanId)
  const nextPlan = getNextPlan(data.plan as PlanId)

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={`${currentPlan.name} Plan — Resets on ${data.reset_date}`}
      />

      {/* Onboarding checklist (only when UI_REDESIGN is enabled) */}
      {isEnabled('UI_REDESIGN') && <OnboardingChecklist />}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Usage ring card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col items-center justify-center sm:col-span-2 lg:col-span-1">
          <UsageRing used={data.generations_used} limit={data.generations_limit} size={100} />
        </div>

        {/* Generations card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-sm text-gray-500">Generations Used</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {data.generations_used.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {data.generations_limit ? `of ${data.generations_limit.toLocaleString()} limit` : 'Unlimited'}
          </div>
        </div>

        {/* API Key card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Key className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-sm text-gray-500">API Key</div>
          </div>
          <div className="text-sm font-mono text-gray-900 truncate">
            {data.api_key_public || 'Not generated'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {data.api_key_public ? 'Active' : 'Rotate to generate'}
          </div>
        </div>

        {/* Cost card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-sm text-gray-500">Current Plan</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {currentPlan.name}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            ${data.cost_usd.toFixed(2)} spent this month
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/dashboard/generate"
          className="block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="font-medium text-gray-900">AI Generator</div>
          <div className="text-sm text-gray-500 mt-1">Generate product descriptions</div>
        </Link>

        <Link
          href="/dashboard/embed"
          className="block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-3">
            <Code2 className="w-5 h-5 text-green-600" />
          </div>
          <div className="font-medium text-gray-900">Embed Widget</div>
          <div className="text-sm text-gray-500 mt-1">Install on your store</div>
        </Link>

        <Link
          href="/dashboard/api-keys"
          className="block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
            <Key className="w-5 h-5 text-amber-600" />
          </div>
          <div className="font-medium text-gray-900">API Keys</div>
          <div className="text-sm text-gray-500 mt-1">Manage your keys · {data.api_key_public || 'None'}</div>
        </Link>

        {nextPlan && (
          <Link
            href={`/dashboard/upgrade?plan=${nextPlan.id}`}
            className="block p-6 bg-indigo-50 border border-indigo-200 rounded-xl shadow-sm hover:bg-indigo-100 transition-all"
          >
            <div className="font-medium text-indigo-900">
              Upgrade to {nextPlan.name}
            </div>
            <div className="text-sm text-indigo-600 mt-1">
              {formatPrice(nextPlan.priceUSD, 'QAR')}
            </div>
          </Link>
        )}
      </div>
    </>
  )
}
