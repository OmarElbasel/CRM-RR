import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import '../globals.css'
import { isEnabled } from '@/lib/flags'
import { AppShell } from '@/components/layout/AppShell'
import { TooltipProvider } from '@/components/ui/tooltip'
import { PostHogProvider } from '@/components/providers/PostHogProvider'
import { OrgGuard } from '@/components/layout/OrgGuard'

export const metadata: Metadata = {
  title: 'Rawaj — AI CRM that works the pipeline for you',
  description: 'Rawaj unifies every customer conversation, scores every lead, and lets AI agents draft, qualify, and advance deals.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const showRedesign = isEnabled('UI_REDESIGN')

  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: '#594FBF' } }}>
      <html lang="en" dir="ltr">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
            rel="stylesheet"
          />
          <link 
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
            rel="stylesheet" 
          />
        </head>
        <body className="antialiased">
          <TooltipProvider>
            <PostHogProvider>
              <OrgGuard>
                {showRedesign ? (
                  <AppShell>{children}</AppShell>
                ) : (
                  children
                )}
              </OrgGuard>
            </PostHogProvider>
          </TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
