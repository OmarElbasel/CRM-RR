'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Bell, HelpCircle, Search } from 'lucide-react'

export function TopNavbar() {
  return (
    <header className="flex justify-between items-center px-6 h-16 w-full z-40 bg-paper border-b border-ds-line font-headline antialiased sticky top-0">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ds-text-3 text-sm" />
          <input 
            className="pl-10 pr-4 py-1.5 bg-paper-2 border border-ds-line rounded-[10px] text-sm focus:ring-2 focus:ring-ds-primary/20 w-64 outline-none transition-all text-ds-text placeholder:text-ds-text-3" 
            placeholder="Search..." 
            type="text" 
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-ds-line pr-6">
          <button className="text-ds-text-2 hover:bg-paper-2 p-2 rounded-[10px] transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-ds-accent rounded-full ring-2 ring-paper"></span>
          </button>
          <button className="text-ds-text-2 hover:bg-paper-2 p-2 rounded-[10px] transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9 rounded-full',
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
