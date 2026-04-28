import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Status — Rawaj',
}

export default function StatusPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-extrabold text-ds-text tracking-tight font-headline mb-2">System Status</h1>
      <p className="text-sm text-ds-text-2 mb-8">All systems operational</p>

      <div className="space-y-3">
        {[
          { name: 'API', status: 'Operational' },
          { name: 'Dashboard', status: 'Operational' },
          { name: 'Authentication', status: 'Operational' },
          { name: 'AI Generation', status: 'Operational' },
          { name: 'Payments', status: 'Operational' },
        ].map((item) => (
          <div key={item.name} className="flex items-center justify-between py-3 border-b border-ds-line">
            <span className="text-ds-text font-medium">{item.name}</span>
            <span className="text-sm text-emerald-600 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
