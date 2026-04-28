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

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: '#594FBF' } }}>
      <ThemeProvider>
        <TooltipProvider>
          <PostHogProvider>
            <OrgGuard>
              <AppShell>{children}</AppShell>
            </OrgGuard>
          </PostHogProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ClerkProvider>
  )
}
