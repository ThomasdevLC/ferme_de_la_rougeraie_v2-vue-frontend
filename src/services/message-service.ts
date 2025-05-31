import apiClient from './api-client.ts';
import type { Message } from '@/models/message/message.ts';

export const fetchMessages = async () => {
  const response = await apiClient.get<Message[]>('/api/messages');
  return response.data;
};
