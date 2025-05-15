import apiClient from './apiClient';

interface LoginPayload {
  email: string;
  password: string;
}

export const login = (credentials: LoginPayload) => {
  return apiClient.post('/api/login_check', credentials);
};
