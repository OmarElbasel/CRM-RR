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
  onCreated?: () => void
  apiUrl?: string
}

const STAGE_CONFIG: Record<string, { color: string; dot: string; bg: string }> = {
  NEW_MESSAGE: { color: 'text-slate-900', dot: 'bg-slate-400', bg: 'bg-slate-100/50' },
  ENGAGED: { color: 'text-blue-600', dot: 'bg-blue-500', bg: 'bg-blue-50/30' },
  PRICE_SENT: { color: 'text-amber-600', dot: 'bg-amber-400', bg: 'bg-amber-50/30' },
  ORDER_PLACED: { color: 'text-purple-600', dot: 'bg-purple-500', bg: 'bg-purple-50/30' },
  PAID: { color: 'text-secondary-dim', dot: 'bg-secondary-container', bg: 'bg-emerald-50/30' },
  LOST: { color: 'text-on-error-container', dot: 'bg-error', bg: 'bg-error-container/10' },
}

import { CreateDealDialog } from './CreateDealDialog'

export function PipelineColumn({ stage, label, totalValue, count, deals, onDealClick, onCreated, apiUrl }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })
  const config = STAGE_CONFIG[stage] || { color: 'text-slate-900', dot: 'bg-gray-400', bg: 'bg-slate-100/50' }

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[320px] max-w-[320px] w-full rounded-xl transition-all ${isOver ? 'bg-surface-container-high/50 ring-2 ring-primary/20 scale-[1.01]' : ''}`}
    >
      <div className="flex items-center justify-between px-1 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className={`font-bold text-slate-900 text-sm`}>{label}</h3>
          <span className={`${config.dot} ${config.color} text-[10px] px-2 py-0.5 rounded-full font-bold opacity-80`}>
            {count}
          </span>
        </div>
        <button className="text-slate-400 hover:text-indigo-600 transition-colors">
          <span className="material-symbols-outlined text-xl">more_horiz</span>
        </button>
      </div>

      <div className={`flex-1 flex flex-col gap-3 min-h-[100px] ${config.bg} p-2 rounded-xl transition-all ${isOver ? 'ring-2 ring-primary/20 scale-[1.01]' : ''}`}>
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} onClick={onDealClick} stage={stage} />
        ))}
        {stage === 'NEW_MESSAGE' && (
           <CreateDealDialog 
              apiUrl={apiUrl || ''} 
              onCreated={onCreated || (() => {})} 
              trigger={
                <button className="dashed border-2 border-dashed border-slate-300 rounded-lg py-3 text-slate-400 text-sm font-medium hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 group">
                  <span className="material-symbols-outlined text-sm group-hover:rotate-90 transition-transform">add</span>
                  New Manual Order
                </button>
              }
            />
        )}
        {deals.length === 0 && stage !== 'NEW_MESSAGE' && (
          <div className="py-12 border-2 border-dashed border-outline-variant/10 rounded-xl flex flex-col items-center justify-center opacity-30">
             <span className="material-symbols-outlined text-4xl mb-2">drag_indicator</span>
             <p className="text-xs font-medium">No deals in {label}</p>
          </div>
        )}
      </div>
    </div>
  )
}
