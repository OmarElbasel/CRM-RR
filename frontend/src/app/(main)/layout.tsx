import type { Metadata } from 'next'
import { AppShell } from '@/components/layout/AppShell'
import { TooltipProvider } from '@/components/ui/tooltip'
import { PostHogProvider } from '@/components/providers/PostHogProvider'
import { OrgGuard } from '@/components/layout/OrgGuard'
import { PortfolioBanner } from '@/components/ui/PortfolioBanner'
import { LocaleProvider } from '@/components/providers/LocaleProvider'
import { I18nProvider } from '@/components/providers/I18nProvider'

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
    <LocaleProvider>
      <I18nProvider>
        <TooltipProvider>
          <PostHogProvider>
            <OrgGuard>
              <PortfolioBanner />
              <AppShell>{children}</AppShell>
            </OrgGuard>
          </PostHogProvider>
        </TooltipProvider>
      </I18nProvider>
    </LocaleProvider>
  )
}
