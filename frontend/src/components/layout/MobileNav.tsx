'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, Sparkles, Inbox, GitBranch, ShoppingCart, BookOpen, Calendar, Share2, Settings } from 'lucide-react'

const NAV_GROUPS = [
  {
    label: 'Workspace',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'AI Generator', href: '/dashboard/generate', icon: Sparkles },
      { label: 'Inbox', href: '/inbox', icon: Inbox },
      { label: 'Pipeline', href: '/pipeline', icon: GitBranch },
      { label: 'Orders', href: '/orders', icon: ShoppingCart },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { label: 'Content', href: '/content', icon: BookOpen },
      { label: 'Scheduler', href: '/scheduler', icon: Calendar },
      { label: 'Ads', href: '/ads', icon: Sparkles },
    ],
  },
  {
    label: 'Setup',
    items: [
      { label: 'Channels', href: '/channels', icon: Share2 },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-ink text-white rounded-lg"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-ink border-r border-ds-line-dark p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-[16px] font-bold text-[#EDEDF2] tracking-[-0.02em]">Rawaj</h1>
              <button onClick={() => setOpen(false)} className="text-[#B8B8C8]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-6">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="text-[10px] uppercase tracking-wider text-[#6A6A80] px-3 mb-1 font-semibold">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`py-2.5 px-3 flex items-center gap-3 transition-all duration-150 rounded-[10px] text-[13.5px] font-medium ${
                            isActive
                              ? 'bg-ds-primary/15 text-[#fff]'
                              : 'text-[#B8B8C8] hover:bg-white/[0.04] hover:text-[#fff]'
                          }`}
                        >
                          <Icon className="w-[18px] h-[18px]" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
