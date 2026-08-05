/** Feature module type stubs — extend per domain in later phases. */

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'billed'
  | 'paid'
  | 'cancelled'

export interface MenuItem {
  id: number
  name: string
  description?: string
  price: number
  category_id: number
  is_veg: boolean
  is_available: boolean
}

export interface TableEntity {
  id: number
  number: number
  name: string
  capacity: number
  status: string
  floor?: string
}

export interface OrderSummary {
  id: number
  order_number: string
  table_id?: number
  status: OrderStatus | string
  total_amount: number
}
