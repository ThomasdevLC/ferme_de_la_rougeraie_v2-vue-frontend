import apiClient from '../api/api-client.ts';

export const getOrders = () => {
  return apiClient.get('/api/orders');
};
