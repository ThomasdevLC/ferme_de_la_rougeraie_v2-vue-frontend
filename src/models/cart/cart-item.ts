import type { Product } from '../product/product.ts';

export interface CartItem {
  product: Product;
  quantity: number;
}
