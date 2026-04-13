import { Card, CardContent } from '@/components/ui/card'

interface KanbanCardProps {
  title: string
  stage: string
  children?: React.ReactNode
}

export function KanbanCard({ title, stage, children }: KanbanCardProps) {
  return (
    <Card className="rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-600">
              {stage}
            </span>
          </div>
          {children && (
            <div className="flex-shrink-0">{children}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
