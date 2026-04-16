'use client'

import React from 'react'

export interface ChannelProps {
  id: string
  name: string
  description: string
  icon: string
  logoUrl?: string
  color: string
  bg: string
  status: 'connected' | 'disconnected'
  syncInfo?: string
  platform: string
}

interface ChannelCardProps {
  channel: ChannelProps
  onConnect: (id: string) => void
  onDisconnect: (id: string) => void
}

export function ChannelCard({ channel, onConnect, onDisconnect }: ChannelCardProps) {
  const isConnected = channel.status === 'connected'

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden group">
      {/* Status Badge */}
      <div className="absolute top-0 right-0 p-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
          isConnected 
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
            : 'bg-slate-100 text-slate-500 border border-slate-200'
        }`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <div className="mb-6">
        <div className={`w-14 h-14 rounded-2xl ${channel.bg} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300 overflow-hidden`}>
          {channel.logoUrl ? (
            <img src={channel.logoUrl} alt={channel.name} className="w-10 h-10 object-contain" />
          ) : (
            <span className={`material-symbols-outlined text-3xl ${channel.color}`} style={{ fontVariationSettings: "'FILL' 0" }}>
              {channel.icon}
            </span>
          )}
        </div>
        <h3 className="text-xl font-headline font-black text-slate-900 dark:text-white mb-1">{channel.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          {channel.description}
        </p>
      </div>

      <div className="mt-auto space-y-4">
        {isConnected ? (
          <>
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              {channel.syncInfo || 'Everything is up to date'}
            </div>
            <button 
              onClick={() => onDisconnect(channel.id)}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-all active:scale-[0.98]"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button 
            onClick={() => onConnect(channel.id)}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
          >
            Connect Account
          </button>
        )}
      </div>

      {/* Subtle Background Platform Icon */}
      <div className={`absolute -bottom-4 -right-4 opacity-[0.03] text-8xl pointer-events-none group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-500 ${channel.color}`}>
        <span className="material-symbols-outlined">{channel.icon}</span>
      </div>
    </div>
  )
}
