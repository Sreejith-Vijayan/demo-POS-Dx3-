import { useQuery } from '@tanstack/react-query'
import {
  captainApi,
  cashierApi,
  customersApi,
  dashboardApi,
  employeesApi,
  feedbackApi,
  inventoryApi,
  kitchenApi,
  menuApi,
  notificationsApi,
  ordersApi,
  reportsApi,
  settingsApi,
} from '@/services/api'

export function useDashboard() {
  return useQuery({ queryKey: ['dashboard'], queryFn: dashboardApi.getStats })
}

export function useDashboardSales() {
  return useQuery({ queryKey: ['dashboard', 'sales'], queryFn: dashboardApi.getSales })
}

export function useMenu(categoryId?: number) {
  return useQuery({
    queryKey: ['menu', categoryId],
    queryFn: () => menuApi.list(categoryId),
  })
}

export function useMenuCategories() {
  return useQuery({ queryKey: ['menu', 'categories'], queryFn: menuApi.categories })
}

export function useMenuItem(id: number) {
  return useQuery({
    queryKey: ['menu', 'item', id],
    queryFn: () => menuApi.getItem(id),
    enabled: Number.isFinite(id) && id > 0,
  })
}

export function useOrders() {
  return useQuery({ queryKey: ['orders'], queryFn: ordersApi.list })
}

export function useCaptainTables() {
  return useQuery({ queryKey: ['captain', 'tables'], queryFn: captainApi.tables })
}

export function useCaptainOrders() {
  return useQuery({ queryKey: ['captain', 'orders'], queryFn: captainApi.orders })
}

export function useKitchenOrders() {
  return useQuery({
    queryKey: ['kitchen', 'orders'],
    queryFn: kitchenApi.orders,
    refetchInterval: 10_000,
  })
}

export function useKitchenHistory() {
  return useQuery({ queryKey: ['kitchen', 'history'], queryFn: kitchenApi.history })
}

export function useBillingQueue() {
  return useQuery({ queryKey: ['cashier', 'billing'], queryFn: cashierApi.billing })
}

export function usePayments() {
  return useQuery({ queryKey: ['cashier', 'payments'], queryFn: cashierApi.payments })
}

export function useInventory() {
  return useQuery({ queryKey: ['inventory'], queryFn: inventoryApi.list })
}

export function useReports() {
  return useQuery({ queryKey: ['reports', 'sales'], queryFn: reportsApi.sales })
}

export function useEmployees() {
  return useQuery({ queryKey: ['employees'], queryFn: employeesApi.list })
}

export function useCustomers() {
  return useQuery({ queryKey: ['customers'], queryFn: customersApi.list })
}

export function useSettings() {
  return useQuery({ queryKey: ['settings'], queryFn: settingsApi.list })
}

export function useNotifications() {
  return useQuery({ queryKey: ['notifications'], queryFn: notificationsApi.list })
}

export function useFeedback() {
  return useQuery({ queryKey: ['feedback'], queryFn: feedbackApi.list })
}
