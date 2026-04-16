'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export function TopNavbar() {
  return (
    <header className="flex justify-between items-center px-6 h-16 w-full z-40 bg-white border-b border-slate-200 font-headline antialiased sticky top-0">
      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input className="pl-10 pr-4 py-1.5 bg-slate-50 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500/20 w-64 outline-none transition-all" placeholder="Search orders..." type="text" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-slate-200 pr-6">
          <button className="text-slate-600 hover:bg-slate-50 p-2 rounded-full transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-error rounded-full ring-2 ring-white"></span>
          </button>
          <button className="text-slate-600 hover:bg-slate-50 p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-slate-900 leading-tight">Saud Al-Rawaj</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Merchant Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-indigo-100 overflow-hidden shadow-sm flex items-center justify-center">
             <UserButton
               afterSignOutUrl="/"
               appearance={{
                 elements: {
                   avatarBox: 'w-10 h-10',
                 },
               }}
             />
          </div>
        </div>
      </div>
    </header>
  )
}
