import apiClient from '../api/api-client.ts'
import type { OrderHistory } from '@/models/order/order-history.ts'

export const getOrders = async (): Promise<OrderHistory[]> => {
  const response = await apiClient.get<OrderHistory[]>('/api/orders')
  return response.data
}
