import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import '../globals.css'
import { AppShell } from '@/components/layout/AppShell'
import { TooltipProvider } from '@/components/ui/tooltip'
import { PostHogProvider } from '@/components/providers/PostHogProvider'
import { OrgGuard } from '@/components/layout/OrgGuard'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

export const metadata: Metadata = {
  title: 'Rawaj — AI CRM that works the pipeline for you',
  description: 'Rawaj unifies every customer conversation, scores every lead, and lets AI agents draft, qualify, and advance deals.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        </head>
        <body className="antialiased">
          <ThemeProvider>
            <TooltipProvider>
              <PostHogProvider>
                <OrgGuard>
                  <AppShell>{children}</AppShell>
                </OrgGuard>
              </PostHogProvider>
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
