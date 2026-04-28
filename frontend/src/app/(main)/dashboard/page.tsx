import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UsageRing } from '@/components/dashboard/UsageRing'
import { getPlan, getNextPlan, type PlanId } from '@/lib/plans'
import { formatPrice } from '@/lib/currency'
import { isEnabled } from '@/lib/flags'
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist'
import Link from 'next/link'
import { ArrowRight, Code, Copy, Key, LayoutGrid, Rocket, Share2, Sparkles } from 'lucide-react'

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

const EMPTY_USAGE: UsageData = {
  plan: 'free',
  generations_used: 0,
  generations_limit: 20,
  tokens_in: 0,
  tokens_out: 0,
  cost_usd: 0,
  cost_qar: 0,
  cost_sar: 0,
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

  const { getToken } = auth()
  const token = await getToken()
  if (!token) redirect('/')

  const { data, ok } = await fetchUsage(token)

  const currentPlan = getPlan(data.plan as PlanId)
  const nextPlan = getNextPlan(data.plan as PlanId)

  return (
    <>
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-ds-text font-headline tracking-tight">Dashboard</h1>
            <p className="text-ds-text-2 font-medium mt-1">
              {currentPlan.name} Plan
              {data.reset_date && data.reset_date !== '-' ? ` — Resets on ${data.reset_date}` : ''}
              {!ok && (
                <span className="ml-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  Syncing…
                </span>
              )}
            </p>
          </div>
          <Link
            href="/dashboard/generate"
            className="bg-ds-primary text-white px-5 py-2.5 rounded-[11px] font-bold text-sm flex items-center gap-2 hover:brightness-105 transition-all active:scale-95 shadow-lg shadow-ds-primary/20"
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
            New Generation
          </Link>
        </section>

        <OnboardingChecklist />

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Usage Ring */}
          <div className="bg-white p-6 rounded-[14px] border border-ds-line shadow-[0_1px_0_rgba(0,0,0,0.02),0_30px_60px_-30px_rgba(10,10,20,0.15)] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-ds-primary/5 rounded-full blur-2xl"></div>
            <div className="relative w-32 h-32 mb-4">
              <UsageRing used={data.generations_used} limit={data.generations_limit} size={128} />
            </div>
            <h4 className="text-sm font-bold text-ds-text-2">Quota Overview</h4>
          </div>

          {/* Generations Used */}
          <div className="bg-white p-6 rounded-[14px] border border-ds-line shadow-[0_1px_0_rgba(0,0,0,0.02),0_30px_60px_-30px_rgba(10,10,20,0.15)]">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-ds-primary-soft rounded-[8px] text-ds-primary">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-ds-text-2">Generations Used</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-black text-ds-text">{data.generations_used.toLocaleString()}</h3>
                <span className="text-ds-text-3 font-bold text-sm">/ {data.generations_limit ? data.generations_limit.toLocaleString() : 'Unlimited'}</span>
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-paper-2 rounded-full">
              <div className="h-full bg-ds-primary rounded-full" style={{ width: `${Math.min(100, (data.generations_used / (data.generations_limit || 1)) * 100)}%` }}></div>
            </div>
          </div>

          {/* API Key */}
          <div className="bg-white p-6 rounded-[14px] border border-ds-line shadow-[0_1px_0_rgba(0,0,0,0.02),0_30px_60px_-30px_rgba(10,10,20,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Key className="text-ds-line-2 text-5xl opacity-30 select-none" />
            </div>
            <p className="text-sm font-medium text-ds-text-2 mb-4">Active API Key</p>
            <div className="bg-paper p-3 rounded-[10px] border border-ds-line font-mono text-[11px] text-ds-text-2 break-all mb-4">
              {data.api_key_public || 'Not generated'}
            </div>
            <Link
              href="/dashboard/api-keys"
              className="w-full py-2 bg-paper text-ds-primary font-bold text-xs rounded-[10px] hover:bg-ds-primary hover:text-white transition-all flex items-center justify-center gap-2 border border-ds-line"
            >
              <Copy className="text-sm" />
              Copy Key
            </Link>
          </div>

          {/* Current Plan */}
          <div className="bg-ink p-6 rounded-[14px] border border-ds-line-dark shadow-xl shadow-ink/30 relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.12em]">Active Plan</span>
                <h3 className="text-3xl font-black text-white mt-1" style={{ fontFamily: "'Inter Tight', sans-serif" }}>{currentPlan.name}</h3>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs font-medium text-white/70">Monthly Spend</span>
                  <span className="text-sm font-bold text-white">${data.cost_usd.toFixed(2)}</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full">
                  <div className="h-full bg-ds-accent w-[60%] rounded-full shadow-[0_0_8px_rgba(200,254,94,0.4)]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Cards */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-headline text-ds-text">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/generate" className="group bg-white p-6 rounded-[14px] border border-ds-line hover:border-ds-primary transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 block">
              <div className="w-12 h-12 bg-ds-primary-soft rounded-[10px] flex items-center justify-center text-ds-primary mb-4 group-hover:bg-ds-primary group-hover:text-white transition-colors">
                <Sparkles className="text-3xl" />
              </div>
              <h3 className="font-bold text-ds-text text-lg mb-2">AI Generator</h3>
              <p className="text-sm text-ds-text-2 leading-relaxed">Generate product titles and descriptions in Gulf Arabic and English.</p>
            </Link>

            <Link href="/dashboard/embed" className="group bg-white p-6 rounded-[14px] border border-ds-line hover:border-ds-accent transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 block">
              <div className="w-12 h-12 bg-ds-accent/20 rounded-[10px] flex items-center justify-center text-ds-accent-ink mb-4 group-hover:bg-ds-accent group-hover:text-ds-accent-ink transition-colors">
                <LayoutGrid className="text-3xl" />
              </div>
              <h3 className="font-bold text-ds-text text-lg mb-2">Embed Widget</h3>
              <p className="text-sm text-ds-text-2 leading-relaxed">Install the AI product description widget on your storefront.</p>
            </Link>

            <Link href="/dashboard/api-keys" className="group bg-white p-6 rounded-[14px] border border-ds-line hover:border-ds-text transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 block">
              <div className="w-12 h-12 bg-paper-2 rounded-[10px] flex items-center justify-center text-ds-text-2 mb-4 group-hover:bg-ink group-hover:text-white transition-colors">
                <Code className="text-3xl" />
              </div>
              <h3 className="font-bold text-ds-text text-lg mb-2">API Keys</h3>
              <p className="text-sm text-ds-text-2 leading-relaxed">Manage authentication tokens for widget embeds.</p>
            </Link>

            {nextPlan ? (
              <Link href={`/dashboard/upgrade?plan=${nextPlan.id}`} className="group relative bg-white p-6 rounded-[14px] border border-ds-primary/20 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 overflow-hidden block">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-ds-primary-soft rounded-[10px] flex items-center justify-center text-ds-primary mb-4 group-hover:bg-ds-primary group-hover:text-white transition-colors">
                    <Rocket className="text-3xl" />
                  </div>
                  <h3 className="font-bold text-ds-text text-lg mb-2">Upgrade to {nextPlan.name}</h3>
                  <p className="text-sm text-ds-text-2 leading-relaxed">More generations, more channels, and priority support. {formatPrice(nextPlan.priceUSD, "QAR")}</p>
                </div>
              </Link>
            ) : (
              <div className="group relative bg-white p-6 rounded-[14px] border border-ds-primary/20 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 overflow-hidden block">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-ds-primary-soft rounded-[10px] flex items-center justify-center text-ds-primary mb-4 group-hover:bg-ds-primary group-hover:text-white transition-colors">
                    <Rocket className="text-3xl" />
                  </div>
                  <h3 className="font-bold text-ds-text text-lg mb-2">Enterprise Plan Active</h3>
                  <p className="text-sm text-ds-text-2 leading-relaxed">Enjoy unlimited generations and dedicated support.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Bottom Section: Quick Links */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-[14px] border border-ds-line overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.02),0_30px_60px_-30px_rgba(10,10,20,0.15)]">
            <div className="p-6 border-b border-ds-line flex justify-between items-center">
              <h3 className="font-bold font-headline text-ds-text">Get Started</h3>
            </div>
            <div className="divide-y divide-ds-line/50">
              <Link href="/dashboard/generate" className="p-4 flex items-center gap-4 hover:bg-paper transition-colors block">
                <div className="w-12 h-12 rounded-[8px] bg-ds-primary-soft flex-shrink-0 flex items-center justify-center text-ds-primary">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-ds-text">Generate your first product</h4>
                  <p className="text-xs text-ds-text-2">Create Arabic and English product copy in seconds.</p>
                </div>
                <ArrowRight className="text-ds-text-3" />
              </Link>
              <Link href="/dashboard/embed" className="p-4 flex items-center gap-4 hover:bg-paper transition-colors block">
                <div className="w-12 h-12 rounded-[8px] bg-ds-accent/20 flex-shrink-0 flex items-center justify-center text-ds-accent-ink">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-ds-text">Copy your embed code</h4>
                  <p className="text-xs text-ds-text-2">Add the widget to your Shopify, Salla, or Zid store.</p>
                </div>
                <ArrowRight className="text-ds-text-3" />
              </Link>
              <Link href="/channels" className="p-4 flex items-center gap-4 hover:bg-paper transition-colors block">
                <div className="w-12 h-12 rounded-[8px] bg-paper-2 flex-shrink-0 flex items-center justify-center text-ds-text-2">
                  <Share2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-ds-text">Connect a channel</h4>
                  <p className="text-xs text-ds-text-2">Link WhatsApp, Instagram, or Facebook to your inbox.</p>
                </div>
                <ArrowRight className="text-ds-text-3" />
              </Link>
            </div>
          </div>

          {/* Help Card */}
          <div className="bg-ink text-white rounded-[14px] p-6 flex flex-col justify-between relative overflow-hidden group border border-ds-line-dark">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black font-headline mb-4">Need help?</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">Check out the documentation or reach out to our support team.</p>
            </div>
            <a className="relative z-10 flex items-center gap-2 text-ds-accent font-bold text-sm group/btn" href="mailto:hello@rawaj.ai">
              Contact support
              <ArrowRight className="text-sm group-hover/btn:translate-x-1 transition-transform" />
            </a>
          </div>
        </section>
      </div>
    </>
  )
}
