'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard,
  Sparkles,
  Code2,
  Inbox,
  GitBranch,
  ShoppingBag,
  BarChart3,
  Megaphone,
  FileText,
  CalendarDays,
  Key,
  Zap,
  Settings,
  Share2,
} from 'lucide-react'

export const NAV_GROUPS = [
  {
    label: 'Core',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Generate', href: '/dashboard/generate', icon: Sparkles },
      { label: 'Embed', href: '/dashboard/embed', icon: Code2 },
    ],
  },
  {
    label: 'Inbox & CRM',
    items: [
      { label: 'Inbox', href: '/inbox', icon: Inbox },
      { label: 'Pipeline', href: '/pipeline', icon: GitBranch },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { label: 'Orders', href: '/orders', icon: ShoppingBag },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { label: 'Ads', href: '/ads', icon: Megaphone },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Content', href: '/content', icon: FileText },
      { label: 'Scheduler', href: '/scheduler', icon: CalendarDays },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'API Keys', href: '/dashboard/api-keys', icon: Key },
      { label: 'Upgrade', href: '/dashboard/upgrade', icon: Zap },
      { label: 'Settings', href: '/dashboard/settings', icon: Settings },
      { label: 'Channels', href: '/settings/channels', icon: Share2 },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 start-0 z-30 w-64 bg-white border-e border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-lg font-display font-semibold text-gray-900">Rawaj</span>
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
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 border-l-2 border-indigo-600 rounded-l-none pl-2.5'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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

      {/* User avatar */}
      <div className="p-4 border-t border-gray-100 flex items-center gap-3">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'w-8 h-8',
            },
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-700 truncate">My Account</p>
        </div>
      </div>
    </aside>
  )
}
