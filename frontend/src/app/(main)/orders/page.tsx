'use client'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ShoppingBag, Download } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { PlaceholderFeature } from '@/components/ui/PlaceholderFeature'
import { isEnabled } from '@/lib/flags'
import { fetchOrders, type Order, type OrderFilters } from '@/lib/orders'
import { OrderFilters as OrderFilterBar } from '@/components/orders/OrderFilters'
import { OrderPipelineBoard } from '@/components/orders/OrderPipelineBoard'
import { RevenueSummary } from '@/components/orders/RevenueSummary'
import { ManualOrderForm } from '@/components/orders/ManualOrderForm'

type Currency = 'QAR' | 'SAR' | 'USD'

export default function OrdersPage() {
  if (!isEnabled('SHOPIFY_ORDER_HUB')) {
    return (
      <>
        <PageHeader title="Orders" />
        <PlaceholderFeature
          icon={<ShoppingBag />}
          title="Orders"
          description="Order management with real-time sync from Shopify, Salla, and Zid."
          phase="Phase 7"
        />
      </>
    )
  }

  return <OrderHubContent />
}

function OrderHubContent() {
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [currency, setCurrency] = useState<Currency>('QAR')

  const loadOrders = useCallback(() => {
    const filters: OrderFilters = {
      source: (searchParams.get('source') as any) || undefined,
      status: (searchParams.get('status') as any) || undefined,
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
      page_size: 100,
    }
    setLoading(true)
    fetchOrders(filters)
      .then((res) => setOrders(res.results))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [searchParams])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  function handleExportCsv() {
    const params = new URLSearchParams(searchParams.toString())
    window.location.href = `/api/orders/export/?${params}`
  }

  return (
    <>
      <PageHeader
        title="Orders"
        action={
          <div className="flex gap-2 items-center flex-wrap">
            {(['QAR', 'SAR', 'USD'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-3 py-1 text-xs rounded-full border ${
                  currency === c
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                {c}
              </button>
            ))}
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1 px-3 py-1 text-xs rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <Download className="w-3 h-3" />
              Export CSV
            </button>
            <ManualOrderForm onCreated={loadOrders} />
          </div>
        }
      />
      <RevenueSummary />
      <OrderFilterBar />
      {loading ? (
        <div className="text-sm text-gray-400 py-12 text-center">Loading orders…</div>
      ) : (
        <OrderPipelineBoard orders={orders} selectedCurrency={currency} />
      )}
    </>
  )
}
