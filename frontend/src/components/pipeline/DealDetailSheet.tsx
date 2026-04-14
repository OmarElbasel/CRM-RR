'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { DealTaskList } from './DealTaskList'
import { Badge } from '@/components/ui/badge'
import { DUMMY_DEAL_DETAILS } from '@/lib/dummy/pipeline'

interface DealDetail {
  id: number
  title: string
  stage: string
  priority: string
  value: string | null
  ai_score: number
  assigned_to: { clerk_user_id: string; name: string }
  contact: {
    id: number
    name: string
    platform: string
    platform_id: string
    ai_score: number
    total_spend: string
  } | null
  notes: string
  lost_reason: string
  due_at: string | null
  closed_at: string | null
  messages: {
    id: number
    direction: string
    content: string
    intent: string | null
    sent_at: string
  }[]
  tasks: {
    id: number
    title: string
    description: string
    due_at: string | null
    completed_at: string | null
    assigned_to: { clerk_user_id: string; name: string }
  }[]
  notifications: {
    id: number
    notification_type: string
    priority: string
    title: string
    body: string
    body_ar: string
    draft_en: string
    draft_ar: string
    read_at: string | null
    created_at: string
  }[]
}

interface DealDetailSheetProps {
  dealId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  apiUrl: string
  onUpdate: () => void
}

export function DealDetailSheet({ dealId, open, onOpenChange, apiUrl, onUpdate }: DealDetailSheetProps) {
  const [deal, setDeal] = useState<DealDetail | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchDeal = useCallback(async () => {
    if (!dealId) return
    setLoading(true)
    try {
      if (process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true') {
        setDeal((DUMMY_DEAL_DETAILS[dealId] as DealDetail) ?? null)
        return
      }
      const res = await fetch(`${apiUrl}/api/deals/${dealId}/`, {
        credentials: 'include',
      })
      if (res.ok) {
        setDeal(await res.json())
      }
    } finally {
      setLoading(false)
    }
  }, [dealId, apiUrl])

  useEffect(() => {
    if (open && dealId) {
      fetchDeal()
    }
  }, [open, dealId, fetchDeal])

  function handleTaskUpdate() {
    fetchDeal()
    onUpdate()
  }

  const staleAlerts = deal?.notifications.filter(n => !n.read_at) || []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{deal?.title || 'Deal Detail'}</SheetTitle>
        </SheetHeader>

        {loading && !deal ? (
          <div className="p-4 text-sm text-gray-400">Loading...</div>
        ) : deal ? (
          <div className="p-4 space-y-6">
            {/* Deal summary */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{deal.stage.replace('_', ' ')}</Badge>
              <Badge variant="outline">{deal.priority}</Badge>
              <Badge variant="outline">Score: {deal.ai_score}</Badge>
              {deal.value && <Badge variant="outline">{deal.value} QAR</Badge>}
            </div>

            {/* Contact info */}
            {deal.contact && (
              <div className="rounded-lg bg-gray-50 p-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Contact</h4>
                <p className="text-sm text-gray-600">{deal.contact.name}</p>
                <p className="text-xs text-gray-400">{deal.contact.platform} · {deal.contact.platform_id}</p>
                <p className="text-xs text-gray-400">Spend: {deal.contact.total_spend} QAR · Score: {deal.contact.ai_score}</p>
              </div>
            )}

            {/* Stale alerts */}
            {staleAlerts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-orange-600">Alerts</h4>
                {staleAlerts.map((alert) => (
                  <div key={alert.id} className="rounded-lg border border-orange-200 bg-orange-50 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-orange-600 border-orange-300">{alert.priority}</Badge>
                      <span className="text-sm font-medium text-gray-700">{alert.title}</span>
                    </div>
                    <p className="text-xs text-gray-600">{alert.body}</p>
                    {alert.body_ar && (
                      <p className="text-xs text-gray-600" dir="rtl">{alert.body_ar}</p>
                    )}
                    {alert.draft_en && (
                      <div className="mt-2 rounded bg-white p-2">
                        <p className="text-[10px] text-gray-400 mb-1">Suggested follow-up (EN):</p>
                        <p className="text-xs text-gray-700">{alert.draft_en}</p>
                      </div>
                    )}
                    {alert.draft_ar && (
                      <div className="rounded bg-white p-2">
                        <p className="text-[10px] text-gray-400 mb-1">Suggested follow-up (AR):</p>
                        <p className="text-xs text-gray-700" dir="rtl">{alert.draft_ar}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Notes */}
            {deal.notes && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Notes</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{deal.notes}</p>
              </div>
            )}

            {/* Tasks */}
            <DealTaskList
              dealId={deal.id}
              tasks={deal.tasks}
              apiUrl={apiUrl}
              onUpdate={handleTaskUpdate}
            />

            {/* Message history */}
            {deal.messages.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Messages</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {deal.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-lg p-2.5 ${msg.direction === 'INBOUND' ? 'bg-blue-50 ml-0 mr-8' : 'bg-gray-100 ml-8 mr-0'}`}
                    >
                      <p className="text-xs text-gray-700">{msg.content}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400">
                          {new Date(msg.sent_at).toLocaleString()}
                        </span>
                        {msg.intent && (
                          <span className="text-[10px] text-indigo-500">{msg.intent}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lost reason */}
            {deal.lost_reason && (
              <div>
                <h4 className="text-sm font-semibold text-red-600 mb-1">Lost Reason</h4>
                <p className="text-sm text-gray-600">{deal.lost_reason}</p>
              </div>
            )}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
