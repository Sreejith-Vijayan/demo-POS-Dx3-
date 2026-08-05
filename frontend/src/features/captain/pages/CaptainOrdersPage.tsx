import { PageLayout } from '@/layouts/AppLayout'
import { Card, DashboardCard } from '@/components/ui/Card'
import { EmptyState, LoadingSkeleton } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { useCaptainOrders } from '@/features/captain/hooks'
import { formatCurrency } from '@/utils/cn'

export function CaptainOrdersPage() {
  const orders = useCaptainOrders()

  return (
    <PageLayout title="Running orders" description="Active, held, and recent tables.">
      {orders.isLoading ? <LoadingSkeleton /> : null}
      <div className="grid gap-3">
        {(orders.data?.items ?? []).map((order) => (
          <Card key={order.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">{order.order_number}</p>
              <p className="text-xs text-muted">Table {order.table_id ?? '—'}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={order.status} />
              <span className="text-sm font-semibold">{formatCurrency(order.total_amount)}</span>
              <Button size="sm" variant="secondary">View</Button>
            </div>
          </Card>
        ))}
      </div>
      {!orders.isLoading && !(orders.data?.items?.length) ? <EmptyState title="No running orders" /> : null}
    </PageLayout>
  )
}
