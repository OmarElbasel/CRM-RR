'use client'

import React from 'react'

const PERFORMANCE_METRICS = [
  {
    label: 'Total ROAS',
    value: '4.2x',
    trend: '+12%',
    isPositive: true,
    icon: 'trending_up',
    description: 'Across all active channels',
    className: 'col-span-12 lg:col-span-4 bg-indigo-600 text-white shadow-indigo-100',
  },
  {
    label: 'Total Ad Spend',
    value: 'SAR 12,450',
    trend: '-5%',
    isPositive: true,
    icon: 'payments',
    description: 'Last 30 days',
    className: 'col-span-12 md:col-span-6 lg:col-span-4 bg-white text-slate-900',
  },
  {
    label: 'Total Conversions',
    value: '1,240',
    trend: '+8%',
    isPositive: true,
    icon: 'shopping_cart_checkout',
    description: 'Simulated tracking',
    className: 'col-span-12 md:col-span-6 lg:col-span-4 bg-white text-slate-900',
  },
  {
    label: 'Avg. CTR',
    value: '2.84%',
    trend: '+0.5%',
    isPositive: true,
    icon: 'ads_click',
    description: 'Meta & TikTok combined',
    className: 'col-span-12 md:col-span-6 lg:col-span-4 bg-white text-slate-900',
  },
  {
    label: 'Cost Per Click',
    value: 'SAR 1.12',
    trend: '+2%',
    isPositive: false,
    icon: 'touch_app',
    description: 'Optimization required',
    className: 'col-span-12 md:col-span-6 lg:col-span-4 bg-white text-slate-900',
  },
  {
    label: 'Impression Share',
    value: '68%',
    trend: '+15%',
    isPositive: true,
    icon: 'visibility',
    description: 'Target audience reach',
    className: 'col-span-12 md:col-span-12 lg:col-span-4 bg-white text-slate-900',
  },
]

export function AdsPerformance() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {PERFORMANCE_METRICS.map((metric, i) => (
        <div 
          key={i} 
          className={`p-6 rounded-2xl border border-slate-200 flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1 group relative overflow-hidden ${metric.className}`}
        >
          {/* Subtle Background Pattern for Indigo Card */}
          {metric.className.includes('indigo-600') && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full -mr-16 -mt-16 opacity-20 blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
          )}

          <div className="flex justify-between items-start mb-4">
            <div className={`p-2.5 rounded-xl flex items-center justify-center ${metric.className.includes('indigo-600') ? 'bg-indigo-500 text-white' : 'bg-slate-50 text-slate-500'}`}>
              <span className="material-symbols-outlined">{metric.icon}</span>
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold font-headline ${
              metric.isPositive 
                ? (metric.className.includes('indigo-600') ? 'text-indigo-200' : 'text-emerald-600') 
                : 'text-rose-500'
            }`}>
              <span className="material-symbols-outlined text-sm">{metric.isPositive ? 'trending_up' : 'trending_down'}</span>
              {metric.trend}
            </div>
          </div>

          <div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${metric.className.includes('indigo-600') ? 'text-indigo-200' : 'text-slate-400'}`}>
              {metric.label}
            </p>
            <h3 className="text-3xl font-headline font-black mb-1 tabular-nums">{metric.value}</h3>
            <p className={`text-xs font-medium ${metric.className.includes('indigo-600') ? 'text-indigo-100 opacity-80' : 'text-slate-500'}`}>
              {metric.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
