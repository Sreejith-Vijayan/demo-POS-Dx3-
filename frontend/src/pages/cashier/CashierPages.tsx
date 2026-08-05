import { Link } from 'react-router-dom'
import { PageLayout } from '@/layouts/AppLayout'
import { Card, DashboardCard, StatsCard } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LoadingSkeleton, EmptyState, DataTable } from '@/components/ui/DataTable'
import { useBillingQueue, usePayments } from '@/hooks/queries'
import { formatCurrency } from '@/utils/cn'

export function CashierHomePage() {
  const billing = useBillingQueue()
  return (
    <PageLayout title="Cashier" description="Billing desk">
      <StatsCard label="Ready to bill" value={billing.data?.items?.length ?? 0} />
      <DashboardCard title="Actions">
        <div className="flex flex-wrap gap-2">
          <Link to="/cashier/billing"><Button size="sm">Open billing</Button></Link>
          <Link to="/cashier/payments"><Button size="sm" variant="outline">Payments</Button></Link>
        </div>
      </DashboardCard>
    </PageLayout>
  )
}

export function CashierBillingPage() {
  const { data, isLoading } = useBillingQueue()
  return (
    <PageLayout title="Billing" description="TODO: Split bill, discounts, GST.">
      {isLoading ? <LoadingSkeleton /> : null}
      <div className="space-y-2">
        {(data?.items ?? []).map((b: { order_id: number; order_number: string; table: string; total: number }) => (
          <Card key={b.order_id} className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{b.order_number}</p>
              <p className="text-xs text-muted">{b.table}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{formatCurrency(b.total)}</span>
              <Button size="sm">Pay</Button>
            </div>
          </Card>
        ))}
      </div>
      {!isLoading && !(data?.items?.length) ? <EmptyState title="No bills pending" /> : null}
    </PageLayout>
  )
}

export function CashierPaymentsPage() {
  const { data, isLoading } = usePayments()
  const rows = (data?.items ?? []).map((p: { payment_number: string; amount: number; method: string; status: string }) => ({
    payment_number: p.payment_number,
    amount: formatCurrency(p.amount),
    method: p.method,
    status: <StatusBadge status={p.status} />,
  }))

  return (
    <PageLayout title="Payments" description="Recent payment records.">
      {isLoading ? <LoadingSkeleton /> : null}
      <Card>
        <DataTable
          columns={[
            { key: 'payment_number', label: 'Payment #' },
            { key: 'amount', label: 'Amount' },
            { key: 'method', label: 'Method' },
            { key: 'status', label: 'Status' },
          ]}
          rows={rows}
          empty="No payments yet"
        />
      </Card>
    </PageLayout>
  )
}

export function CashierHistoryPage() {
  return (
    <PageLayout title="Cashier history" description="Shift settlement history (stub).">
      <EmptyState title="No history" description="TODO: End-of-day settlement reports." />
    </PageLayout>
  )
}
