import apiClient from '../api/api-client.ts';
import type { LoginPayload } from '@/models/login/login-payload.ts'


export const login = (credentials: LoginPayload) => {
  return apiClient.post('/api/login_check', credentials);
};
