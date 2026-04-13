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
}

export function DealCard({ deal, onClick, isDragOverlay }: DealCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: deal.id,
  })

  return (
    <div
      ref={!isDragOverlay ? setNodeRef : undefined}
      {...(!isDragOverlay ? { ...listeners, ...attributes } : {})}
      className={isDragging ? 'opacity-40' : ''}
    >
    <Card
      className="rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow mb-2"
      onClick={() => onClick?.(deal)}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-sm font-medium text-gray-900 truncate flex-1">{deal.title}</h3>
          {deal.has_unread_alert && (
            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1" />
          )}
        </div>

        {deal.contact && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${PLATFORM_COLORS[deal.contact.platform] || 'bg-gray-100 text-gray-600'}`}>
              {deal.contact.platform}
            </span>
            <span className="text-xs text-gray-500 truncate">{deal.contact.name}</span>
          </div>
        )}

        {deal.latest_message_preview && (
          <p className="text-xs text-gray-400 truncate mb-2">{deal.latest_message_preview}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${PRIORITY_COLORS[deal.priority] || 'bg-gray-100 text-gray-600'}`}>
              {deal.priority}
            </span>
            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-600">
              Score: {deal.ai_score}
            </span>
          </div>
          {deal.value && (
            <span className="text-xs font-medium text-gray-700">
              {deal.value} QAR
            </span>
          )}
        </div>

        {deal.assigned_to?.name && (
          <div className="mt-1.5 text-[10px] text-gray-400">
            Assigned to {deal.assigned_to.name}
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  )
}
