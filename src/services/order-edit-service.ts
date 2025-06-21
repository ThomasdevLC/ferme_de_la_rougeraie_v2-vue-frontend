import apiClient from './api-client.ts';
import type { OrderHistory } from '@/models/order/order-history.ts';

export const updateOrder = (
  id: number,
  items: { productId: number; quantity: number }[],
  pickupDate: string
) => {
  return apiClient.put<OrderHistory>(`/api/orders/${id}`, {
    items,
    pickupDate
  });
};
