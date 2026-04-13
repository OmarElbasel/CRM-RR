import { Badge } from '@/components/ui/badge'

type Intent = 'READY_TO_BUY' | 'PRICE_INQUIRY' | 'INFO_REQUEST' | 'COMPLAINT' | 'BROWSING'

interface IntentBadgeProps {
  intent: Intent
}

const INTENT_CONFIG: Record<Intent, { label: string; className: string }> = {
  READY_TO_BUY: {
    label: 'Ready to Buy',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  PRICE_INQUIRY: {
    label: 'Price Inquiry',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  INFO_REQUEST: {
    label: 'Info Request',
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  COMPLAINT: {
    label: 'Complaint',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
  BROWSING: {
    label: 'Browsing',
    className: 'bg-gray-50 text-gray-700 border-gray-200',
  },
}

export function IntentBadge({ intent }: IntentBadgeProps) {
  const config = INTENT_CONFIG[intent]
  return (
    <Badge variant="outline" className={`${config.className} text-xs font-medium`}>
      {config.label}
    </Badge>
  )
}
