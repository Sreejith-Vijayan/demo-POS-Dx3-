import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { formatCurrency } from '@/utils/cn'
import type { MenuItem } from '@/features/captain/types'

export function MenuCard({
  item,
  onAdd,
}: {
  item: MenuItem
  onAdd: (item: MenuItem) => void
}) {
  return (
    <Card className="flex min-h-[160px] flex-col justify-between gap-3 hover:border-brand-300">
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold">{item.name}</p>
          <StatusBadge status={item.is_available ? 'available' : 'unavailable'} />
        </div>
        <p className="mt-2 text-sm text-muted line-clamp-3">{item.description}</p>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">{formatCurrency(item.price)}</span>
        <Button size="sm" variant="secondary" disabled={!item.is_available} onClick={() => onAdd(item)}>
          Add
        </Button>
      </div>
    </Card>
  )
}
