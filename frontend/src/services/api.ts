import apiClient from '@/api/client'

export const dashboardApi = {
  getStats: () => apiClient.get('/dashboard').then((r) => r.data),
  getOverview: () => apiClient.get('/dashboard/overview').then((r) => r.data),
  getSales: () => apiClient.get('/dashboard/sales').then((r) => r.data),
}

export const menuApi = {
  list: (categoryId?: number) =>
    apiClient
      .get('/menu', { params: categoryId ? { category_id: categoryId } : undefined })
      .then((r) => r.data),
  categories: () => apiClient.get('/menu/categories').then((r) => r.data),
  getItem: (id: number) => apiClient.get(`/menu/items/${id}`).then((r) => r.data),
}

export const ordersApi = {
  list: () => apiClient.get('/orders').then((r) => r.data),
  create: (payload: unknown) => apiClient.post('/orders', payload).then((r) => r.data),
  update: (id: number, payload: unknown) =>
    apiClient.put(`/orders/${id}`, payload).then((r) => r.data),
}

export const captainApi = {
  tables: () => apiClient.get('/captain/tables').then((r) => r.data),
  orders: () => apiClient.get('/captain/orders').then((r) => r.data),
  sendKot: (orderId: number) => apiClient.post(`/captain/kot/${orderId}`).then((r) => r.data),
}

export const kitchenApi = {
  orders: () => apiClient.get('/kitchen/orders').then((r) => r.data),
  updateStatus: (id: number, status: string) =>
    apiClient.put(`/kitchen/status/${id}`, { status }).then((r) => r.data),
  history: () => apiClient.get('/kitchen/history').then((r) => r.data),
}

export const cashierApi = {
  billing: () => apiClient.get('/cashier/billing').then((r) => r.data),
  payments: () => apiClient.get('/cashier/payments').then((r) => r.data),
  createPayment: (payload: unknown) =>
    apiClient.post('/cashier/payments', payload).then((r) => r.data),
  history: () => apiClient.get('/cashier/history').then((r) => r.data),
}

export const inventoryApi = {
  list: () => apiClient.get('/inventory').then((r) => r.data),
}

export const reportsApi = {
  sales: () => apiClient.get('/reports/sales').then((r) => r.data),
}

export const employeesApi = {
  list: () => apiClient.get('/employees').then((r) => r.data),
}

export const customersApi = {
  list: () => apiClient.get('/customers').then((r) => r.data),
}

export const settingsApi = {
  list: () => apiClient.get('/settings').then((r) => r.data),
}

export const notificationsApi = {
  list: () => apiClient.get('/notifications').then((r) => r.data),
}

export const feedbackApi = {
  list: () => apiClient.get('/feedback').then((r) => r.data),
  submit: (payload: unknown) => apiClient.post('/feedback', payload).then((r) => r.data),
}

export const authApi = {
  me: () => apiClient.get('/auth/me').then((r) => r.data),
  roles: () => apiClient.get('/auth/roles').then((r) => r.data),
}
