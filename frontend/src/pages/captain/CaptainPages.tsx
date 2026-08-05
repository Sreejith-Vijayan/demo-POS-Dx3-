import { Link } from 'react-router-dom'
import { PageLayout } from '@/layouts/AppLayout'
import { Card, DashboardCard, StatsCard } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LoadingSkeleton, EmptyState } from '@/components/ui/DataTable'
import { useCaptainOrders, useCaptainTables, useMenu } from '@/hooks/queries'
import { formatCurrency } from '@/utils/cn'

export function CaptainHomePage() {
  const tables = useCaptainTables()
  const occupied = (tables.data?.items ?? []).filter((t: { status: string }) => t.status === 'occupied').length

  return (
    <PageLayout
      title="Captain"
      description="Floor control — tables & orders."
      actions={
        <>
          <Link to="/captain/tables"><Button size="sm" variant="outline">Tables</Button></Link>
          <Link to="/captain/order"><Button size="sm">New order</Button></Link>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <StatsCard label="Tables" value={tables.data?.total ?? '—'} />
        <StatsCard label="Occupied" value={occupied} />
      </div>
      <DashboardCard title="Shortcuts">
        <div className="flex flex-wrap gap-2">
          <Link to="/captain/orders"><Button variant="secondary" size="sm">Active orders</Button></Link>
          <Link to="/menu"><Button variant="secondary" size="sm">Browse menu</Button></Link>
        </div>
      </DashboardCard>
    </PageLayout>
  )
}

export function CaptainTablesPage() {
  const { data, isLoading, isError } = useCaptainTables()
  return (
    <PageLayout title="Tables" description="Select a table to take an order.">
      {isLoading ? <LoadingSkeleton /> : null}
      {isError ? <p className="text-sm text-danger">Failed to load tables.</p> : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {(data?.items ?? []).map((t: { id: number; name: string; status: string; capacity: number }) => (
          <Link key={t.id} to="/captain/order">
            <Card className="hover:border-brand-300">
              <p className="font-semibold">{t.name}</p>
              <p className="text-xs text-muted">{t.capacity} seats</p>
              <div className="mt-2">
                <StatusBadge status={t.status} />
              </div>
            </Card>
          </Link>
        ))}
      </div>
      {!isLoading && !(data?.items?.length) ? <EmptyState title="No tables seeded" /> : null}
    </PageLayout>
  )
}

export function CaptainOrderPage() {
  const menu = useMenu()
  return (
    <PageLayout title="New order" description="TODO: Cart, modifiers, send KOT.">
      <DashboardCard title="Menu items" description="Tap to add (stub)">
        {menu.isLoading ? <LoadingSkeleton /> : null}
        <div className="grid gap-2 sm:grid-cols-2">
          {(menu.data?.items ?? []).slice(0, 12).map((item: { id: number; name: string; price: number; is_veg: boolean }) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-black/8 px-3 py-2">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted">{item.is_veg ? 'Veg' : 'Non-veg'}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{formatCurrency(item.price)}</span>
                <Button size="sm" variant="secondary">Add</Button>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </PageLayout>
  )
}

export function CaptainOrdersPage() {
  const { data, isLoading } = useCaptainOrders()
  return (
    <PageLayout title="Orders" description="Active floor orders.">
      {isLoading ? <LoadingSkeleton /> : null}
      <div className="space-y-2">
        {(data?.items ?? []).map((o: { id: number; order_number: string; status: string; total_amount: number; table_id?: number }) => (
          <Card key={o.id} className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{o.order_number}</p>
              <p className="text-xs text-muted">Table {o.table_id ?? '—'}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={o.status} />
              <span className="text-sm font-semibold">{formatCurrency(o.total_amount)}</span>
            </div>
          </Card>
        ))}
      </div>
      {!isLoading && !(data?.items?.length) ? <EmptyState title="No orders yet" /> : null}
    </PageLayout>
  )
}
