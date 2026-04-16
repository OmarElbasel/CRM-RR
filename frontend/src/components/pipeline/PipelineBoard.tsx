'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { PipelineColumn } from './PipelineColumn'
import { DealCard, type DealData } from './DealCard'

export interface StageGroup {
  stage: string
  label: string
  total_value: string
  count: number
  deals: DealData[]
}

export interface PipelineBoardData {
  stages: StageGroup[]
  aggregate_total_value: string
  applied_filters: Record<string, string | number | null>
}

interface PipelineBoardProps {
  data: PipelineBoardData
  onStageChange: (dealId: number, newStage: string) => Promise<void>
  onDealClick?: (deal: DealData) => void
  onCreated?: () => void
  apiUrl?: string
}

export function PipelineBoard({ data, onStageChange, onDealClick, onCreated, apiUrl }: PipelineBoardProps) {
  const [stages, setStages] = useState<StageGroup[]>(data.stages)
  const [activeDeal, setActiveDeal] = useState<DealData | null>(null)

  // Update stages when new data arrives
  if (data.stages !== stages && !activeDeal) {
    setStages(data.stages)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const dealId = event.active.id as number
    for (const stage of stages) {
      const deal = stage.deals.find(d => d.id === dealId)
      if (deal) {
        setActiveDeal(deal)
        break
      }
    }
  }, [stages])

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveDeal(null)

    if (!over) return

    const dealId = active.id as number
    const newStage = over.id as string

    // Find current stage
    let currentStage = ''
    let movedDeal: DealData | null = null
    for (const stage of stages) {
      const deal = stage.deals.find(d => d.id === dealId)
      if (deal) {
        currentStage = stage.stage
        movedDeal = deal
        break
      }
    }

    if (!movedDeal || currentStage === newStage) return

    // Optimistic update
    setStages(prev => prev.map(stage => {
      if (stage.stage === currentStage) {
        return {
          ...stage,
          deals: stage.deals.filter(d => d.id !== dealId),
          count: stage.count - 1,
        }
      }
      if (stage.stage === newStage) {
        return {
          ...stage,
          deals: [movedDeal!, ...stage.deals],
          count: stage.count + 1,
        }
      }
      return stage
    }))

    try {
      await onStageChange(dealId, newStage)
    } catch {
      // Revert on failure
      setStages(data.stages)
    }
  }, [stages, data.stages, onStageChange])

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto pb-4 scrollbar-hide w-full max-w-full">
        <div className="flex gap-4 min-w-max pb-8 px-8">
          {stages.map((stage) => (
            <PipelineColumn
              key={stage.stage}
              stage={stage.stage}
              label={stage.label}
              totalValue={stage.total_value}
              count={stage.count}
              deals={stage.deals}
              onDealClick={onDealClick}
              onCreated={onCreated}
              apiUrl={apiUrl}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} isDragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}
