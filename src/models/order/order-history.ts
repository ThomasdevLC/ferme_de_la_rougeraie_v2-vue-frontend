import type { OrderHistoryItem } from '@/models/order/order-history-item.ts'

export interface OrderHistory {
  id: number;
  total: number;
  pickup: 'TUESDAY' | 'THURSDAY';
  createdAt: string;
  done: boolean;
  items: OrderHistoryItem[];
}
