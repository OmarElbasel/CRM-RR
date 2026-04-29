import '@/components/widget/widget.css'
import '../globals.css'

export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div dir="rtl" lang="ar" className="bg-transparent">
      {children}
    </div>
  )
}
