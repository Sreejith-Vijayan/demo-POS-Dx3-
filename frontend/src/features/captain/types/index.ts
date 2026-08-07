
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'billing' | 'merged' | 'cleaning'

export interface CaptainTable {
  id: number
  number: number
  name: string
  capacity: number
  status: TableStatus
  floor?: string
}

export interface MenuItem {
  id: number
  name: string
  description?: string
  price: number
  category_id: number
  is_veg: boolean
  is_available: boolean
  preparation_time_mins: number
  image_url?: string
}

export interface OrderItemPayload {
  menu_item_id: number
  quantity: number
  notes?: string
}

export interface OrderItem {
  id: number
  menu_item_id: number
  name?: string
  quantity: number
  unit_price: number
  total_price: number
  status: string
  kot_sent: boolean
  notes?: string
}

export interface Order {
  id: number
  order_number: string
  table_id?: number
  customer_id?: number
  status: string
  order_type: string
  subtotal: number
  tax_amount: number
  total_amount: number
  items: OrderItem[]
}

export interface CaptainOrderSummary {
  id: number
  order_number: string
  status: string
  total_amount: number
  table_id?: number
}

export interface OrderHistoryItem {
  id: number
  order_number: string
  status: string
  total_amount: number
  table_id?: number
  created_at?: string
}
