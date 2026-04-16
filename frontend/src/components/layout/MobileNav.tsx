'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { NAV_ITEMS } from './Sidebar'
import { isEnabled } from '@/lib/flags'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors" />}>
              <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-slate-900 border-none">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            {/* Logo */}
            <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
              <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                <div className="w-8 h-8 bg-brand-primary rounded flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                </div>
                <div>
                  <div className="text-xl font-bold text-white tracking-tight">Rawaj</div>
                  <div className="text-slate-400 text-[10px] uppercase tracking-widest leading-none">AI Engine</div>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-md px-3 py-2 flex items-center gap-3 transition-colors active:scale-95 transition-transform ${
                      isActive 
                        ? 'bg-brand-primary text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
            
            <div className="mt-auto p-4 border-t border-slate-800 bg-slate-900/50">
               <Link 
                 href="/dashboard/settings" 
                 onClick={() => setOpen(false)}
                 className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-md px-3 py-2 flex items-center gap-3 transition-colors"
               >
                 <span className="material-symbols-outlined">person</span>
                 <span className="font-medium text-sm">Account Settings</span>
               </Link>
            </div>
          </SheetContent>
        </Sheet>

        {/* Center logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-primary rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          </div>
          <span className="text-base font-black text-brand-primary font-headline uppercase tracking-tight">Rawaj AI</span>
        </Link>

        {/* Placeholder for notification bell if needed or just empty space to keep balance */}
        <div className="w-9 h-9 flex items-center justify-center text-slate-400">
           <span className="material-symbols-outlined">notifications</span>
        </div>
      </div>
    </div>
  )
}
