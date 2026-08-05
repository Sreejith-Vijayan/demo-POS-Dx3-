import { Link } from 'react-router-dom'
import { PageLayout } from '@/layouts/AppLayout'
import { Card, DashboardCard, StatsCard } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LoadingSkeleton, EmptyState } from '@/components/ui/DataTable'
import { useKitchenHistory, useKitchenOrders } from '@/hooks/queries'
import { kitchenApi } from '@/services/api'
import { useQueryClient } from '@tanstack/react-query'

export function KitchenHomePage() {
  const { data } = useKitchenOrders()
  return (
    <PageLayout title="Kitchen" description="KDS overview">
      <StatsCard label="Active KOT" value={data?.total ?? 0} />
      <DashboardCard title="Open KOT board">
        <Link to="/kitchen/kot"><Button size="sm">View KOT</Button></Link>
      </DashboardCard>
    </PageLayout>
  )
}

export function KitchenKotPage() {
  const { data, isLoading } = useKitchenOrders()
  const qc = useQueryClient()

  const bump = async (id: number, status: string) => {
    // TODO: Optimistic updates + sound alerts
    await kitchenApi.updateStatus(id, status)
    qc.invalidateQueries({ queryKey: ['kitchen', 'orders'] })
  }

  return (
    <PageLayout title="KOT Display" description="Mobile-first kitchen tickets.">
      {isLoading ? <LoadingSkeleton /> : null}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {(data?.items ?? []).map((o: { id: number; order_number: string; status: string; table_id?: number; notes?: string }) => (
          <Card key={o.id} className="border-l-4 border-l-accent">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-lg font-semibold">{o.order_number}</p>
                <p className="text-xs text-muted">Table {o.table_id ?? '—'}</p>
              </div>
              <StatusBadge status={o.status} />
            </div>
            {o.notes ? <p className="mt-2 text-sm text-muted">{o.notes}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => bump(o.id, 'preparing')}>
                Preparing
              </Button>
              <Button size="sm" onClick={() => bump(o.id, 'ready')}>
                Ready
              </Button>
            </div>
          </Card>
        ))}
      </div>
      {!isLoading && !(data?.items?.length) ? (
        <EmptyState title="Kitchen is clear" description="New KOTs will appear here." />
      ) : null}
    </PageLayout>
  )
}

export function KitchenHistoryPage() {
  const { data, isLoading } = useKitchenHistory()
  return (
    <PageLayout title="Kitchen history" description="Completed tickets.">
      {isLoading ? <LoadingSkeleton /> : null}
      <EmptyState
        title={data?.message ?? 'No history yet'}
        description="TODO: Persist completed KOT timeline."
      />
    </PageLayout>
  )
}
