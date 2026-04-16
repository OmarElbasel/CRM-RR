'use client'

import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { TopNavbar } from './TopNavbar'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-on-surface flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile nav */}
      <MobileNav />

      {/* Main content area */}
      <main className="flex-1 flex flex-col lg:ms-64 pt-16 lg:pt-0 min-h-screen w-full relative min-w-0">
        <div className="hidden lg:block sticky top-0 z-40">
          <TopNavbar />
        </div>
        {/* Children components control their own inner padding & max-width containers in the new design */}
        {children}
      </main>
    </div>
  )
}
