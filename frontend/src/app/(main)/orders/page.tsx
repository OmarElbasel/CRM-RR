import { ShoppingBag } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { PlaceholderFeature } from '@/components/ui/PlaceholderFeature'

export default function OrdersPage() {
  return (
    <>
      <PageHeader title="Orders" />
      <PlaceholderFeature
        icon={<ShoppingBag />}
        title="Orders"
        description="Order management with real-time sync from Shopify, Salla, and Zid."
        phase="Phase 7"
      />
    </>
  )
}
