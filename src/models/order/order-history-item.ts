import type { Product } from '@/models/product/product.ts';

export interface OrderHistoryItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}
