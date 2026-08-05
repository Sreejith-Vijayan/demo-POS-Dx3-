import { useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { PageLayout } from '@/layouts/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card, DashboardCard } from '@/components/ui/Card'
import { EmptyState, LoadingSkeleton } from '@/components/ui/DataTable'
import { CategoryTabs } from '@/features/captain/components/CategoryTabs'
import { MenuCard } from '@/features/captain/components/MenuCard'
import { OrderSummary } from '@/features/captain/components/OrderSummary'
import { QuantitySelector } from '@/features/captain/components/QuantitySelector'
import { useMenuCategories, useMenu } from '@/features/captain/hooks'
import { useCreateOrder, useHoldOrder, useSendKOT } from '@/features/captain/hooks'
import type { MenuItem, OrderItemPayload } from '@/features/captain/types'

const defaultItem = (item: MenuItem): OrderItemPayload => ({ menu_item_id: item.id, quantity: 1, notes: '' })

export function CaptainOrderPage() {
  const params = useParams()
  const tableId = Number(params.tableId ?? 0)
  const navigate = useNavigate()
  const menu = useMenu()
  const categories = useMenuCategories()
  const createOrder = useCreateOrder()
  const holdOrder = useHoldOrder()
  const sendKot = useSendKOT()

  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [cart, setCart] = useState<OrderItemPayload[]>([])

  const filteredItems = useMemo(() => {
    return (menu.data?.items ?? [])
      .filter((item) => item.is_available)
      .filter((item) => (categoryId ? item.category_id === categoryId : true))
      .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase()))
  }, [menu.data, categoryId, search])

  const addItem = (item: MenuItem) => {
    setCart((current) => {
      const existing = current.find((entry) => entry.menu_item_id === item.id)
      if (existing) {
        return current.map((entry) =>
          entry.menu_item_id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
        )
      }
      return [...current, defaultItem(item)]
    })
  }

  const changeQuantity = (menu_item_id: number, delta: number) => {
    setCart((current) =>
      current
        .map((entry) =>
          entry.menu_item_id === menu_item_id
            ? { ...entry, quantity: Math.max(1, entry.quantity + delta) }
            : entry,
        )
        .filter((entry) => entry.quantity > 0),
    )
  }

  const removeItem = (menu_item_id: number) => {
    setCart((current) => current.filter((entry) => entry.menu_item_id !== menu_item_id))
  }

  const isEmpty = cart.length === 0

  return (
    <PageLayout
      title={tableId ? `Table ${tableId}` : 'New order'}
      description="Browse menu, add items, and send KOT."
      actions={
        <Link to="/captain/tables">
          <Button size="sm" variant="outline">Back to tables</Button>
        </Link>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <DashboardCard title="Menu browser">
            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search menu items"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm focus:border-brand-300 focus:outline-none sm:max-w-md"
                />
                <CategoryTabs
                  categories={categories.data?.items ?? []}
                  selectedCategory={categoryId}
                  onSelect={setCategoryId}
                />
              </div>
              {menu.isLoading ? <LoadingSkeleton /> : null}
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <MenuCard key={item.id} item={item} onAdd={addItem} />
                ))}
              </div>
              {!menu.isLoading && !filteredItems.length ? (
                <EmptyState title="No matching menu items" description="Try another search or category." />
              ) : null}
            </div>
          </DashboardCard>
        </div>

        <div className="space-y-4">
          <OrderSummary
            items={cart.map((item, index) => ({
              id: item.menu_item_id,
              menu_item_id: item.menu_item_id,
              quantity: item.quantity,
              unit_price: menu.data?.items.find((m) => m.id === item.menu_item_id)?.price ?? 0,
              total_price: (menu.data?.items.find((m) => m.id === item.menu_item_id)?.price ?? 0) * item.quantity,
              status: 'pending',
              kot_sent: false,
              notes: item.notes,
            }))}
            onIncrease={(id) => changeQuantity(id, 1)}
            onDecrease={(id) => changeQuantity(id, -1)}
            onRemove={removeItem}
          />

          <div className="grid gap-3">
            <Button
              size="lg"
              onClick={() => createOrder.mutate({ table_id: tableId || undefined, order_type: 'dine_in', items: cart })}
              disabled={isEmpty || createOrder.isLoading}
            >
              Start order
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => holdOrder.mutate(0)}
              disabled={isEmpty || holdOrder.isLoading}
            >
              Hold order
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => sendKot.mutate(0)}
              disabled={isEmpty || sendKot.isLoading}
            >
              Send to Kitchen
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">Order status updates every 10 seconds after send.</p>
        <Button size="sm" variant="ghost" onClick={() => navigate('/captain/orders')}>
          View running orders
        </Button>
      </div>
    </PageLayout>
  )
}
