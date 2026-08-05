import { Link } from 'react-router-dom'
import { PageLayout } from '@/layouts/AppLayout'
import { StatsCard, DashboardCard } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSkeleton } from '@/components/ui/DataTable'
import { useDashboard, useDashboardSales } from '@/hooks/queries'
import { formatCurrency } from '@/utils/cn'
import { IndianRupee, ClipboardList, Table2, ChefHat, Package, Users } from 'lucide-react'

export function DashboardOverviewPage() {
  const { data, isLoading, isError } = useDashboard()

  return (
    <PageLayout
      title="Dashboard"
      description="Live operational snapshot — wire real metrics in later phases."
      actions={
        <Link to="/dashboard/sales">
          <Button variant="outline" size="sm">
            Sales
          </Button>
        </Link>
      }
    >
      {isLoading ? <LoadingSkeleton rows={3} /> : null}
      {isError ? (
        <p className="text-sm text-danger">Unable to load dashboard. Is the API running?</p>
      ) : null}
      {data ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <StatsCard label="Today sales" value={formatCurrency(Number(data.today_sales))} icon={<IndianRupee className="h-5 w-5" />} />
          <StatsCard label="Orders" value={data.today_orders} icon={<ClipboardList className="h-5 w-5" />} />
          <StatsCard label="Active tables" value={data.active_tables} icon={<Table2 className="h-5 w-5" />} />
          <StatsCard label="Pending KOT" value={data.pending_kots} icon={<ChefHat className="h-5 w-5" />} />
          <StatsCard label="Low stock" value={data.low_stock_items} icon={<Package className="h-5 w-5" />} />
          <StatsCard label="Customers" value={data.today_customers} icon={<Users className="h-5 w-5" />} />
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <DashboardCard title="Quick links" description="Jump into modules">
          <div className="flex flex-wrap gap-2">
            <Link to="/dashboard/inventory"><Button size="sm" variant="secondary">Inventory</Button></Link>
            <Link to="/dashboard/reports"><Button size="sm" variant="secondary">Reports</Button></Link>
            <Link to="/dashboard/employees"><Button size="sm" variant="secondary">Employees</Button></Link>
            <Link to="/dashboard/customers"><Button size="sm" variant="secondary">Customers</Button></Link>
          </div>
        </DashboardCard>
        <DashboardCard title="TODO" description="Business logic placeholders">
          <ul className="list-disc space-y-1 pl-4 text-sm text-muted">
            <li>Realtime order websocket feed</li>
            <li>Branch-wise KPIs</li>
            <li>Shift open/close cash drawer</li>
          </ul>
        </DashboardCard>
      </div>
    </PageLayout>
  )
}

export function DashboardSalesPage() {
  const { data, isLoading } = useDashboardSales()
  return (
    <PageLayout title="Sales" description="Hourly sales chart data (stub).">
      {isLoading ? <LoadingSkeleton /> : null}
      <DashboardCard title="Today by hour">
        <div className="flex h-40 items-end gap-2">
          {(data?.hourly ?? [0, 0, 0, 0, 0, 0]).map((v: number, i: number) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md bg-brand-600/80"
                style={{ height: `${Math.max(8, (v / 2500) * 100)}%` }}
              />
              <span className="text-[10px] text-muted">{data?.labels?.[i] ?? ''}</span>
            </div>
          ))}
        </div>
      </DashboardCard>
    </PageLayout>
  )
}

export function ModuleStubPage({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <PageLayout title={title} description={description}>
      <DashboardCard title="Module skeleton" description="UI shell ready — implement workflows next.">
        <p className="text-sm text-muted">
          TODO: Add forms, validations, and API mutations for {title.toLowerCase()}.
        </p>
      </DashboardCard>
    </PageLayout>
  )
}
