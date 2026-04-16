'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { OrganizationSwitcher } from '@clerk/nextjs'
import { isEnabled } from '@/lib/flags'

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'AI Generator', href: '/dashboard/generate', icon: 'auto_awesome' },
  { label: 'Inbox', href: '/inbox', icon: 'inbox' },
  { label: 'Pipeline', href: '/pipeline', icon: 'account_tree' },
  { label: 'Orders', href: '/orders', icon: 'shopping_cart' },
  { label: 'Ads', href: '/ads', icon: 'campaign' },
  { label: 'Content', href: '/content', icon: 'auto_stories' },
  { label: 'Scheduler', href: '/scheduler', icon: 'calendar_month' },
  { label: 'Channels', href: '/channels', icon: 'share' },
  { label: 'Settings', href: '/dashboard/settings', icon: 'settings' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col z-50 bg-slate-950 border-r border-slate-800 w-64 shadow-xl font-headline tracking-tight">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white group-active:scale-95 transition-transform">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-white">Rawaj</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">AI Growth Engine</p>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 px-2 mt-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`py-3 px-4 flex items-center gap-3 transition-all duration-200 ease-in-out border-l-4 ${
                isActive 
                  ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500' 
                  : 'text-slate-400 border-transparent hover:bg-slate-900 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-4 rounded-2xl mb-4 border border-indigo-500/20 relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[10px] text-indigo-400 font-bold mb-1 uppercase tracking-widest relative z-10">PRO PLAN</p>
          <p className="text-xs text-slate-400 mb-3 relative z-10 leading-relaxed">Unlock advanced AI sales insights & automation.</p>
          <Link 
            href="/dashboard/upgrade"
            className="w-full bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/40 text-center block relative z-10"
          >
            Upgrade to Pro
          </Link>
        </div>

        <div className="mb-3">
          <OrganizationSwitcher
            hidePersonal
            createOrganizationMode="modal"
            appearance={{
              elements: {
                rootBox: 'w-full',
                organizationSwitcherTrigger: 'w-full bg-slate-800 text-slate-200 rounded-xl px-3 py-2 text-sm hover:bg-slate-700 transition-colors',
              },
            }}
          />
        </div>
        <Link
          href="/dashboard/settings?tab=account"
          className="py-2.5 px-4 flex items-center gap-3 transition-colors text-sm group rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
        >
          <span className="material-symbols-outlined text-[20px]">person</span>
          <span className="font-medium">Account</span>
        </Link>
        <button className="w-full text-slate-400 py-2.5 px-4 flex items-center gap-3 hover:text-white hover:bg-slate-900 transition-all text-sm rounded-xl mt-1">
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
