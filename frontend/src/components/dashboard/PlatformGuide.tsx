'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const PLATFORMS = [
  {
    id: 'shopify',
    name: 'Shopify',
    steps: [
      'Go to your Shopify Admin → Online Store → Themes',
      'Click "Actions" → "Edit code"',
      'Open the theme.liquid file',
      'Paste the embed code just before the </body> tag',
      'Click "Save"',
      'Visit your store to verify the widget appears',
    ],
  },
  {
    id: 'salla',
    name: 'Salla',
    steps: [
      'Go to your Salla Dashboard → Store Settings',
      'Navigate to "Custom Code" or "Additional Scripts"',
      'Paste the embed code in the "Footer" section',
      'Click "Save Changes"',
      'Visit your store to verify the widget appears',
    ],
  },
  {
    id: 'zid',
    name: 'Zid',
    steps: [
      'Go to your Zid Dashboard → Store Design',
      'Navigate to "Custom Code"',
      'Paste the embed code in the "Body End" field',
      'Click "Save"',
      'Visit your store to verify the widget appears',
    ],
  },
]

export function PlatformGuide() {
  function handleTabClick() {
    // Mark onboarding step as complete
    try {
      const state = JSON.parse(localStorage.getItem('rawaj_onboarding') ?? '{}')
      state.install = true
      localStorage.setItem('rawaj_onboarding', JSON.stringify(state))
    } catch {}
  }

  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Platform Install Guide</h3>
        <Tabs defaultValue="shopify" onValueChange={handleTabClick}>
          <TabsList className="mb-4">
            {PLATFORMS.map((p) => (
              <TabsTrigger key={p.id} value={p.id}>
                {p.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {PLATFORMS.map((platform) => (
            <TabsContent key={platform.id} value={platform.id}>
              <ol className="space-y-3">
                {platform.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium flex items-center justify-center">
                      {idx + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
