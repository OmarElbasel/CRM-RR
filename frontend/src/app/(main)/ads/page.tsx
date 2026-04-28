'use client'

import { AdCopyWriter } from '@/components/content/AdCopyWriter'

export default function AdsPage() {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col bg-background">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-8 h-16 flex justify-between items-center font-headline shrink-0">
        <div className="flex items-center gap-4 h-full">
          <h2 className="text-xl font-bold text-indigo-700">Ad Copy</h2>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 space-y-8">
        <AdCopyWriter />
      </main>
    </div>
  )
}
