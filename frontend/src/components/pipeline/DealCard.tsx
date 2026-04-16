'use client'

import { useDraggable } from '@dnd-kit/core'
import { Card, CardContent } from '@/components/ui/card'

export interface DealData {
  id: number
  title: string
  contact: { id: number; name: string; platform: string } | null
  value: string | null
  priority: string
  ai_score: number
  assigned_to: { clerk_user_id: string; name: string }
  latest_message_preview: string | null
  last_customer_message_at: string | null
  has_unread_alert: boolean
}

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-blue-50 text-blue-600',
  HIGH: 'bg-orange-50 text-orange-600',
  URGENT: 'bg-red-50 text-red-600',
}

const PLATFORM_COLORS: Record<string, string> = {
  INSTAGRAM: 'bg-pink-50 text-pink-600',
  WHATSAPP: 'bg-green-50 text-green-600',
  FACEBOOK: 'bg-blue-50 text-blue-600',
}

interface DealCardProps {
  deal: DealData
  onClick?: (deal: DealData) => void
  isDragOverlay?: boolean
  stage?: string
}

const PLATFORM_ICONS: Record<string, string> = {
  INSTAGRAM: 'retweet',
  TIKTOK: 'youtube_trending',
  SNAPCHAT: 'swipe',
  WHATSAPP: 'forum',
  FACEBOOK: 'send',
}

const PRIORITY_STYLES: Record<string, { label: string; className: string }> = {
  HIGH: { label: 'High Priority', className: 'bg-secondary-container text-on-secondary-container' },
  MEDIUM: { label: 'Med Priority', className: 'bg-surface-container text-on-surface-variant' },
  LOW: { label: 'Low Priority', className: 'bg-error-container text-on-error-container' },
  URGENT: { label: 'Urgent', className: 'bg-error text-white' },
}

export function DealCard({ deal, onClick, isDragOverlay, stage }: DealCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: deal.id,
  })

  const isPaid = stage === 'PAID'
  const isLost = stage === 'LOST'

  const cardBaseStyles = isPaid 
    ? 'bg-emerald-50/20 border-emerald-200/30' 
    : isLost 
    ? 'bg-slate-50 border-slate-200 opacity-60 grayscale cursor-not-allowed' 
    : 'bg-white border-slate-100 hover:shadow-md cursor-grab active:cursor-grabbing group transition-all shadow-sm'

  const priority = PRIORITY_STYLES[deal.priority] || PRIORITY_STYLES.MEDIUM

  return (
    <div
      ref={!isDragOverlay ? setNodeRef : undefined}
      {...(!isDragOverlay ? { ...listeners, ...attributes } : {})}
      className={`${isDragging ? 'opacity-40' : ''}`}
      onClick={() => !isLost && onClick?.(deal)}
    >
      <div className={`p-4 rounded-lg border ${cardBaseStyles}`}>
        <div className="flex justify-between items-start mb-3">
          <span className={`text-[10px] font-bold py-0.5 px-2 rounded ${isPaid ? 'bg-indigo-50 text-indigo-600' : isLost ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600'}`}>
            #{deal.id}
          </span>
          <span 
            className={`material-symbols-outlined text-sm ${isPaid ? 'text-secondary-dim' : isLost ? 'text-error' : PLATFORM_COLORS[deal.contact?.platform || '']?.includes('green') ? 'text-green-600' : 'text-emerald-600'}`}
          >
            {isPaid ? 'check_circle' : isLost ? 'cancel' : (PLATFORM_ICONS[deal.contact?.platform || ''] === 'forum' ? 'chat' : 'shopping_bag')}
          </span>
        </div>

        <p className={`text-sm font-bold mb-1 ${isLost ? 'text-slate-500' : 'text-slate-900'}`}>
          {deal.contact?.name || 'Anonymous'}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-slate-500">
            {deal.title.length > 20 ? deal.title.substring(0, 17) + '...' : deal.title}
          </span>
          <span className={`font-bold ${isLost ? 'text-slate-400' : 'text-slate-900'}`}>
            SAR {deal.value || '0.00'}
          </span>
        </div>
      </div>
    </div>
  )
}
