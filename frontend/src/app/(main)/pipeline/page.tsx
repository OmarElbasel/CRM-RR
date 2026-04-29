'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import posthog from 'posthog-js'
import { Banknote, FileEdit, GitBranch, MessageCircle, ShoppingBag, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { PlaceholderFeature } from '@/components/ui/PlaceholderFeature'
import { PipelineBoard, type PipelineBoardData } from '@/components/pipeline/PipelineBoard'
import { CreateDealDialog } from '@/components/pipeline/CreateDealDialog'
import { DealDetailSheet } from '@/components/pipeline/DealDetailSheet'
import { PipelineFilters, EMPTY_FILTERS, type FilterValues } from '@/components/pipeline/PipelineFilters'
import { isEnabled } from '@/lib/flags'
import type { DealData } from '@/components/pipeline/DealCard'
import { DUMMY_PIPELINE_DATA } from '@/lib/dummy/pipeline'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function PipelinePage() {
  const { getToken } = useAuth()
  const pipelineEnabled = isEnabled('PIPELINE')
  const [data, setData] = useState<PipelineBoardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterValues>(EMPTY_FILTERS)
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  useEffect(() => {
    posthog.capture('pipeline_viewed')
  }, [])

  const fetchPipeline = useCallback(async () => {
    setLoading(true)
    try {
      if (process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true') {
        setData(DUMMY_PIPELINE_DATA)
        return
      }
      const params = new URLSearchParams()
      if (filters.platform) params.set('platform', filters.platform)
      if (filters.assignee) params.set('assignee', filters.assignee)
      if (filters.score_min) params.set('score_min', filters.score_min)
      if (filters.score_max) params.set('score_max', filters.score_max)
      if (filters.date_from) params.set('date_from', filters.date_from)
      if (filters.date_to) params.set('date_to', filters.date_to)

      const qs = params.toString()
      const url = `${API_URL}/api/pipeline/${qs ? `?${qs}` : ''}`
      const token = await getToken()
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setData(await res.json())
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setLoading(false)
    }
  }, [filters, getToken])

  useEffect(() => {
    if (pipelineEnabled) {
      fetchPipeline()
    }
  }, [pipelineEnabled, fetchPipeline])

  async function handleStageChange(dealId: number, newStage: string) {
    const token = await getToken()
    const res = await fetch(`${API_URL}/api/deals/${dealId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stage: newStage }),
    })
    if (!res.ok) throw new Error('Stage change failed')
    // Re-fetch to get accurate totals
    fetchPipeline()
  }

  function handleDealClick(deal: DealData) {
    setSelectedDealId(deal.id)
    setDetailOpen(true)
  }

  if (!pipelineEnabled) {
    return (
      <>
        <PageHeader title="Pipeline" />
        <PlaceholderFeature
          icon={<GitBranch />}
          title="Pipeline"
          description="Visual CRM pipeline to track leads from first contact to closed deal."
          phase="Phase 6"
        />
      </>
    )
  }

  return (
    <div className="w-full max-w-full flex flex-col min-h-[calc(100vh-64px)] overflow-x-hidden">
      {/* Page Header & Currency Switcher */}
      <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-ds-text tracking-tight headline">Pipeline</h2>
          <p className="text-ds-text-2 text-sm">Visual CRM — track every lead from first contact to close.</p>
        </div>
        <div className="flex bg-paper px-3 py-1.5 rounded-lg text-xs font-bold text-ds-text-2">USD</div>
      </div>

      {/* Revenue Summary Cards (Bento Style) */}
      <div className="px-8 grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-primary p-5 rounded-xl text-white shadow-lg shadow-primary/20 relative overflow-hidden group transition-all hover:scale-[1.02]">
          <div className="relative z-10">
            <p className="text-ds-primary/15 text-xs font-medium uppercase tracking-wider mb-1">Total Revenue</p>
            <h3 className="text-3xl font-black mb-1">{data?.aggregate_total_value || '0.00'}</h3>
            <div className="flex items-center gap-1 text-ds-accent/20 text-xs font-bold">
              <TrendingUp className="text-sm" />
              +12.4% vs last month
            </div>
          </div>
          <Banknote className="absolute -bottom-4 -right-4 text-9xl opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all hover:shadow-md cursor-default">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShoppingBag className="text-lg" />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">Shopify</p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">Live</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">84,200.00</h3>
          <p className="text-slate-400 text-xs mt-1">67% of total sales</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all hover:shadow-md cursor-default">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                <MessageCircle className="text-lg" />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">WhatsApp</p>
            </div>
            <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">Active</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">32,150.00</h3>
          <p className="text-slate-400 text-xs mt-1">26% of total sales</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all hover:shadow-md cursor-default">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
                <FileEdit className="text-lg" />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">Manual</p>
            </div>
            <CreateDealDialog 
              apiUrl={API_URL} 
              onCreated={fetchPipeline} 
              trigger={
                <button className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold hover:bg-indigo-100 transition-colors">
                  Add New
                </button>
              }
            />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">8,242.00</h3>
          <p className="text-slate-400 text-xs mt-1">7% of total sales</p>
        </div>
      </div>

      <div className="px-8 mb-4">
        <PipelineFilters
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />
      </div>

      {loading && !data ? (
        <div className="text-sm text-gray-400 py-12 text-center">Loading pipeline...</div>
      ) : data ? (
        <PipelineBoard
          data={data}
          onStageChange={handleStageChange}
          onDealClick={handleDealClick}
          onCreated={fetchPipeline}
          apiUrl={API_URL}
        />
      ) : (
        <div className="text-sm text-gray-400 py-12 text-center">Failed to load pipeline.</div>
      )}

      <DealDetailSheet
        dealId={selectedDealId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        apiUrl={API_URL}
        onUpdate={fetchPipeline}
      />
    </div>
  )
}
