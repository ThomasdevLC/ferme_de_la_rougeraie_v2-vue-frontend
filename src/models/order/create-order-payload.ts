import type { OrderItem } from '@/models/order/order-item.ts'

export interface CreateOrderPayload {
  pickup: 'TUESDAY' | 'THURSDAY';
  items: OrderItem[];
}
