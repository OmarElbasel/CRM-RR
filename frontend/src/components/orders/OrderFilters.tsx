'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import type { OrderSource, OrderStatus } from '@/lib/orders'

export function OrderFilters() {
  const router = useRouter()
  const params = useSearchParams()

  function update(key: string, value: string) {
    const p = new URLSearchParams(params.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    router.push(`/orders?${p.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-surface-container/50 rounded-xl border border-slate-100 shadow-sm mb-6">
      <div className="flex flex-col gap-1.5 min-w-[140px]">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Source</label>
        <select
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all outline-none"
          value={params.get('source') || ''}
          onChange={(e) => update('source', e.target.value)}
        >
          <option value="">All Sources</option>
          <option value="SHOPIFY">Shopify</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="MANUAL">Manual</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5 min-w-[140px]">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Status</label>
        <select
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all outline-none"
          value={params.get('status') || ''}
          onChange={(e) => update('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          {(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'RETURNED'] as OrderStatus[]).map(
            (s) => (
              <option key={s} value={s}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">From Date</label>
        <input
          type="date"
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 transition-all outline-none"
          value={params.get('date_from') || ''}
          onChange={(e) => update('date_from', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">To Date</label>
        <input
          type="date"
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 transition-all outline-none"
          value={params.get('date_to') || ''}
          onChange={(e) => update('date_to', e.target.value)}
        />
      </div>

      <div className="ml-auto self-end">
        <button 
          onClick={() => router.push('/orders')}
          className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}
