'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import type { Order, OrderStatus } from '@/lib/orders'
import { OrderCard } from './OrderCard'
import { patchOrder } from '@/lib/orders'

const COLUMNS: { key: OrderStatus; label: string; dot: string; bg: string }[] = [
  { key: 'PENDING', label: 'Pending', dot: 'bg-slate-400', bg: 'bg-slate-100/50' },
  { key: 'CONFIRMED', label: 'Confirmed', dot: 'bg-blue-500', bg: 'bg-blue-50/30' },
  { key: 'PROCESSING', label: 'Processing', dot: 'bg-amber-400', bg: 'bg-amber-50/30' },
  { key: 'SHIPPED', label: 'Shipped', dot: 'bg-purple-500', bg: 'bg-purple-50/30' },
  { key: 'DELIVERED', label: 'Delivered', dot: 'bg-emerald-500', bg: 'bg-emerald-50/30' },
  { key: 'RETURNED', label: 'Returned', dot: 'bg-error', bg: 'bg-error-container/10' },
]

interface Props {
  orders: Order[]
  selectedCurrency: 'EGP' | 'QAR' | 'SAR' | 'USD'
  onOrderUpdate?: () => void
}

function OrderColumn({ status, label, dot, bg, orders, selectedCurrency }: { status: string; label: string; dot: string; bg: string; orders: Order[]; selectedCurrency: string }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[300px] max-w-[300px] w-full rounded-xl transition-all ${isOver ? 'bg-indigo-50/50 ring-2 ring-indigo-200 scale-[1.01]' : ''}`}
    >
      <div className="flex items-center justify-between px-1 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-tight">{label}</h3>
          <span className={`${dot} text-white text-[10px] px-2 py-0.5 rounded-full font-bold opacity-80`}>
            {orders.length}
          </span>
        </div>
        <button className="text-slate-400 hover:text-indigo-600 transition-colors">
          <span className="material-symbols-outlined text-xl">more_horiz</span>
        </button>
      </div>

      <div className={`flex-1 flex flex-col gap-1 min-h-[400px] ${bg} p-2 rounded-xl transition-all`}>
        {orders.map((order) => (
          <OrderCard 
            key={order.id} 
            order={order} 
            selectedCurrency={selectedCurrency as any} 
          />
        ))}
        {orders.length === 0 && (
          <div className="py-12 border-2 border-dashed border-slate-200/50 rounded-xl flex flex-col items-center justify-center opacity-30">
             <span className="material-symbols-outlined text-4xl mb-2 text-slate-400">inventory_2</span>
             <p className="text-xs font-medium text-slate-400">No orders here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function OrderPipelineBoard({ orders, selectedCurrency, onOrderUpdate }: Props) {
  const { getToken } = useAuth()
  const [localOrders, setLocalOrders] = useState<Order[]>(orders)
  const [activeOrder, setActiveOrder] = useState<Order | null>(null)

  // Sync with props
  if (orders !== localOrders && !activeOrder) {
    setLocalOrders(orders)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const orderId = event.active.id as number
    const order = localOrders.find(o => o.id === orderId)
    if (order) setActiveOrder(order)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveOrder(null)

    if (!over) return

    const orderId = active.id as number
    const newStatus = over.id as OrderStatus
    const order = localOrders.find(o => o.id === orderId)

    if (!order || order.status === newStatus) return

    // Optimistic update
    setLocalOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))

    try {
      const token = await getToken()
      await patchOrder(orderId, { status: newStatus }, token || '')
      onOrderUpdate?.()
    } catch (error) {
      console.error('Failed to update order status:', error)
      setLocalOrders(orders) // Revert
    }
  }

  const byStatus = (status: OrderStatus) => localOrders.filter((o) => o.status === status)

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto pb-4 scrollbar-hide w-full max-w-full">
        <div className="flex gap-4 min-w-max pb-8 px-8">
          {COLUMNS.map((col) => (
            <OrderColumn 
              key={col.key}
              status={col.key}
              label={col.label}
              dot={col.dot}
              bg={col.bg}
              orders={byStatus(col.key)}
              selectedCurrency={selectedCurrency}
            />
          ))}
        </div>
      </div>
      
      <DragOverlay>
        {activeOrder ? (
          <OrderCard 
            order={activeOrder} 
            selectedCurrency={selectedCurrency} 
            isDragOverlay 
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
