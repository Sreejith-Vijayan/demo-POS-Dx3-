import apiClient from '@/api/client'
import type {
  CaptainOrderSummary,
  Order,
  OrderHistoryItem,
  OrderItemPayload,
  TableStatus,
  CaptainTable,
} from '@/features/captain/types'

export const captainApi = {
  tables: () => apiClient.get<{ items: CaptainTable[]; total: number }>('/captain/tables').then((r) => r.data),
  orders: () => apiClient.get<{ items: CaptainOrderSummary[]; total: number }>('/captain/orders').then((r) => r.data),
  createOrder: (payload: { table_id?: number; customer_id?: number; order_type: string; items: OrderItemPayload[]; notes?: string }) =>
    apiClient.post<Order>('/orders', payload).then((r) => r.data),
  updateOrder: (orderId: number, payload: { status?: string; notes?: string; items?: OrderItemPayload[] }) =>
    apiClient.put<Order>(`/orders/${orderId}`, payload).then((r) => r.data),
  holdOrder: (orderId: number) => apiClient.post(`/orders/${orderId}/hold`).then((r) => r.data),
  resumeOrder: (orderId: number) => apiClient.post(`/orders/${orderId}/resume`).then((r) => r.data),
  sendKot: (orderId: number) => apiClient.post(`/orders/${orderId}/send-kot`).then((r) => r.data),
  cancelItem: (orderId: number, payload: { order_item_id: number; reason: string }) =>
    apiClient.post(`/orders/${orderId}/cancel-item`, payload).then((r) => r.data),
  orderStatus: (orderId: number) => apiClient.get(`/orders/${orderId}/status`).then((r) => r.data),
  ordersByTable: (tableId: number) => apiClient.get<{ items: OrderHistoryItem[]; total: number }>(`/orders/table/${tableId}`).then((r) => r.data),
  orderHistory: (tableId: number) => apiClient.get<{ items: OrderHistoryItem[]; total: number }>(`/orders/history/${tableId}`).then((r) => r.data),
}
