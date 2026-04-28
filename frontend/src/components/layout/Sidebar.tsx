'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { OrganizationSwitcher } from '@clerk/nextjs'

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'AI Generator', href: '/dashboard/generate', icon: 'auto_awesome' },
  { label: 'Inbox', href: '/inbox', icon: 'inbox' },
  { label: 'Pipeline', href: '/pipeline', icon: 'account_tree' },
  { label: 'Orders', href: '/orders', icon: 'shopping_cart' },
  { label: 'Content', href: '/content', icon: 'auto_stories' },
  { label: 'Scheduler', href: '/scheduler', icon: 'calendar_month' },
  { label: 'Channels', href: '/channels', icon: 'share' },
  { label: 'Settings', href: '/dashboard/settings', icon: 'settings' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col z-50 bg-ink border-r border-ds-line-dark w-64 font-headline tracking-tight">
      {/* Logo */}
      <div className="p-5">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-[22px] h-[22px] rounded-[6px] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #C8FE5E, #594FBF)' }}>
            <div className="absolute inset-[3px] rounded-[4px] bg-ink" />
            <div className="absolute left-1/2 top-[3px] bottom-[3px] w-[2px] bg-[#C8FE5E] z-[1]" />
          </div>
          <div>
            <h1 className="text-[16px] font-bold text-[#EDEDF2] tracking-[-0.02em]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>Rawaj</h1>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`py-2.5 px-3 flex items-center gap-3 transition-all duration-150 rounded-[10px] text-[13.5px] font-medium ${
                isActive 
                  ? 'bg-ds-primary/15 text-[#fff]' 
                  : 'text-[#B8B8C8] hover:bg-white/[0.04] hover:text-[#fff]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 mt-auto">
        {/* Upgrade Card */}
        <div className="p-4 rounded-[14px] mb-4 border border-ds-line-dark relative overflow-hidden group" style={{ background: 'rgba(89,79,191,0.12)' }}>
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-ds-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[10px] text-ds-accent font-bold mb-1 uppercase tracking-[0.12em] relative z-10">PRO PLAN</p>
          <p className="text-xs text-[#8A8AA0] mb-3 relative z-10 leading-relaxed">Unlock more generations and priority support.</p>
          <Link 
            href="/dashboard/upgrade"
            className="w-full bg-ds-accent text-ds-accent-ink text-xs font-bold py-2 rounded-[10px] hover:brightness-105 transition-all text-center block relative z-10"
          >
            Upgrade to Pro
          </Link>
        </div>

        {/* Org Switcher */}
        <div className="mb-3">
          <OrganizationSwitcher
            hidePersonal
            createOrganizationMode="modal"
            appearance={{
              elements: {
                rootBox: 'w-full',
                organizationSwitcherTrigger: 'w-full bg-ink-2 text-[#B8B8C8] rounded-[10px] px-3 py-2 text-sm hover:bg-ink-3 transition-colors border border-ds-line-dark',
              },
            }}
          />
        </div>
        
        {/* Account & Logout */}
        <Link
          href="/dashboard/settings?tab=account"
          className="py-2 px-3 flex items-center gap-3 transition-colors text-sm rounded-[10px] text-[#B8B8C8] hover:text-[#fff] hover:bg-white/[0.04]"
        >
          <span className="material-symbols-outlined text-[20px]">person</span>
          <span className="font-medium">Account</span>
        </Link>
        <button className="w-full text-[#B8B8C8] py-2 px-3 flex items-center gap-3 hover:text-[#fff] hover:bg-white/[0.04] transition-all text-sm rounded-[10px] mt-0.5">
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
