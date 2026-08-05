import { useMemo, useState } from 'react'
import { PageLayout } from '@/layouts/AppLayout'
import { Card, DashboardCard, StatsCard } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { SearchBar } from '@/components/ui/SearchBar'
import { DataTable, LoadingSkeleton, EmptyState } from '@/components/ui/DataTable'
import { Pagination } from '@/components/ui/Pagination'
import {
  useCustomers,
  useEmployees,
  useFeedback,
  useInventory,
  useNotifications,
  useReports,
  useSettings,
} from '@/hooks/queries'
import { formatCurrency } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import { feedbackApi } from '@/services/api'

export function InventoryPage() {
  const { data, isLoading } = useInventory()
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 8

  const filtered = useMemo(() => {
    const items = data?.items ?? []
    if (!q) return items
    return items.filter((i: { name: string; sku: string }) =>
      `${i.name} ${i.sku}`.toLowerCase().includes(q.toLowerCase()),
    )
  }, [data, q])

  const slice = filtered.slice((page - 1) * pageSize, page * pageSize)
  const rows = slice.map((i: { sku: string; name: string; quantity_on_hand: number; unit: string; reorder_level: number }) => ({
    sku: i.sku,
    name: i.name,
    qty: `${i.quantity_on_hand} ${i.unit}`,
    stock:
      i.quantity_on_hand <= i.reorder_level ? (
        <StatusBadge status="pending" />
      ) : (
        <StatusBadge status="available" />
      ),
  }))

  return (
    <PageLayout title="Inventory" description="Stock levels & reorder alerts.">
      <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1) }} placeholder="Search SKU or item…" />
      {isLoading ? <LoadingSkeleton /> : null}
      <Card>
        <DataTable
          columns={[
            { key: 'sku', label: 'SKU' },
            { key: 'name', label: 'Item' },
            { key: 'qty', label: 'On hand' },
            { key: 'stock', label: 'Status' },
          ]}
          rows={rows}
        />
        <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} />
      </Card>
    </PageLayout>
  )
}

export function ReportsPage() {
  const { data, isLoading } = useReports()
  return (
    <PageLayout title="Reports" description="Sales & operations analytics.">
      {isLoading ? <LoadingSkeleton /> : null}
      {data ? (
        <div className="grid grid-cols-2 gap-3">
          <StatsCard label="Total sales" value={formatCurrency(Number(data.total_sales))} />
          <StatsCard label="Orders" value={data.total_orders} />
          <StatsCard label="AOV" value={formatCurrency(Number(data.average_order_value))} />
          <StatsCard label="Period" value={data.period} />
        </div>
      ) : null}
      <DashboardCard title="Top items">
        <ul className="space-y-2 text-sm">
          {(data?.top_items ?? []).map((t: { name: string; qty: number }) => (
            <li key={t.name} className="flex justify-between border-b border-black/5 pb-2">
              <span>{t.name}</span>
              <span className="text-muted">{t.qty} sold</span>
            </li>
          ))}
        </ul>
      </DashboardCard>
    </PageLayout>
  )
}

export function EmployeesPage() {
  const { data, isLoading } = useEmployees()
  const rows = (data?.items ?? []).map((e: { employee_code: string; full_name: string; role_name: string; status: string }) => ({
    code: e.employee_code,
    name: e.full_name,
    role: e.role_name,
    status: <StatusBadge status={e.status} />,
  }))
  return (
    <PageLayout title="Employees" description="Staff directory.">
      {isLoading ? <LoadingSkeleton /> : null}
      <Card>
        <DataTable
          columns={[
            { key: 'code', label: 'Code' },
            { key: 'name', label: 'Name' },
            { key: 'role', label: 'Role' },
            { key: 'status', label: 'Status' },
          ]}
          rows={rows}
        />
      </Card>
    </PageLayout>
  )
}

export function CustomersPage() {
  const { data, isLoading } = useCustomers()
  const rows = (data?.items ?? []).map((c: { name: string; phone?: string; loyalty_points: number; visit_count: number }) => ({
    name: c.name,
    phone: c.phone ?? '—',
    loyalty: c.loyalty_points,
    visits: c.visit_count,
  }))
  return (
    <PageLayout title="Customers" description="CRM list view.">
      {isLoading ? <LoadingSkeleton /> : null}
      <Card>
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'phone', label: 'Phone' },
            { key: 'loyalty', label: 'Points' },
            { key: 'visits', label: 'Visits' },
          ]}
          rows={rows}
        />
      </Card>
    </PageLayout>
  )
}

export function SettingsPage() {
  const { data, isLoading } = useSettings()
  return (
    <PageLayout title="Settings" description="Branch & system configuration.">
      {isLoading ? <LoadingSkeleton /> : null}
      <div className="space-y-2">
        {(data?.items ?? []).map((s: { id: number; key: string; value: string; category: string; description?: string }) => (
          <Card key={s.id}>
            <p className="text-xs uppercase text-muted">{s.category}</p>
            <p className="font-medium">{s.key}</p>
            <p className="text-sm text-brand-800">{s.value}</p>
            {s.description ? <p className="mt-1 text-xs text-muted">{s.description}</p> : null}
          </Card>
        ))}
      </div>
      {!isLoading && !(data?.items?.length) ? <EmptyState title="No settings" /> : null}
    </PageLayout>
  )
}

export function NotificationsPage() {
  const { data, isLoading } = useNotifications()
  return (
    <PageLayout title="Notifications" description="Alerts & system messages.">
      {isLoading ? <LoadingSkeleton /> : null}
      <div className="space-y-2">
        {(data?.items ?? []).map((n: { id: number; title: string; message: string; notification_type: string; is_read: boolean }) => (
          <Card key={n.id} className={n.is_read ? 'opacity-70' : ''}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">{n.title}</p>
                <p className="mt-1 text-sm text-muted">{n.message}</p>
              </div>
              <StatusBadge status={n.notification_type === 'warning' ? 'pending' : 'confirmed'} />
            </div>
          </Card>
        ))}
      </div>
      {!isLoading && !(data?.items?.length) ? <EmptyState title="All caught up" /> : null}
    </PageLayout>
  )
}

export function FeedbackPage() {
  const { data, isLoading } = useFeedback()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)

  const submit = async () => {
    await feedbackApi.submit({ rating, comment })
    setSent(true)
    setComment('')
  }

  return (
    <PageLayout title="Feedback" description="Customer ratings.">
      <DashboardCard title="Leave feedback">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <Button key={n} size="sm" variant={rating === n ? 'primary' : 'outline'} onClick={() => setRating(n)}>
              {n}
            </Button>
          ))}
        </div>
        <textarea
          className="mt-3 w-full rounded-xl border border-black/10 p-3 text-sm outline-none ring-brand-500 focus:ring-2"
          rows={3}
          placeholder="Tell us about your visit…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button className="mt-3" onClick={submit}>
          Submit
        </Button>
        {sent ? <p className="mt-2 text-sm text-brand-700">Thanks! Feedback submitted (stub).</p> : null}
      </DashboardCard>

      {isLoading ? <LoadingSkeleton /> : null}
      <div className="space-y-2">
        {(data?.items ?? []).map((f: { id: number; rating: number; comment?: string; status: string }) => (
          <Card key={f.id}>
            <div className="flex justify-between">
              <p className="font-medium">{'★'.repeat(f.rating)}</p>
              <StatusBadge status={f.status === 'new' ? 'new' : 'completed'} />
            </div>
            <p className="mt-1 text-sm text-muted">{f.comment}</p>
          </Card>
        ))}
      </div>
    </PageLayout>
  )
}
