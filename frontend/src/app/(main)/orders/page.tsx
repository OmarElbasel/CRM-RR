'use client'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { ShoppingBag, Download, RefreshCw } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
import { PageHeader } from '@/components/ui/PageHeader'
import { PlaceholderFeature } from '@/components/ui/PlaceholderFeature'
import { isEnabled } from '@/lib/flags'
import { fetchOrders, type Order, type OrderFilters } from '@/lib/orders'
import { OrderFilters as OrderFilterBar } from '@/components/orders/OrderFilters'
import { OrderPipelineBoard } from '@/components/orders/OrderPipelineBoard'
import { RevenueSummary } from '@/components/orders/RevenueSummary'
import { ManualOrderForm } from '@/components/orders/ManualOrderForm'

type Currency = 'EGP' | 'QAR' | 'SAR' | 'USD'

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
  const { getToken } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [currency, setCurrency] = useState<Currency>('EGP')

  const loadOrders = useCallback(async () => {
    const filters: OrderFilters = {
      source: (searchParams.get('source') as any) || undefined,
      status: (searchParams.get('status') as any) || undefined,
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
      page_size: 100,
    }
    setLoading(true)
    const token = await getToken()
    fetchOrders(filters, token || '')
      .then((res) => setOrders(res.results))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [searchParams, getToken])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const [syncing, setSyncing] = useState(false)

  async function handleSync() {
    setSyncing(true)
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/shopify/sync/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        await loadOrders()
      } else {
        const err = await res.json().catch(() => ({}))
        console.error('Sync failed:', err.detail || err)
      }
    } catch (e) {
      console.error('Sync error:', e)
    } finally {
      setSyncing(false)
    }
  }

  function handleExportCsv() {
    const params = new URLSearchParams(searchParams.toString())
    window.location.href = `/api/orders/export/?${params}`
  }

  return (
    <div className="w-full max-w-full flex flex-col min-h-[calc(100vh-64px)] overflow-x-hidden">
      {/* Page Header & Currency Switcher */}
      <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight headline">Orders Hub</h2>
          <p className="text-on-surface-variant text-sm">Real-time sync and order management across all channels.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-surface-container p-1 rounded-lg shadow-inner">
            {(['EGP', 'SAR', 'QAR', 'USD'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  currency === c
                    ? 'bg-white text-primary shadow-sm scale-100'
                    : 'text-on-surface-variant hover:text-on-surface scale-95 opacity-70'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing…' : 'Sync Now'}
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <ManualOrderForm onCreated={loadOrders} />
        </div>
      </div>

      <RevenueSummary />

      <div className="px-8 mb-4">
        <OrderFilterBar />
      </div>

      {loading ? (
        <div className="text-sm text-gray-400 py-12 text-center">Loading orders…</div>
      ) : (
        <OrderPipelineBoard orders={orders} selectedCurrency={currency} />
      )}
    </div>
  )
}
