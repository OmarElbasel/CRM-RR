import { DUMMY_ORDER_LIST_RESPONSE, DUMMY_ORDER_SUMMARY } from '@/lib/dummy/orders'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export type OrderSource = 'SHOPIFY' | 'WHATSAPP' | 'MANUAL'
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'RETURNED'

export interface Order {
  id: number
  source: OrderSource
  status: OrderStatus
  shopify_order_id: string | null
  order_number: string
  customer_name: string
  customer_email: string | null
  total_amount: string
  currency: string
  line_items: Array<{ title: string; quantity: number; price: string }>
  contact_id: number | null
  contact_name: string | null
  notes: string
  created_at: string
  updated_at: string
}

export interface OrderListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Order[]
}

export interface OrderFilters {
  source?: OrderSource
  status?: OrderStatus
  date_from?: string
  date_to?: string
  page?: number
  page_size?: number
}

export interface OrderSummaryResponse {
  month: string
  total_amount: string
  currency: string
  by_source: Record<OrderSource, { count: number; amount: string }>
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

export async function fetchOrders(filters: OrderFilters = {}, token = ''): Promise<OrderListResponse> {
  if (process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true') return DUMMY_ORDER_LIST_RESPONSE
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined) params.set(k, String(v))
  })
  const res = await fetch(`${API_URL}/api/orders/?${params}`, {
    headers: token ? authHeaders(token) : {},
  })
  if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`)
  return res.json()
}

export async function patchOrder(
  id: number,
  data: { status?: OrderStatus; notes?: string },
  token = '',
): Promise<Order> {
  const res = await fetch(`${API_URL}/api/orders/${id}/`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Failed to update order: ${res.status}`)
  return res.json()
}

export async function fetchOrderSummary(month?: string, token = ''): Promise<OrderSummaryResponse> {
  if (process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true') return DUMMY_ORDER_SUMMARY
  const params = month ? `?month=${month}` : ''
  const res = await fetch(`${API_URL}/api/orders/summary/${params}`, {
    headers: token ? authHeaders(token) : {},
  })
  if (!res.ok) throw new Error(`Failed to fetch summary: ${res.status}`)
  return res.json()
}
