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
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-on-surface font-headline tracking-tight">Dashboard</h1>
            <p className="text-on-surface-variant font-medium mt-1">{currentPlan.name} Plan — Resets on {data.reset_date}</p>
          </div>
          <button className="bg-brand-primary text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-brand-primary/20">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
            New Campaign
          </button>
        </section>

        {isEnabled('UI_REDESIGN') && (
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            {/* Section 1: Onboarding Checklist */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg font-headline">Get Started</h3>
                  <p className="text-sm text-on-surface-variant">2 of 3 complete</p>
                </div>
              </div>
              <div className="w-1/3">
                <div className="flex justify-between items-end mb-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                  <span>Progress</span>
                  <span>66%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-secondary w-[66%] rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="material-symbols-outlined text-brand-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm font-medium text-slate-700">1. Generate your first product</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="material-symbols-outlined text-brand-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm font-medium text-slate-700">2. Copy your embed code</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-dashed border-brand-primary/30">
                <span className="material-symbols-outlined text-brand-primary/40">circle</span>
                <span className="text-sm font-bold text-brand-primary">3. Install on your store</span>
              </div>
            </div>
          </section>
        )}

        {/* Section 2: Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Usage Ring */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl"></div>
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle className="text-slate-100" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-brand-primary" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset={251.2 - ((data.generations_used / (data.generations_limit || 2000)) * 251.2)} strokeLinecap="round" strokeWidth="8"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-on-surface">{Math.round((data.generations_used / (data.generations_limit || 2000)) * 100)}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Usage</span>
              </div>
            </div>
            <h4 className="text-sm font-bold text-on-surface-variant">Quota Overview</h4>
          </div>

          {/* Generations Used */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-secondary-container rounded-lg text-brand-secondary">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <span className="text-[10px] font-bold bg-brand-secondary/10 text-brand-secondary px-2 py-0.5 rounded-full">+12% vs LY</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-on-surface-variant">Generations Used</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-black text-on-surface">{data.generations_used.toLocaleString()}</h3>
                <span className="text-slate-400 font-bold text-sm">/ {data.generations_limit ? data.generations_limit.toLocaleString() : 'Unlimited'}</span>
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full">
              <div className="h-full bg-brand-secondary rounded-full" style={{ width: `${Math.min(100, (data.generations_used / (data.generations_limit || 2000)) * 100)}%` }}></div>
            </div>
          </div>

          {/* API Key */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="material-symbols-outlined text-slate-200 text-5xl opacity-30 select-none">key</span>
            </div>
            <p className="text-sm font-medium text-on-surface-variant mb-4">Active API Key</p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-[11px] text-slate-600 break-all mb-4">
              {data.api_key_public || 'Not generated'}
            </div>
            <button className="w-full py-2 bg-surface-container-low text-brand-primary font-bold text-xs rounded-lg hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">content_copy</span>
              Copy Key
            </button>
          </div>

          {/* Current Plan */}
          <div className="bg-brand-primary p-6 rounded-xl border border-primary-container shadow-xl shadow-brand-primary/20 relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Active Plan</span>
                <h3 className="text-3xl font-black text-white mt-1">{currentPlan.name}</h3>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs font-medium text-white/80">Monthly Spend</span>
                  <span className="text-sm font-bold text-white">${data.cost_usd.toFixed(2)}</span>
                </div>
                <div className="h-1.5 w-full bg-white/20 rounded-full">
                  <div className="h-full bg-secondary-fixed-dim w-[60%] rounded-full shadow-[0_0_8px_rgba(38,254,220,0.5)]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Quick Action Cards (Bento Style) */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-headline text-on-surface">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/dashboard/generate" className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-brand-primary transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 block">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-brand-primary mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">auto_awesome</span>
              </div>
              <h3 className="font-bold text-on-surface text-lg mb-2">AI Generator</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">Instantly generate high-converting copy and visual assets for your products.</p>
            </Link>

            <Link href="/dashboard/embed" className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-brand-secondary transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 block">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-brand-secondary mb-4 group-hover:bg-brand-secondary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">widgets</span>
              </div>
              <h3 className="font-bold text-on-surface text-lg mb-2">Embed Widget</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">Customize and deploy the Rawaj AI assistant directly onto your storefront.</p>
            </Link>

            <Link href="/dashboard/api-keys" className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-400 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 block">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mb-4 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">api</span>
              </div>
              <h3 className="font-bold text-on-surface text-lg mb-2">API Keys</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">Manage authentication tokens for programmatic access to our inference engine.</p>
            </Link>

            {nextPlan ? (
              <Link href={`/dashboard/upgrade?plan=${nextPlan.id}`} className="group relative bg-white p-6 rounded-xl border border-brand-primary/20 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 overflow-hidden block">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
                  {/* Decorative background image ignored for code simplicity, keeping standard bg */}
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary mb-4 group-hover:bg-tertiary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                  </div>
                  <h3 className="font-bold text-on-surface text-lg mb-2">Upgrade to {nextPlan.name}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Unlock unlimited generations, SSO, and dedicated account management. {formatPrice(nextPlan.priceUSD, "QAR")}</p>
                </div>
              </Link>
            ) : (
              <div className="group relative bg-white p-6 rounded-xl border border-brand-primary/20 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 overflow-hidden block">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary mb-4 group-hover:bg-tertiary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                  </div>
                  <h3 className="font-bold text-on-surface text-lg mb-2">Enterprise Plan Active</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Enjoy unlimited generations, SSO, and dedicated account management.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Bottom Section: Recent Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold font-headline">Recent Generations</h3>
              <button className="text-sm font-bold text-brand-primary hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-50">
              <div className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 rounded bg-slate-100 flex-shrink-0 overflow-hidden">
                   <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNCJ4nZCfHzkFgl2cBmUyUm6vTxUl0wZhRYMHHJSqgKe8_oeoHwe6jL72H9uzxpi85M8TJ_J9-ggys17VVJTUC4sctQuOSqjXQh9c1lMCBKbhcU_nt7SZl1jwGA0l5QtyWuFDYf_DX58WdhJNi8-eYG9J7YaKwaoH2TxumaRQLEOpkFJU65grF6Ch6v53itVkYccFsWyD1zJU31bCqgeHAd2K4tYp05ruw3JFF62N6qvMcKPjrsPmxLfUH0390ixvw5MRZU_P-HH3R" alt="" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold">Luxury Watch Landing Page</h4>
                  <p className="text-xs text-on-surface-variant">204 words generated • 4 images</p>
                </div>
                <span className="text-xs font-bold text-slate-400">2m ago</span>
              </div>
              <div className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 rounded bg-slate-100 flex-shrink-0 overflow-hidden">
                   <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy2422JEM6atWgF7RD8FZUDUpnpo9KgFJCYGu8ypkDTZE8XZV98HfLIsV9gjQ9pkIpVUNpquf-xiG3ZonjTEOAY7LGApwAQsHrpm62JyX_ZCzC-yESkDOiae05Yq9STV5eeHeGfb3npvSN5nu3ov5OpFfTA1f9tXf_pSAqekLOXKZQ2eZhATEPcLfnZKufgAbgNCZcgDW6utDmstekpbpSbm_Vm8HHgtRGk2SJw3R47W8MoLMeLRFVc3VJISfxj7K9d3ACNFKUGJFl" alt=""/>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold">Audio Pro Headphones Ad Copy</h4>
                  <p className="text-xs text-on-surface-variant">156 words generated • 2 images</p>
                </div>
                <span className="text-xs font-bold text-slate-400">45m ago</span>
              </div>
              <div className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 rounded bg-slate-100 flex-shrink-0 overflow-hidden">
                   <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJVFb0KMZD0OsgxDotlrf_9tDkPfsGlhuiyxjXGZlmKxgW7m7W38LOtKV4xLqZSz0Z9LzPXozYNvp_6vMLoU_oIwVVkUSAVfztkLWjE5E1D-czKnS6XyxW2QUgqN3O444pBigoHHvkSOocvmahAvK24Z62oUIE6CXr5HgjhBRG9xz4M_3R400DmbCtBwv7S8QmXP7JiAWa2XIxRXHQjLZxFd2x9RysSM9ZnsUys3KbKGFHi2Ws0WZIkv0KGd4VhpD8BBiI1yjp8nLo" alt=""/>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold">Velocity Sports Shoes Campaign</h4>
                  <p className="text-xs text-on-surface-variant">512 words generated • 8 images</p>
                </div>
                <span className="text-xs font-bold text-slate-400">3h ago</span>
              </div>
            </div>
          </div>
          <div className="bg-indigo-900 text-white rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black font-headline mb-4">Pro Insight</h3>
              <p className="text-indigo-200 text-sm leading-relaxed mb-6">Your API usage has increased by 40% this week. Consider setting up usage alerts to avoid unexpected billing spikes.</p>
            </div>
            <a className="relative z-10 flex items-center gap-2 text-brand-secondary font-bold text-sm group/btn" href="#">
              Learn more about alerts
              <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
            </a>
          </div>
        </section>
      </div>
    </>
  )
}
