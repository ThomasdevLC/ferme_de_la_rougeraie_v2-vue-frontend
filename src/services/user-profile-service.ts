// src/services/user-profile-service.ts
import http from '@/services/api-client.ts';
import type { UserProfile } from '@/models/user/user-profile.ts'



export interface UpdateUserProfilePayload {
  phone: string;
  plainPassword?: string | null;
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const response = await http.get<UserProfile>('/api/me');
  return response.data;
}

export async function updateUserProfile(payload: UpdateUserProfilePayload): Promise<void> {
  await http.put('/api/me', payload);
}
