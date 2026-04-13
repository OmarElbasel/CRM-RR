'use client'

import { useDroppable } from '@dnd-kit/core'
import { DealCard, type DealData } from './DealCard'

interface PipelineColumnProps {
  stage: string
  label: string
  totalValue: string
  count: number
  deals: DealData[]
  onDealClick?: (deal: DealData) => void
}

const STAGE_COLORS: Record<string, string> = {
  NEW_MESSAGE: 'border-t-blue-400',
  ENGAGED: 'border-t-yellow-400',
  PRICE_SENT: 'border-t-purple-400',
  ORDER_PLACED: 'border-t-orange-400',
  PAID: 'border-t-green-400',
  LOST: 'border-t-gray-400',
}

export function PipelineColumn({ stage, label, totalValue, count, deals, onDealClick }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[280px] max-w-[320px] w-full bg-gray-50 rounded-xl border-t-4 ${STAGE_COLORS[stage] || 'border-t-gray-300'} ${isOver ? 'bg-gray-100 ring-2 ring-indigo-200' : ''} transition-colors`}
    >
      <div className="p-3 pb-2">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-gray-700">{label}</h2>
          <span className="text-xs font-medium bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        </div>
        {parseFloat(totalValue) > 0 && (
          <p className="text-[10px] text-gray-400">{totalValue} QAR</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} onClick={onDealClick} />
        ))}
        {deals.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">No deals</p>
        )}
      </div>
    </div>
  )
}
