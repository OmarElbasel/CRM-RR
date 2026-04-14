'use client'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { fetchOrderSummary, type OrderSummaryResponse } from '@/lib/orders'

const SOURCE_LABELS = { SHOPIFY: 'Shopify', WHATSAPP: 'WhatsApp', MANUAL: 'Manual' }

export function RevenueSummary() {
  const [data, setData] = useState<OrderSummaryResponse | null>(null)

  useEffect(() => {
    fetchOrderSummary().then(setData).catch(console.error)
  }, [])

  if (!data) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <p className="text-xs text-gray-500">Total Revenue</p>
        <p className="text-xl font-bold text-gray-900">
          {data.total_amount} {data.currency}
        </p>
        <p className="text-xs text-gray-400">{data.month}</p>
      </Card>
      {(['SHOPIFY', 'WHATSAPP', 'MANUAL'] as const).map((src) => (
        <Card key={src} className="p-4">
          <p className="text-xs text-gray-500">{SOURCE_LABELS[src]}</p>
          <p className="text-lg font-semibold text-gray-900">
            {data.by_source[src]?.amount || '0'} QAR
          </p>
          <p className="text-xs text-gray-400">{data.by_source[src]?.count || 0} orders</p>
        </Card>
      ))}
    </div>
  )
}
