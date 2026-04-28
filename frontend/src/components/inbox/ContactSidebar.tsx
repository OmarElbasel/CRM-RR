'use client'

import Avatar from './Avatar'

interface ContactSidebarProps {
  contact: {
    id?: number
    name: string
    avatar_url?: string
    platform: string
    ai_score: number
  } | null
}

export function ContactSidebar({ contact }: ContactSidebarProps) {
  if (!contact) return null

  const displayName = contact.name?.trim() || `User ${contact.id ?? ''}`.trim()

  const scoreColor =
    contact.ai_score >= 70
      ? 'text-green-600'
      : contact.ai_score >= 40
        ? 'text-amber-600'
        : 'text-on-surface-variant'

  return (
    <aside className="w-80 h-full bg-white border-l border-outline-variant hidden xl:flex flex-col p-6 overflow-y-auto custom-scrollbar">
      <h3 className="text-[10px] font-black text-outline uppercase tracking-widest mb-6">Contact Details</h3>

      <div className="flex flex-col items-center mb-8 text-center">
        <div className="mb-3">
          <Avatar name={displayName} src={contact.avatar_url} size={80} className="shadow-sm" />
        </div>
        <h4 className="text-lg font-bold text-on-surface leading-tight">{displayName}</h4>
        <p className="text-xs text-on-surface-variant mt-1">{contact.platform}</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
          <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-2">AI Lead Score</label>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${scoreColor}`}>{contact.ai_score}</span>
            <span className="text-[10px] text-on-surface-variant">/ 100</span>
          </div>
        </div>

        <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
          <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Platform</label>
          <p className="text-sm font-semibold text-on-surface">{contact.platform}</p>
        </div>
      </div>
    </aside>
  )
}
