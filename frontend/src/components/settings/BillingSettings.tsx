'use client'

import React from 'react'
import Link from 'next/link'

interface UsageData {
  plan: string
  generations_used: number
  generations_limit: number | null
  tokens_in: number
  tokens_out: number
  reset_date: string
}

interface BillingSettingsProps {
  usage: UsageData | null
}

export function BillingSettings({ usage }: BillingSettingsProps) {
  if (!usage) return null

  const isUnlimited = usage.generations_limit === null
  const percentage = isUnlimited ? 0 : Math.min(100, (usage.generations_used / usage.generations_limit!) * 100)
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Current Plan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-8 flex flex-col justify-between group">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                Current Plan
              </span>
              {usage.plan.toLowerCase() === 'free' && (
                <Link href="/dashboard/upgrade" className="text-xs font-bold text-indigo-600 hover:underline">
                  Compare Plans
                </Link>
              )}
            </div>
            <h3 className="text-3xl font-headline font-black text-slate-900 mb-2 uppercase tracking-tight">
              {usage.plan}
            </h3>
            <p className="text-sm text-slate-500 font-medium mb-6">
              Your subscription will automatically reset on <span className="text-slate-900 font-bold">{usage.reset_date}</span>.
            </p>
          </div>
          
          <Link 
            href="/dashboard/upgrade"
            className="w-fit bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            Upgrade Subscription
          </Link>
        </div>

        <div className="bg-slate-900 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <h4 className="text-white font-headline font-black text-xl mb-4 relative z-10">Usage Statistics</h4>
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Tokens In</p>
              <p className="text-lg font-bold text-white tabular-nums">{usage.tokens_in.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Tokens Out</p>
              <p className="text-lg font-bold text-white tabular-nums">{usage.tokens_out.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Meter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="font-headline font-black text-xl text-slate-900 mb-1">AI Generations</h3>
            <p className="text-sm text-slate-500 font-medium">Monthly limit for caption, ad-copy, and broadcast generation.</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-slate-900">{usage.generations_used.toLocaleString()}</span>
            <span className="text-slate-400 font-bold ml-1">/ {isUnlimited ? 'Unlimited' : usage.generations_limit?.toLocaleString()}</span>
          </div>
        </div>

        <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full transition-all duration-1000 ease-out shadow-lg ${
              percentage > 90 ? 'bg-rose-500' : percentage > 70 ? 'bg-amber-500' : 'bg-indigo-600'
            }`}
            style={{ width: `${isUnlimited ? 100 : percentage}%` }}
          />
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-400 italic">
          <span className="material-symbols-outlined text-sm">info</span>
          Bypassing check for Enterprise users.
        </div>
      </div>

      {/* Billing Support Callout */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600">
            <span className="material-symbols-outlined">receipt_long</span>
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Need specific invoices?</h4>
            <p className="text-sm text-slate-500 font-medium">Contact our support team for historical billing data or specialized receipts.</p>
          </div>
        </div>
        <button className="text-indigo-600 font-bold text-sm hover:underline">
          Contact Support →
        </button>
      </div>
    </div>
  )
}
