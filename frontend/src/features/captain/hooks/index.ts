import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { captainApi } from '@/features/captain/api'
import { menuApi } from '@/services/api'
import type { CaptainTable, CaptainOrderSummary, OrderHistoryItem } from '@/features/captain/types'

export function useTables() {
  return useQuery<{ items: CaptainTable[]; total: number }, Error>({
    queryKey: ['captain', 'tables'],
    queryFn: captainApi.tables,
  })
}

export function useCaptainOrders() {
  return useQuery<{ items: CaptainOrderSummary[]; total: number }, Error>({
    queryKey: ['captain', 'orders'],
    queryFn: captainApi.orders,
  })
}

export function useMenu() {
  return useQuery({
    queryKey: ['menu'],
    queryFn: menuApi.list,
  })
}

export function useMenuCategories() {
  return useQuery({
    queryKey: ['menu', 'categories'],
    queryFn: menuApi.categories,
  })
}

export function useOrder(orderId: number) {
  return useQuery<Order, Error>({
    queryKey: ['order', orderId],
    queryFn: () => captainApi.orderStatus(orderId),
    enabled: orderId > 0,
  })
}

export function useOrderStatus(orderId: number) {
  return useQuery({
    queryKey: ['order', orderId, 'status'],
    queryFn: () => captainApi.orderStatus(orderId),
    enabled: orderId > 0,
    refetchInterval: 10000,
  })
}

export function useCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: captainApi.createOrder,
    onSuccess: () => {
        qc.invalidateQueries({
            queryKey: ['captain', 'orders'],
        })
    },
})
}

export function useUpdateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, payload }) =>
        captainApi.updateOrder(orderId, payload),
    onSuccess: () => {
        qc.invalidateQueries({
            queryKey: ['captain', 'orders'],
        })
    },
})
}

export function useHoldOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (orderId: number) => captainApi.holdOrder(orderId),

    onSuccess: () => qc.invalidateQueries({ queryKey: ['captain', 'orders'] }),
  })
}

export function useResumeOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (orderId: number) =>
        captainApi.resumeOrder(orderId),
    onSuccess: () => {
        qc.invalidateQueries({
            queryKey: ['captain', 'orders'],
        })
    },
})
}

export function useSendKOT() {
  const qc = useQueryClient()
    return useMutation({
    mutationFn: (orderId: number) =>
        captainApi.sendKot(orderId),
    onSuccess: () => {
        qc.invalidateQueries({
            queryKey: ['captain', 'orders'],
        })
    },
})
}

export function useCancelItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, payload }) =>
        captainApi.cancelItem(orderId, payload),
    onSuccess: () => {
        qc.invalidateQueries({
            queryKey: ['captain', 'orders'],
        })
    },
})
}

export function useOrderHistory(tableId: number) {
  return useQuery<{ items: OrderHistoryItem[]; total: number }, Error>({
    queryKey: ['captain', 'history', tableId],
    queryFn: () => captainApi.orderHistory(tableId),
    enabled: tableId > 0,
  })
}
