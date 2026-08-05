import { PageLayout } from '@/layouts/AppLayout'
import { EmptyState, LoadingSkeleton } from '@/components/ui/DataTable'
import { TableCard } from '@/features/captain/components/TableCard'
import { useTables } from '@/features/captain/hooks'

export function CaptainTablesPage() {
  const tables = useTables()
  return (
    <PageLayout title="Tables" description="Select a table or resume a held order.">
      {tables.isLoading ? <LoadingSkeleton /> : null}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {(tables.data?.items ?? []).map((table) => (
          <TableCard key={table.id} table={table} />
        ))}
      </div>
      {!tables.isLoading && !(tables.data?.items?.length) ? <EmptyState title="No tables seeded" /> : null}
    </PageLayout>
  )
}
