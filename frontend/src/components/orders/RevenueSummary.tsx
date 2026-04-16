'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { fetchOrderSummary, type OrderSummaryResponse } from '@/lib/orders'

const SOURCE_LABELS = { SHOPIFY: 'Shopify', WHATSAPP: 'WhatsApp', MANUAL: 'Manual' }

export function RevenueSummary() {
  const { getToken } = useAuth()
  const [data, setData] = useState<OrderSummaryResponse | null>(null)

  useEffect(() => {
    getToken().then((token) => fetchOrderSummary(undefined, token || '')).then(setData).catch(console.error)
  }, [getToken])

  if (!data) return null

  return (
    <div className="px-8 grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-primary p-5 rounded-xl text-white shadow-lg shadow-primary/20 relative overflow-hidden group transition-all hover:scale-[1.02] cursor-default">
        <div className="relative z-10">
          <p className="text-primary-fixed text-xs font-medium uppercase tracking-wider mb-1">Total Revenue</p>
          <h3 className="text-3xl font-black mb-1">
            {data.total_amount} {data.currency}
          </h3>
          <div className="flex items-center gap-1 text-secondary-container text-xs font-bold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            {data.month}
          </div>
        </div>
        <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">payments</span>
      </div>

      {(['SHOPIFY', 'WHATSAPP', 'MANUAL'] as const).map((src) => {
        const config = {
          SHOPIFY: { label: 'Shopify', icon: 'shopping_bag', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          WHATSAPP: { label: 'WhatsApp', icon: 'chat', color: 'text-green-600', bg: 'bg-green-50' },
          MANUAL: { label: 'Manual', icon: 'edit_note', color: 'text-slate-600', bg: 'bg-slate-50' },
        }[src]

        return (
          <div key={src} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all hover:shadow-md cursor-default">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center ${config.color}`}>
                  <span className="material-symbols-outlined text-lg">{config.icon}</span>
                </div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">{config.label}</p>
              </div>
              <span className={`text-[10px] ${config.bg} ${config.color} px-2 py-0.5 rounded-full font-bold`}>
                {src === 'SHOPIFY' ? 'Live' : 'Active'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              {data.by_source[src]?.amount || '0'} {data.currency}
            </h3>
            <p className="text-slate-400 text-xs mt-1">{data.by_source[src]?.count || 0} orders</p>
          </div>
        )
      })}
    </div>
  )
}
