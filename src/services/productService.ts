import apiClient from './apiClient';
import type { Product } from '@/models/product/Product.ts';

export const fetchProducts = () => {
  return apiClient.get<Product[]>('/products');
};
