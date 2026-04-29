'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Menu, X, LayoutDashboard, Sparkles, Inbox, GitBranch, ShoppingCart, BookOpen, Calendar, Share2, Settings } from 'lucide-react'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const tn = useTranslations('nav')
  const tg = useTranslations('nav_groups')

  const NAV_GROUPS = [
    {
      label: tg('workspace'),
      items: [
        { label: tn('dashboard'), href: '/dashboard', icon: LayoutDashboard },
        { label: tn('ai_generator'), href: '/dashboard/generate', icon: Sparkles },
        { label: tn('inbox'), href: '/inbox', icon: Inbox },
        { label: tn('pipeline'), href: '/pipeline', icon: GitBranch },
        { label: tn('orders'), href: '/orders', icon: ShoppingCart },
      ],
    },
    {
      label: tg('marketing'),
      items: [
        { label: tn('content'), href: '/content', icon: BookOpen },
        { label: tn('scheduler'), href: '/scheduler', icon: Calendar },
        { label: tn('ads'), href: '/ads', icon: Sparkles },
      ],
    },
    {
      label: tg('setup'),
      items: [
        { label: tn('channels'), href: '/channels', icon: Share2 },
        { label: tn('settings'), href: '/settings', icon: Settings },
      ],
    },
  ]

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 rtl:right-4 rtl:left-auto z-50 p-2 bg-ink text-white rounded-lg"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 rtl:right-0 rtl:left-auto top-0 h-full w-72 bg-ink border-r rtl:border-l rtl:border-r-0 border-ds-line-dark p-5 overflow-y-auto">
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
