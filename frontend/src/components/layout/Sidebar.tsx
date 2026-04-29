'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useClerk, OrganizationSwitcher } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import {
  LayoutDashboard,
  Sparkles,
  Inbox,
  GitBranch,
  ShoppingCart,
  BookOpen,
  Calendar,
  Share2,
  Settings,
  User,
  LogOut,
} from 'lucide-react'

const NAV_GROUPS = [
  {
    labelKey: 'workspace',
    items: [
      { labelKey: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
      { labelKey: 'ai_generator', href: '/dashboard/generate', icon: Sparkles },
      { labelKey: 'inbox', href: '/inbox', icon: Inbox },
      { labelKey: 'pipeline', href: '/pipeline', icon: GitBranch },
      { labelKey: 'orders', href: '/orders', icon: ShoppingCart },
    ],
  },
  {
    labelKey: 'marketing',
    items: [
      { labelKey: 'content', href: '/content', icon: BookOpen },
      { labelKey: 'scheduler', href: '/scheduler', icon: Calendar },
      { labelKey: 'ads', href: '/ads', icon: Sparkles },
    ],
  },
  {
    labelKey: 'setup',
    items: [
      { labelKey: 'channels', href: '/channels', icon: Share2 },
      { labelKey: 'settings', href: '/settings', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { signOut } = useClerk()
  const t = useTranslations('nav')
  const tGroups = useTranslations('nav_groups')

  return (
    <aside className="fixed left-0 rtl:right-0 rtl:left-auto top-0 h-full flex flex-col z-50 bg-ink border-r rtl:border-l rtl:border-r-0 border-ds-line-dark w-64 font-headline tracking-tight">
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
      <nav className="flex-1 px-3 mt-2 space-y-4 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.labelKey}>
            <p className="text-[10px] uppercase tracking-wider text-[#6A6A80] px-3 mb-1 font-semibold">
              {tGroups(group.labelKey)}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                const Icon = item.icon
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
                    <Icon className="w-[18px] h-[18px]" />
                    <span>{t(item.labelKey)}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 mt-auto">
        {/* Upgrade Card */}
        <div className="p-4 rounded-[14px] mb-4 border border-ds-line-dark relative overflow-hidden group" style={{ background: 'rgba(89,79,191,0.12)' }}>
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-ds-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[10px] text-ds-accent font-bold mb-1 uppercase tracking-[0.12em] relative z-10">PRO PLAN</p>
          <p className="text-xs text-[#8A8AA0] mb-3 relative z-10 leading-relaxed">{t('upgrade_desc')}</p>
          <Link
            href="/settings?tab=billing"
            className="w-full bg-ds-accent text-ds-accent-ink text-xs font-bold py-2 rounded-[10px] hover:brightness-105 transition-all text-center block relative z-10"
          >
            {t('upgrade_cta')}
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
          href="/settings?tab=account"
          className="py-2 px-3 flex items-center gap-3 transition-colors text-sm rounded-[10px] text-[#B8B8C8] hover:text-[#fff] hover:bg-white/[0.04]"
        >
          <User className="w-[18px] h-[18px]" />
          <span className="font-medium">{t('account')}</span>
        </Link>
        <button
          onClick={() => signOut({ redirectUrl: '/' })}
          className="w-full text-[#B8B8C8] py-2 px-3 flex items-center gap-3 hover:text-[#fff] hover:bg-white/[0.04] transition-all text-sm rounded-[10px] mt-0.5"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span className="font-medium">{t('logout')}</span>
        </button>
      </div>
    </aside>
  )
}
