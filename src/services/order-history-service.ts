import apiClient from './api-client.ts';

export const getOrders = () => {
  return apiClient.get('/api/orders');
};
