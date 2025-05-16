import apiClient from './apiClient';
import type { LoginPayload } from '@/models/login/LoginPayload.ts'


export const login = (credentials: LoginPayload) => {
  return apiClient.post('/api/login_check', credentials);
};
