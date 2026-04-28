import { ReactNode } from 'react'
import { FileText } from 'lucide-react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-paper-2 flex items-center justify-center mb-4">
        {icon || <FileText className="w-6 h-6 text-ds-text-2" />}
      </div>
      <h3 className="text-base font-bold text-ds-text mb-1">{title}</h3>
      <p className="text-sm text-ds-text-2 max-w-xs mb-4">{description}</p>
      {action}
    </div>
  )
}
