import apiClient from './api-client.ts';
import type { OrderHistory } from '@/models/order/order-history.ts';

export const getOneOrder = (id: number) => {
  return apiClient.get<OrderHistory>(`/api/orders/${id}`);
};
