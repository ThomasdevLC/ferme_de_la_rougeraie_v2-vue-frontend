import apiClient from './api-client.ts';
import type { Product } from '@/models/product/product.ts';

export const fetchProducts = () => {
  return apiClient.get<Product[]>('/products');
};
