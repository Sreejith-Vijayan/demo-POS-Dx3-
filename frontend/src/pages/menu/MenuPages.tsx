import { Link, useParams } from 'react-router-dom'
import { PageLayout } from '@/layouts/AppLayout'
import { Card, DashboardCard } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSkeleton, EmptyState } from '@/components/ui/DataTable'
import { useMenu, useMenuCategories, useMenuItem } from '@/hooks/queries'
import { formatCurrency } from '@/utils/cn'

export function MenuPage() {
  const cats = useMenuCategories()
  const menu = useMenu()

  return (
    <PageLayout title="QR Menu" description="Customer-facing digital menu.">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(cats.data?.items ?? []).map((c: { id: number; name: string }) => (
          <Link key={c.id} to={`/menu/categories?c=${c.id}`}>
            <Button size="sm" variant="outline" className="shrink-0">
              {c.name}
            </Button>
          </Link>
        ))}
      </div>
      {menu.isLoading ? <LoadingSkeleton /> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {(menu.data?.items ?? []).map((item: { id: number; name: string; price: number; description?: string; is_veg: boolean }) => (
          <Link key={item.id} to={`/menu/item/${item.id}`}>
            <Card className="h-full hover:border-brand-300">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{item.description}</p>
                </div>
                <span className="text-sm font-semibold text-brand-800">{formatCurrency(item.price)}</span>
              </div>
              <p className="mt-2 text-[11px] text-muted">{item.is_veg ? '● Veg' : '● Non-veg'}</p>
            </Card>
          </Link>
        ))}
      </div>
    </PageLayout>
  )
}

export function MenuCategoriesPage() {
  const cats = useMenuCategories()
  return (
    <PageLayout title="Categories" description="Browse by category.">
      {cats.isLoading ? <LoadingSkeleton /> : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(cats.data?.items ?? []).map((c: { id: number; name: string; description?: string }) => (
          <Link key={c.id} to="/menu">
            <Card className="hover:border-brand-300">
              <p className="font-semibold">{c.name}</p>
              <p className="mt-1 text-xs text-muted">{c.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </PageLayout>
  )
}

export function MenuItemPage() {
  const { id } = useParams()
  const itemId = Number(id)
  const { data, isLoading, isError } = useMenuItem(itemId)

  return (
    <PageLayout
      title={data?.name ?? 'Menu item'}
      description="Item detail — TODO: add to cart from QR."
      actions={
        <Link to="/menu">
          <Button size="sm" variant="outline">
            Back
          </Button>
        </Link>
      }
    >
      {isLoading ? <LoadingSkeleton /> : null}
      {isError || data?.detail ? <EmptyState title="Item not found" /> : null}
      {data && !data.detail ? (
        <DashboardCard title={data.name} description={data.description}>
          <p className="text-2xl font-semibold text-brand-800">{formatCurrency(Number(data.price))}</p>
          <p className="mt-2 text-sm text-muted">
            {data.is_veg ? 'Vegetarian' : 'Non-vegetarian'} ·{' '}
            {data.is_available ? 'Available' : 'Unavailable'}
          </p>
          <Button className="mt-4" disabled>
            Add to order (TODO)
          </Button>
        </DashboardCard>
      ) : null}
    </PageLayout>
  )
}
