import type { Product } from '../product/Product.ts';

export interface CartItem {
  product: Product;
  quantity: number;
}
