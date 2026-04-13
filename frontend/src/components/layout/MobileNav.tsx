'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { NAV_GROUPS } from './Sidebar'
import { NotificationBell } from '@/components/ui/NotificationBell'
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
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" />}>
              <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
              <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">Rawaj</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              {NAV_GROUPS.map((group) => (
                <div key={group.label} className="mb-6">
                  <div className="px-3 mb-2 text-xs text-gray-400 uppercase tracking-wider font-medium">
                    {group.label}
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                          {item.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Center logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">R</span>
          </div>
          <span className="text-base font-semibold text-gray-900">Rawaj</span>
        </Link>

        {/* Notification bell */}
        <NotificationBell count={0} pipelineEnabled={isEnabled('PIPELINE')} />
      </div>
    </div>
  )
}
