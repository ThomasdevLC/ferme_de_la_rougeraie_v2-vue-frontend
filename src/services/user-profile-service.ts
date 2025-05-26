// src/services/user-profile-service.ts
import http from '@/services/api-client.ts'
import type { UserProfile } from '@/models/user/user-profile.ts'
import type { AxiosResponse } from 'axios'
import type { UserProfileUpdate } from '@/models/user/user-profile-update.ts'


export async function fetchUserProfile(): Promise<UserProfile> {
  const response = await http.get<UserProfile>('/api/me');
  return response.data;
}

export async function updateUserProfile(
  payload: UserProfileUpdate
): Promise<AxiosResponse<{ message: string; user?: UserProfile }>> {
  return await http.put<{ message: string; user?: UserProfile }>('/api/me', payload)
}
