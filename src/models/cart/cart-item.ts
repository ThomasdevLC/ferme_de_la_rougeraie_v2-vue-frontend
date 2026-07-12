import type { Product, ProductVariant } from '../product/product.ts';

export interface CartItem {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
  maxAllowed?: number | null;
}
