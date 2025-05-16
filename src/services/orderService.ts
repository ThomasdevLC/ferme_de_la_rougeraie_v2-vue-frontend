import apiClient from './apiClient';

interface OrderItem {
  productId: number;
  quantity: number;
}

interface CreateOrderPayload {
  pickup: 'TUESDAY' | 'THURSDAY';
  items: OrderItem[];
}

export const createOrder = (payload: CreateOrderPayload) => {
  return apiClient.post('/api/orders/create', payload);
};
