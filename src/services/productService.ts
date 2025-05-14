// src/services/productService.ts
import apiClient from './apiClient';
import type { Product } from '@/models/Product';

export const fetchProducts = () => {
  return apiClient.get<Product[]>('/products');
};
