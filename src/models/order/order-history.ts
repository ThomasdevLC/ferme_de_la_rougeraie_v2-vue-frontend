import type { OrderHistoryItem } from '@/models/order/order-history-item.ts'

export interface OrderHistory {
  id: number;
  total: number;
  pickupDate: string;
  pickupDay: number;
  createdAt: string;
  done: boolean;
  isEditable: boolean;
  items: OrderHistoryItem[];
}
