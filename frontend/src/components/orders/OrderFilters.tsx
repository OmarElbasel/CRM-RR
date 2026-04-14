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
    <div className="flex flex-wrap gap-3 mb-6">
      <select
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        value={params.get('source') || ''}
        onChange={(e) => update('source', e.target.value)}
      >
        <option value="">All Sources</option>
        <option value="SHOPIFY">Shopify</option>
        <option value="WHATSAPP">WhatsApp</option>
        <option value="MANUAL">Manual</option>
      </select>
      <select
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
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
      <input
        type="date"
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        value={params.get('date_from') || ''}
        onChange={(e) => update('date_from', e.target.value)}
        placeholder="From"
      />
      <input
        type="date"
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        value={params.get('date_to') || ''}
        onChange={(e) => update('date_to', e.target.value)}
        placeholder="To"
      />
    </div>
  )
}
