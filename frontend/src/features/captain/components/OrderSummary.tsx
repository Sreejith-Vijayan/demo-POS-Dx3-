import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { QuantitySelector } from '@/features/captain/components/QuantitySelector'
import { formatCurrency } from '@/utils/cn'
import type { OrderItem } from '@/features/captain/types'

export function OrderSummary({
  items,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  items: OrderItem[]
  onIncrease: (itemId: number) => void
  onDecrease: (itemId: number) => void
  onRemove: (itemId: number) => void
}) {
  const subtotal = items.reduce((sum, item) => sum + item.total_price, 0)
  const tax = Number((subtotal * 0.05).toFixed(0))
  const total = subtotal + tax
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold">Order summary</p>
          <p className="text-sm text-muted">{quantity} items selected</p>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-black/10 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">{item.name ?? `Item ${item.menu_item_id}`}</p>
                <p className="mt-1 text-xs text-muted">{formatCurrency(item.unit_price)} each</p>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(item.total_price)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <QuantitySelector
                quantity={item.quantity}
                onIncrease={() => onIncrease(item.id)}
                onDecrease={() => onDecrease(item.id)}
              />
              <Button size="sm" variant="danger" onClick={() => onRemove(item.id)}>
                Remove
              </Button>
            </div>
            {item.notes ? <p className="mt-3 text-sm text-muted">Notes: {item.notes}</p> : null}
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-2 border-t border-black/10 pt-4 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>GST (5%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <span>Grand total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </Card>
  )
}
