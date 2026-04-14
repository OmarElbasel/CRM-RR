import type { Order, OrderStatus } from '@/lib/orders'
import { OrderCard } from './OrderCard'

const COLUMNS: { key: OrderStatus; label: string }[] = [
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'PROCESSING', label: 'Processing' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'RETURNED', label: 'Returned' },
]

interface Props {
  orders: Order[]
  selectedCurrency: 'QAR' | 'SAR' | 'USD'
}

export function OrderPipelineBoard({ orders, selectedCurrency }: Props) {
  const byStatus = (status: OrderStatus) => orders.filter((o) => o.status === status)

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map(({ key, label }) => {
        const col = byStatus(key)
        return (
          <div key={key} className="min-w-[220px] flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
              <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
                {col.length}
              </span>
            </div>
            <div className="max-h-[calc(100vh-260px)] overflow-y-auto">
              {col.map((order) => (
                <OrderCard key={order.id} order={order} selectedCurrency={selectedCurrency} />
              ))}
              {col.length === 0 && (
                <div className="text-xs text-gray-400 text-center py-8">No orders</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
