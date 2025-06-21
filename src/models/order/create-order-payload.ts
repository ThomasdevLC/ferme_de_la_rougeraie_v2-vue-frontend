import type { OrderItem } from '@/models/order/order-item.ts'

export interface CreateOrderPayload {
  pickupDate: string;
  items: OrderItem[];
}
