import apiClient from '../api/api-client.ts';
import type { OrderHistory } from '@/models/order/order-history.ts';
import type { CreateOrderPayload } from '@/models/order/create-order-payload.ts'

export const updateOrder = (
  id: number,
  payload: CreateOrderPayload
) => {
  return apiClient.put<OrderHistory>(`/api/orders/${id}`, payload);
};
