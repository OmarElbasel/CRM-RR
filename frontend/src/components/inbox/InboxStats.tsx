'use client'

import React from 'react'

export function InboxStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="p-4 bg-white border border-outline-variant rounded-xl shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Active Chats</span>
          <span className="material-symbols-outlined text-primary text-sm">bolt</span>
        </div>
        <div className="text-2xl font-black text-on-surface font-headline">42</div>
        <div className="text-[10px] font-medium text-secondary flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px]">trending_up</span>
          +12% from yesterday
        </div>
      </div>

      <div className="p-4 bg-white border border-outline-variant rounded-xl shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Avg. AI Score</span>
          <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
        </div>
        <div className="text-2xl font-black text-on-surface font-headline">78.4</div>
        <div className="text-[10px] font-medium text-secondary flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px]">trending_up</span>
          Strong intent signals
        </div>
      </div>

      <div className="p-4 bg-white border border-outline-variant rounded-xl shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Unread</span>
          <span className="material-symbols-outlined text-primary text-sm">mark_chat_unread</span>
        </div>
        <div className="text-2xl font-black text-on-surface font-headline">09</div>
        <div className="text-[10px] font-medium text-on-surface-variant flex items-center gap-1">
          Action required soon
        </div>
      </div>

      <div className="p-4 bg-primary rounded-xl shadow-lg shadow-primary/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-primary-container uppercase tracking-widest">AI Credits</span>
          <span className="material-symbols-outlined text-primary-container text-sm">auto_awesome</span>
        </div>
        <div className="text-2xl font-black text-white font-headline">1.2k</div>
        <div className="text-[10px] font-medium text-primary-container flex items-center gap-1">
          Renews in 4 days
        </div>
      </div>
    </div>
  )
}
