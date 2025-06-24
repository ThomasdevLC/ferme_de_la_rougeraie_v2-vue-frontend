import http from '@/services/api/api-client.ts'
import type { UserProfile } from '@/models/user/user-profile.ts'
import type { AxiosResponse } from 'axios'
import type { UserProfileUpdate } from '@/models/user/user-profile-update.ts'


export async function apiFetchUserProfile(): Promise<UserProfile> {
  const response = await http.get<UserProfile>('/api/me');
  return response.data;
}

export async function apiUpdateUserProfile(
  payload: UserProfileUpdate
): Promise<AxiosResponse<{ message: string; user?: UserProfile }>> {
  return await http.patch<{ message: string; user?: UserProfile }>('/api/me', payload)
}


export async function apiDeleteUserAccount(): Promise<AxiosResponse<{ message: string }>> {
  return await http.delete<{ message: string }>('/api/me')
}
