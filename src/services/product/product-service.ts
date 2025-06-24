import apiClient from '../api/api-client.ts';
import type { Product } from '@/models/product/product.ts';

export const fetchProducts = () => {
  return apiClient.get<Product[]>('/api/products');
};
