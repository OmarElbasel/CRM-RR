'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import { DealTaskList } from './DealTaskList'
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
      <SheetContent side="right" className="sm:max-w-2xl overflow-y-auto p-0 border-l border-outline-variant bg-surface">
        {loading && !deal ? (
          <div className="flex items-center justify-center h-full text-on-surface-variant font-medium animate-pulse">
            Loading deal details...
          </div>
        ) : deal ? (
          <div className="flex flex-col h-full bg-surface">
            {/* Premium Header */}
            <div className="p-8 pb-6 border-b border-outline-variant bg-surface-container-lowest">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-black font-headline text-on-surface tracking-tight mb-2">{deal.title}</h1>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] font-bold py-1 px-2.5 bg-primary-container text-primary rounded-full uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[14px] leading-none">layers</span>
                      {deal.stage.replace('_', ' ')}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold py-1 px-2.5 bg-secondary-container text-on-secondary-container rounded-full uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[14px] leading-none">priority_high</span>
                      {deal.priority}
                    </span>
                    <span className="text-secondary font-bold text-sm ml-2">Score: {deal.ai_score}</span>
                  </div>
                </div>
                {deal.value && (
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Deal Value</p>
                    <p className="text-2xl font-black text-primary font-headline">{deal.value} QAR</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
              {/* Customer Bento Card */}
              {deal.contact && (
                <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                  <div className="relative flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                      <span className="material-symbols-outlined text-white text-3xl">person</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-on-surface mb-1">{deal.contact.name}</h3>
                      <div className="flex items-center gap-4 text-[13px] text-on-surface-variant font-medium">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-primary">hub</span>
                          {deal.contact.platform}
                        </span>
                        <span>•</span>
                        <span>{deal.contact.platform_id}</span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-white/50 border border-outline-variant/30 rounded-xl p-3">
                          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Lifetime Value</p>
                          <p className="text-sm font-black text-on-surface">{deal.contact.total_spend} QAR</p>
                        </div>
                        <div className="bg-white/50 border border-outline-variant/30 rounded-xl p-3">
                          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Customer Tier</p>
                          <p className="text-sm font-black text-secondary">A-Rank Lead</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Alerts Bento Section */}
              {staleAlerts.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-error text-[20px]">bolt</span>
                    <h3 className="text-sm font-black font-headline uppercase tracking-widest text-on-surface">Urgent AI Observations</h3>
                  </div>
                  <div className="grid gap-4">
                    {staleAlerts.map((alert) => (
                      <div key={alert.id} className="bg-error-container/5 border border-error/20 rounded-2xl p-4 transition-all hover:border-error/40">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-error uppercase tracking-widest">{alert.priority} Priority</span>
                          <span className="text-[10px] text-on-surface-variant font-medium">{new Date(alert.created_at).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-sm font-bold text-on-surface mb-2">{alert.title}</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed mb-4">{alert.body}</p>
                        {alert.draft_en && (
                          <div className="bg-white border border-outline-variant/30 rounded-xl p-3 space-y-2">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary mb-1">
                              <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                              AI Recommended Action
                            </div>
                            <p className="text-xs font-medium text-on-surface italic leading-relaxed">"{alert.draft_en}"</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* High-Fidelity Message History */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">chat_bubble</span>
                    <h3 className="text-sm font-black font-headline uppercase tracking-widest text-on-surface">Live Thread Preview</h3>
                  </div>
                  {deal.contact && (
                    <Link 
                      href={`/inbox/${deal.contact.id}`}
                      className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      Open Full Conversation
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </Link>
                  )}
                </div>

                <div className="space-y-6 max-h-[400px] overflow-y-auto px-1 scrollbar-hide">
                  {deal.messages.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-xs text-on-surface-variant">No message history available for this deal.</p>
                    </div>
                  ) : (
                    deal.messages.map((msg, idx) => {
                      const isInbound = msg.direction === 'INBOUND'
                      return (
                        <div key={msg.id} className="space-y-2">
                          {isInbound && msg.intent && (
                            <div className="flex justify-center mb-4">
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-container/30 border border-primary-fixed rounded-full">
                                <span className="material-symbols-outlined text-primary text-[14px]">psychology</span>
                                <span className="text-[10px] font-bold text-primary">AI analyzed intent: {msg.intent.replace(/_/g, ' ')}</span>
                              </div>
                            </div>
                          )}
                          <div className={`flex gap-3 max-w-[90%] ${isInbound ? '' : 'ml-auto flex-row-reverse'}`}>
                            <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${isInbound ? 'bg-surface-container' : 'bg-primary shadow-md shadow-primary/20'}`}>
                              <span className={`material-symbols-outlined text-[16px] ${isInbound ? 'text-slate-400' : 'text-white'}`} style={!isInbound ? { fontVariationSettings: "'FILL' 1" } : {}}>
                                {isInbound ? 'person' : 'smart_toy'}
                              </span>
                            </div>
                            <div className={`flex flex-col gap-1 ${isInbound ? 'items-start' : 'items-end'}`}>
                              <div className={`p-4 shadow-sm border ${
                                isInbound 
                                  ? 'bg-white border-outline-variant rounded-2xl rounded-tl-none' 
                                  : 'bg-primary border-primary text-white rounded-2xl rounded-tr-none'
                              }`}>
                                <p className="text-xs leading-relaxed font-medium">{msg.content}</p>
                              </div>
                              <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest px-1">
                                {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* CRM Tasks Bento Section */}
              <div className="pt-6 border-t border-outline-variant">
                <DealTaskList
                  dealId={deal.id}
                  tasks={deal.tasks}
                  apiUrl={apiUrl}
                  onUpdate={handleTaskUpdate}
                />
              </div>

              {/* Lost Reason if applicable */}
              {deal.lost_reason && (
                <div className="p-6 bg-error-container/10 border border-error/30 rounded-3xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-error text-[20px]">cancel</span>
                    <h4 className="text-sm font-black font-headline uppercase tracking-widest text-error">Lost Reason & Analysis</h4>
                  </div>
                  <p className="text-sm font-medium text-on-surface leading-relaxed">{deal.lost_reason}</p>
                </div>
              )}
            </div>

            {/* Premium Footer Actions */}
            <div className="p-8 bg-surface-container-lowest border-t border-outline-variant mt-auto">
              <div className="flex gap-3">
                <button 
                  onClick={() => onOpenChange(false)}
                  className="flex-1 py-3 px-4 border border-outline-variant rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container transition-colors"
                >
                  Dismiss
                </button>
                {deal.contact && (
                  <Link 
                    href={`/inbox/${deal.contact.id}`}
                    className="flex-[2] py-3 px-4 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dim transition-all text-center shadow-lg shadow-primary/25"
                  >
                    Open Interaction Hub
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
