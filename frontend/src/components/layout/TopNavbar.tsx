'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Search, HelpCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LocaleToggle } from '@/components/ui/LocaleToggle'
import { useCommandPalette } from '@/hooks/useCommandPalette'

export function TopNavbar() {
  const { toggle } = useCommandPalette()

  return (
    <header className="flex justify-between items-center px-6 h-16 w-full z-40 bg-paper border-b border-ds-line font-headline antialiased sticky top-0">
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="relative flex items-center gap-2 pl-10 pr-4 py-1.5 bg-paper-2 border border-ds-line rounded-[10px] text-sm w-64 text-left text-ds-text-3 hover:border-ds-line-2 transition-colors"
          aria-label="Open command palette"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ds-text-3 text-sm w-4 h-4" />
          <span>Search...</span>
          <kbd className="ml-auto text-[10px] bg-paper border border-ds-line rounded px-1.5 py-0.5 text-ds-text-3 hidden sm:inline-block">
            ⌘K
          </kbd>
        </button>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-ds-line pr-6">
          <ThemeToggle />
          <LocaleToggle />
          <Link
            href="/docs"
            target="_blank"
            className="text-ds-text-2 hover:bg-paper-2 p-2 rounded-[10px] transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9 rounded-full',
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
