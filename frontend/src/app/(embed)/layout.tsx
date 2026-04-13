import '@/components/widget/widget.css'
import '../globals.css'

export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-transparent">{children}</body>
    </html>
  )
}
