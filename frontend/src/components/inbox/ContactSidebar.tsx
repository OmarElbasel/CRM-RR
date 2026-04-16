'use client'

import React from 'react'

interface ContactSidebarProps {
  contact: {
    name: string
    platform: string
    ai_score: number
  } | null
}

export function ContactSidebar({ contact }: ContactSidebarProps) {
  if (!contact) return null

  return (
    <aside className="w-80 h-full bg-white border-l border-outline-variant hidden xl:flex flex-col p-6 overflow-y-auto custom-scrollbar">
      <h3 className="text-[10px] font-black text-outline uppercase tracking-widest mb-6">Contact Details</h3>
      
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-20 h-20 rounded-full border-4 border-surface-container-low mb-3 overflow-hidden shadow-sm relative">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDYHGKJSmZfuEGoMuUwvmXfaPDNx40kgtiChp_WL0Y3C6vwe5O0019RShA8noT3V3d3mY5FpnQlhCI6e_Yf3qQ7fjbbBEhXJGn5JSRibjRFP_cOH2WgSQ6mMR5ARlNB2gTVodB6ZL1ptGbUE_HZWpqkegSWrVrMP1Nei-Z0K5ngmcRnRMFJvZpzjfORu24q53Lbd5CKz0ZGmculSBfY_X_OkUgIAyGsO9g4bx3p_-3SxdeOAPxq_AQiqSSI2CD0RYbDimdbZV7nOof" 
            alt={contact.name}
          />
        </div>
        <h4 className="text-lg font-bold text-on-surface leading-tight">{contact.name}</h4>
        <p className="text-xs text-on-surface-variant">Riyadh, Saudi Arabia</p>
      </div>

      <div className="space-y-6">
        {/* Info Cards */}
        <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
          <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Customer Value</label>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-primary">SAR 12,450</span>
            <span className="text-[10px] text-green-600 font-bold">+12%</span>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-3">Recent Activity</label>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary text-lg">shopping_bag</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">Purchased Smart Hub</p>
                <p className="text-[10px] text-on-surface-variant">2 weeks ago • SAR 899</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-tertiary text-lg">campaign</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">Viewed Email Campaign</p>
                <p className="text-[10px] text-on-surface-variant">Yesterday • Summer Sale</p>
              </div>
            </li>
          </ul>
        </div>

        <div>
           <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-3">Assigned Tags</label>
           <div className="flex flex-wrap gap-2">
             <span className="px-2 py-1 bg-surface-container text-on-surface-variant text-[10px] font-medium rounded">Wholesale</span>
             <span className="px-2 py-1 bg-surface-container text-on-surface-variant text-[10px] font-medium rounded">VIP</span>
             <span className="px-2 py-1 bg-surface-container text-on-surface-variant text-[10px] font-medium rounded">Electronics</span>
             <button className="px-2 py-1 border border-dashed border-outline-variant text-outline text-[10px] rounded hover:border-primary hover:text-primary transition-colors">+ Add</button>
           </div>
        </div>

        <div className="pt-6 border-t border-outline-variant/30">
          <button className="w-full py-3 bg-on-surface text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
             <span className="material-symbols-outlined text-sm">edit</span>
             Update Profile
          </button>
        </div>
      </div>
    </aside>
  )
}
