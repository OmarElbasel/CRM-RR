'use client'

import React from 'react'

const CAMPAIGNS = [
  {
    name: 'Summer Sports Collection',
    platform: 'Meta',
    status: 'Active',
    spend: 'SAR 4,500',
    budget: 'SAR 10,000',
    percentage: 45,
    roas: '5.2x',
    clicks: '1,240',
    color: 'bg-blue-600',
    icon: 'facebook',
  },
  {
    name: 'TikTok Flash Sale — Q2',
    platform: 'TikTok',
    status: 'Active',
    spend: 'SAR 2,100',
    budget: 'SAR 5,000',
    percentage: 42,
    roas: '3.8x',
    clicks: '2,850',
    color: 'bg-slate-900',
    icon: 'music_note',
  },
  {
    name: 'Artisan Coffee Launch',
    platform: 'Meta',
    status: 'Paused',
    spend: 'SAR 0',
    budget: 'SAR 2,500',
    percentage: 0,
    roas: '-',
    clicks: '-',
    color: 'bg-blue-600',
    icon: 'facebook',
  },
]

export function CampaignList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {CAMPAIGNS.map((campaign, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-xl hover:-translate-y-1">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${campaign.color} rounded-xl flex items-center justify-center text-white`}>
                  <span className="material-symbols-outlined text-xl">{campaign.icon}</span>
                </div>
                <div>
                  <h4 className="font-headline font-black text-sm text-slate-900 line-clamp-1">{campaign.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{campaign.platform} Ads</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter border ${
                campaign.status === 'Active' 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                  : 'bg-slate-50 text-slate-400 border-slate-100'
              }`}>
                {campaign.status}
              </span>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Spend</span>
                  <span className="text-slate-900">{campaign.spend} / {campaign.budget}</span>
               </div>
               <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${campaign.color}`} 
                    style={{ width: `${campaign.percentage}%` }}
                  ></div>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">ROAS</p>
                     <p className="font-headline font-black text-slate-900">{campaign.roas}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Clicks</p>
                     <p className="font-headline font-black text-slate-900">{campaign.clicks}</p>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="mt-auto px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <button className="text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">insights</span>
                Details
             </button>
             <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                <span className="material-symbols-outlined text-sm">more_horiz</span>
             </button>
          </div>
        </div>
      ))}
    </div>
  )
}
