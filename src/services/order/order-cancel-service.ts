import apiClient from '../api/api-client.ts';

export const cancelOrder = (id: number) => {
  return apiClient.delete<void>(`/api/orders/${id}`);
};
