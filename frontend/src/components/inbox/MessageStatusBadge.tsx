import { Badge } from '@/components/ui/badge'
import { Check, Clock, AlertCircle } from 'lucide-react'

type MessageStatus = 'pending' | 'delivered' | 'failed'

interface MessageStatusBadgeProps {
  status: MessageStatus
}

const STATUS_CONFIG: Record<MessageStatus, { label: string; icon: React.ElementType; className: string }> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  delivered: {
    label: 'Delivered',
    icon: Check,
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  failed: {
    label: 'Failed',
    icon: AlertCircle,
    className: 'bg-red-50 text-red-700 border-red-200',
  },
}

export function MessageStatusBadge({ status }: MessageStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon
  return (
    <Badge variant="outline" className={`${config.className} text-xs font-medium gap-1`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  )
}
