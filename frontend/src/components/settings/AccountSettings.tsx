'use client'

import React from 'react'
import { UserProfile, useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

export function AccountSettings() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-8 flex items-center justify-between group">
        <div className="flex items-center gap-6">
          <div className="relative group/avatar">
            <img 
              src={user?.imageUrl} 
              alt={user?.fullName || 'User'} 
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-50 shadow-lg group-hover/avatar:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
               <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-headline font-black text-slate-900 mb-1">{user?.fullName || 'User'}</h3>
            <p className="text-slate-500 font-medium">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2 text-right">
           <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              Active Session
           </span>
           <p className="text-xs text-slate-400 font-medium">Last login: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Clerk Profile Management Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
           <h3 className="font-headline font-black text-lg text-slate-900">Security & Preferences</h3>
           <p className="text-sm text-slate-500 font-medium">Manage your security settings, sessions, and notification preferences through our identity provider.</p>
        </div>
        <div className="p-4 bg-slate-50/50">
            {/* We provide a clean container for the Clerk UserProfile or just links to it if we want to keep it simple */}
            {/* For the "Premium" feel, sometimes it's better to show specific cards rather than the full Clerk widget if it doesn't match the design perfectly, but here we'll use a link to the dedicated profile page or show the widget inline if possible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                     <span className="material-symbols-outlined">lock</span>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Password & Security</h4>
                  <p className="text-xs text-slate-500 font-medium mb-6 leading-relaxed">Change your password or manage multi-factor authentication (MFA) to keep your account safe.</p>
                  <button className="text-indigo-600 text-xs font-bold hover:underline">Manage Security →</button>
               </div>
               
               <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                     <span className="material-symbols-outlined">devices</span>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Session Management</h4>
                  <p className="text-xs text-slate-500 font-medium mb-6 leading-relaxed">View all active devices and sessions currently signed into your Rawaj account.</p>
                  <button className="text-purple-600 text-xs font-bold hover:underline">View Sessions →</button>
               </div>
            </div>
        </div>
      </div>
    </div>
  )
}
