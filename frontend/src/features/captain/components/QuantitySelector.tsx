import { Button } from '@/components/ui/Button'

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
}: {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white px-2 py-1">
      <Button type="button" variant="outline" size="sm" onClick={onDecrease} disabled={quantity <= 1}>
        -
      </Button>
      <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
      <Button type="button" variant="outline" size="sm" onClick={onIncrease}>
        +
      </Button>
    </div>
  )
}
