import { Card } from '@/components/ui/card'
import type { Order } from '@/lib/orders'

const SOURCE_COLORS: Record<string, string> = {
  SHOPIFY: 'bg-blue-100 text-blue-800',
  WHATSAPP: 'bg-green-100 text-green-800',
  MANUAL: 'bg-gray-100 text-gray-700',
}

const SOURCE_LABELS: Record<string, string> = {
  SHOPIFY: 'Shopify',
  WHATSAPP: 'WhatsApp',
  MANUAL: 'Manual',
}

interface Props {
  order: Order
  selectedCurrency: 'QAR' | 'SAR' | 'USD'
}

const RATES: Record<string, number> = { QAR: 1, SAR: 1.035, USD: 0.2747 }

export function OrderCard({ order, selectedCurrency }: Props) {
  const amount = parseFloat(order.total_amount)
  const converted = (amount * RATES[selectedCurrency]).toFixed(2)

  return (
    <Card className="p-3 mb-2 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between items-start mb-1">
        <span className="font-medium text-sm text-gray-900 truncate max-w-[140px]">
          {order.customer_name || 'Unknown'}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${SOURCE_COLORS[order.source]}`}>
          {SOURCE_LABELS[order.source]}
        </span>
      </div>
      <div className="text-sm font-semibold text-gray-900">
        {converted} {selectedCurrency}
      </div>
      {order.contact_name && (
        <div className="text-xs text-gray-500 mt-1 truncate">↗ {order.contact_name}</div>
      )}
    </Card>
  )
}
