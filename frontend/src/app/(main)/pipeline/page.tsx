'use client'

import { useCallback, useEffect, useState } from 'react'
import posthog from 'posthog-js'
import { GitBranch } from 'lucide-react'
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
      const res = await fetch(url, { credentials: 'include' })
      if (res.ok) {
        setData(await res.json())
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    if (pipelineEnabled) {
      fetchPipeline()
    }
  }, [pipelineEnabled, fetchPipeline])

  async function handleStageChange(dealId: number, newStage: string) {
    const res = await fetch(`${API_URL}/api/deals/${dealId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
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
    <>
      <PageHeader
        title="Pipeline"
        subtitle={data ? `Total: ${data.aggregate_total_value} QAR` : undefined}
        action={<CreateDealDialog apiUrl={API_URL} onCreated={fetchPipeline} />}
      />

      <PipelineFilters
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />

      {loading && !data ? (
        <div className="text-sm text-gray-400 py-12 text-center">Loading pipeline...</div>
      ) : data ? (
        <PipelineBoard
          data={data}
          onStageChange={handleStageChange}
          onDealClick={handleDealClick}
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
    </>
  )
}
