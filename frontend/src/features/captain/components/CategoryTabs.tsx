import { Button } from '@/components/ui/Button'

export function CategoryTabs({
  categories,
  selectedCategory,
  onSelect,
}: {
  categories: { id: number; name: string }[]
  selectedCategory: number | null
  onSelect: (id: number | null) => void
}) {
  return (
    <div className="flex min-w-0 flex-wrap gap-2 overflow-x-auto pb-1">
      <Button
        size="sm"
        variant={selectedCategory === null ? 'secondary' : 'outline'}
        className="shrink-0"
        onClick={() => onSelect(null)}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          size="sm"
          variant={selectedCategory === category.id ? 'secondary' : 'outline'}
          className="shrink-0"
          onClick={() => onSelect(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  )
}
