import apiClient from './api-client.ts';
import type { CreateOrderPayload } from '@/models/order/create-order-payload.ts';

export const createOrder = (payload: CreateOrderPayload) => {
  return apiClient.post('/api/orders/create', payload);
};
