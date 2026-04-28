'use client'

import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { TopNavbar } from './TopNavbar'
import { DemoModeBanner } from '@/components/ui/DemoModeBanner'
import { CommandPaletteGlobal } from '@/components/ui/CommandPaletteGlobal'
import { Toaster } from '@/components/ui/Toaster'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-paper text-ds-text flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile nav */}
      <MobileNav />

      {/* Main content area */}
      <main className="flex-1 flex flex-col lg:ms-64 pt-16 lg:pt-0 min-h-screen w-full relative min-w-0">
        <DemoModeBanner />
        <div className="hidden lg:block sticky top-0 z-40">
          <TopNavbar />
        </div>
        {children}
      </main>
      <CommandPaletteGlobal />
      <Toaster />
    </div>
  )
}
