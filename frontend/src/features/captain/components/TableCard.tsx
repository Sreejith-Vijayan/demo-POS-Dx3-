import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { CaptainTable } from '@/features/captain/types'

export function TableCard({ table }: { table: CaptainTable }) {
  return (
    <Card className="group flex flex-col justify-between gap-3 p-4 hover:border-brand-300">
      <div>
        <p className="text-lg font-semibold">{table.name}</p>
        <p className="mt-1 text-sm text-muted">{table.capacity} seats · {table.floor ?? 'Floor'}</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <StatusBadge status={table.status} />
        <Link to={`/captain/order/${table.id}`} className="ml-auto">
          <Button size="sm" variant="secondary">Open</Button>
        </Link>
      </div>
    </Card>
  )
}
