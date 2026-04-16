import { ClerkProvider } from '@clerk/nextjs'
import '../globals.css'

export default function OrgSetupLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: '#4F46E5' } }}>
      <html lang="en">
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  )
}
