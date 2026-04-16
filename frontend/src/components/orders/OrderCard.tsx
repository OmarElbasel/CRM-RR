import { useDraggable } from '@dnd-kit/core'
import type { Order } from '@/lib/orders'

const SOURCE_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  SHOPIFY: { label: 'Shopify', icon: 'shopping_bag', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  WHATSAPP: { label: 'WhatsApp', icon: 'chat', color: 'text-green-600', bg: 'bg-green-50' },
  MANUAL: { label: 'Manual', icon: 'edit_note', color: 'text-slate-600', bg: 'bg-slate-50' },
}

interface OrderCardProps {
  order: Order
  selectedCurrency: 'EGP' | 'QAR' | 'SAR' | 'USD'
  isDragOverlay?: boolean
  onClick?: (order: Order) => void
}

export function OrderCard({ 
  order, 
  selectedCurrency, 
  isDragOverlay, 
  onClick 
}: OrderCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: order.id,
  })

  const amount = parseFloat(order.total_amount)
  const displayCurrency = selectedCurrency
  const TO_USD: Record<string, number> = { USD: 1, QAR: 0.2747, SAR: 0.2667, EGP: 0.0202 }
  const FROM_USD: Record<string, number> = { USD: 1, QAR: 3.64, SAR: 3.75, EGP: 49.5 }
  const orderCur = order.currency || 'EGP'
  const converted = orderCur === selectedCurrency
    ? amount.toFixed(2)
    : (amount * (TO_USD[orderCur] ?? 1) * (FROM_USD[selectedCurrency] ?? 1)).toFixed(2)
  const source = SOURCE_CONFIG[order.source] || SOURCE_CONFIG.MANUAL

  const cardBaseStyles = isDragging 
    ? 'opacity-40' 
    : isDragOverlay 
    ? 'bg-white border-indigo-200 shadow-xl' 
    : 'bg-white border-slate-100 hover:shadow-md cursor-grab active:cursor-grabbing group transition-all shadow-sm'

  return (
    <div
      ref={!isDragOverlay ? setNodeRef : undefined}
      {...(!isDragOverlay ? { ...listeners, ...attributes } : {})}
      className={`${isDragging ? 'opacity-40' : ''}`}
      onClick={() => onClick?.(order)}
    >
      <div className={`p-4 rounded-lg border ${cardBaseStyles}`}>
        <div className="flex justify-between items-start mb-3">
          <span className={`text-[10px] font-extrabold py-0.5 px-2 rounded uppercase tracking-wider ${source.bg} ${source.color}`}>
            {order.order_number ? `#${order.order_number}` : `#${order.id.toString().padStart(4, '0')}`}
          </span>
          <span className={`material-symbols-outlined text-sm ${source.color}`}>
            {source.icon}
          </span>
        </div>

        <p className="text-sm font-bold text-slate-900 mb-1 truncate">
          {order.customer_name || 'Anonymous Customer'}
        </p>
        
        <div className="flex items-center gap-1.5 mb-4">
          <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'DELIVERED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            {order.source} • {new Date(order.created_at).toLocaleDateString()}
          </span>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Total</span>
            <span className="text-sm font-black text-slate-900">
              {converted} <span className="text-[10px] text-slate-500">{displayCurrency}</span>
            </span>
          </div>
          {order.line_items?.length > 0 && (
            <div className="flex -space-x-2">
               <span className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">
                 +{order.line_items.length}
               </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
