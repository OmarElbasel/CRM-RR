'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdCopyWriter } from '@/components/content/AdCopyWriter'
import { AdsPerformance } from '@/components/ads/AdsPerformance'
import { CampaignList } from '@/components/ads/CampaignList'

export default function AdsPage() {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col bg-background">
      <Tabs defaultValue="performance" className="w-full flex flex-col">
        {/* Sticky Header with Internal TabsList */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-8 h-16 flex justify-between items-center font-headline shrink-0">
          <div className="flex items-center gap-4 h-full">
            <h2 className="text-xl font-bold text-indigo-700">Ads Center</h2>
            <div className="h-4 w-px bg-slate-300"></div>
            <TabsList className="bg-transparent border-none flex gap-6 h-full p-0">
              <TabsTrigger 
                value="performance" 
                className="data-[state=active]:text-indigo-700 data-[state=active]:border-b-2 data-[state=active]:border-indigo-700 data-[state=active]:shadow-none rounded-none py-5 px-2 bg-transparent border-none text-slate-600 font-bold hover:text-indigo-600 transition-all text-sm h-full"
              >
                Performance
              </TabsTrigger>
              <TabsTrigger 
                value="creative" 
                className="data-[state=active]:text-indigo-700 data-[state=active]:border-b-2 data-[state=active]:border-indigo-700 data-[state=active]:shadow-none rounded-none py-5 px-2 bg-transparent border-none text-slate-600 font-bold hover:text-indigo-600 transition-all text-sm h-full"
              >
                Creative Studio
              </TabsTrigger>
              <TabsTrigger 
                value="campaigns" 
                className="data-[state=active]:text-indigo-700 data-[state=active]:border-b-2 data-[state=active]:border-indigo-700 data-[state=active]:shadow-none rounded-none py-5 px-2 bg-transparent border-none text-slate-600 font-bold hover:text-indigo-600 transition-all text-sm h-full"
              >
                Campaigns
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-all">
              <span className="material-symbols-outlined text-sm">link</span>
              Connect Account
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="p-8 max-w-7xl mx-auto w-full flex-1 space-y-8">
          <TabsContent value="performance" className="mt-0 ring-0 focus-visible:ring-0 outline-none space-y-8">
            <AdsPerformance />
            <div>
               <h3 className="font-headline font-black text-lg text-slate-900 mb-6">Active Ad Performance</h3>
               <CampaignList />
            </div>
          </TabsContent>
          
          <TabsContent value="creative" className="mt-0 ring-0 focus-visible:ring-0 outline-none">
            <AdCopyWriter />
          </TabsContent>

          <TabsContent value="campaigns" className="mt-0 ring-0 focus-visible:ring-0 outline-none">
            <div className="py-12 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl shadow-sm text-center px-4">
               <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                  <span className="material-symbols-outlined text-3xl">ads_click</span>
               </div>
               <h3 className="font-headline font-black text-xl text-slate-900 mb-2">Campaign Manager</h3>
               <p className="text-slate-500 max-w-sm mb-6">Connect your Meta or TikTok Ads account to manage your campaigns directly from Rawaj.</p>
               <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                  Connect Ad Account
               </button>
            </div>
          </TabsContent>
        </main>
      </Tabs>
    </div>
  )
}
