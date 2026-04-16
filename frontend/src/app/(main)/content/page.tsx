'use client'

import { FileText } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { PlaceholderFeature } from '@/components/ui/PlaceholderFeature'
import { isEnabled } from '@/lib/flags'
import { CaptionGenerator } from '@/components/content/CaptionGenerator'
import { AdCopyWriter } from '@/components/content/AdCopyWriter'
import { BroadcastComposer } from '@/components/content/BroadcastComposer'
import { SeasonalTemplateGallery } from '@/components/content/SeasonalTemplateGallery'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ContentPage() {
  if (!isEnabled('CONTENT_ASSISTANT')) {
    return (
      <>
        <PageHeader title="Content" />
        <PlaceholderFeature
          icon={<FileText />}
          title="Content"
          description="AI-generated social media content with brand voice consistency."
          phase="Phase 9"
        />
      </>
    )
  }

  return (
    <div className="w-full flex flex-col flex-1 bg-background">
      <Tabs defaultValue="captions" className="w-full flex flex-col">
        {/* Sticky Header with Internal TabsList */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-8 h-16 flex justify-between items-center font-headline shrink-0">
          <div className="flex items-center gap-4 h-full">
            <h2 className="text-xl font-bold text-indigo-700">Content Assistant</h2>
            <div className="h-4 w-px bg-slate-300"></div>
            <TabsList className="bg-transparent border-none flex gap-6 h-full p-0">
              <TabsTrigger 
                value="captions" 
                className="data-[state=active]:text-indigo-700 data-[state=active]:border-b-2 data-[state=active]:border-indigo-700 data-[state=active]:shadow-none rounded-none py-5 px-2 bg-transparent border-none text-slate-600 font-bold hover:text-indigo-600 transition-all text-sm h-full"
              >
                Captions
              </TabsTrigger>
              <TabsTrigger 
                value="ad-copy" 
                className="data-[state=active]:text-indigo-700 data-[state=active]:border-b-2 data-[state=active]:border-indigo-700 data-[state=active]:shadow-none rounded-none py-5 px-2 bg-transparent border-none text-slate-600 font-bold hover:text-indigo-600 transition-all text-sm h-full"
              >
                Ad Copy
              </TabsTrigger>
              <TabsTrigger 
                value="broadcast" 
                className="data-[state=active]:text-indigo-700 data-[state=active]:border-b-2 data-[state=active]:border-indigo-700 data-[state=active]:shadow-none rounded-none py-5 px-2 bg-transparent border-none text-slate-600 font-bold hover:text-indigo-600 transition-all text-sm h-full"
              >
                Broadcast
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="p-8 max-w-7xl mx-auto w-full flex-1">
          <TabsContent value="captions" className="mt-0 ring-0 focus-visible:ring-0 outline-none"><CaptionGenerator /></TabsContent>
          <TabsContent value="ad-copy" className="mt-0 ring-0 focus-visible:ring-0 outline-none"><AdCopyWriter /></TabsContent>
          <TabsContent value="broadcast" className="mt-0 ring-0 focus-visible:ring-0 outline-none"><BroadcastComposer /></TabsContent>
        </main>
      </Tabs>
    </div>
  )
}
