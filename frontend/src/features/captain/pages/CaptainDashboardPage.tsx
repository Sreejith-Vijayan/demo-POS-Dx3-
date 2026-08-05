import { Link } from 'react-router-dom'
import { PageLayout } from '@/layouts/AppLayout'
import { Card, DashboardCard, StatsCard } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSkeleton, EmptyState } from '@/components/ui/DataTable'
import { useCaptainOrders, useTables } from '@/features/captain/hooks'

export function CaptainDashboardPage() {
  const tables = useTables()
  const orders = useCaptainOrders()
  const occupied = (tables.data?.items ?? []).filter((t) => t.status === 'occupied').length

  return (
    <PageLayout
      title="Captain"
      description="Floor control — tables, orders and kitchen handoffs."
      actions={
        <>
          <Link to="/captain/tables"><Button size="sm" variant="outline">Tables</Button></Link>
          <Link to="/captain/order"><Button size="sm">New order</Button></Link>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Tables" value={tables.data?.total ?? '—'} />
        <StatsCard label="Occupied" value={occupied} />
        <StatsCard label="Running orders" value={orders.data?.total ?? 0} />
        <StatsCard label="Held orders" value={0} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <DashboardCard title="Available tables">
          {tables.isLoading ? <LoadingSkeleton /> : null}
          <div className="grid gap-2 sm:grid-cols-2">
            {(tables.data?.items ?? []).slice(0, 4).map((table) => (
              <div key={table.id} className="rounded-2xl border border-black/10 bg-slate-50 p-3">
                <p className="font-semibold">{table.name}</p>
                <p className="text-xs text-muted">{table.capacity} seats · {table.floor ?? 'Floor'}</p>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Recent activity">
          {orders.isLoading ? <LoadingSkeleton /> : null}
          <div className="space-y-3">
            {(orders.data?.items ?? []).slice(0, 3).map((order) => (
              <div key={order.id} className="rounded-2xl border border-black/10 p-3">
                <p className="font-medium">{order.order_number}</p>
                <p className="text-xs text-muted">Table {order.table_id ?? '—'}</p>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {!tables.isLoading && !(tables.data?.items?.length) ? <EmptyState title="No tables available" /> : null}
    </PageLayout>
  )
}
