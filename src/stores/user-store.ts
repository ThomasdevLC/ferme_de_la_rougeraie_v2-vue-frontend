// src/stores/user-store.ts
import { defineStore } from 'pinia';
import type { UserProfile } from '@/models/user/user-profile.ts'
import type { UserProfileUpdate } from '@/models/user/user-profile-update.ts'
import { fetchUserProfile, updateUserProfile } from '@/services/user-profile-service';
import { useAuthStore } from '@/stores/auth-store.ts'
import type { AxiosResponse } from 'axios'


export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as UserProfile | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.profile,
    fullName: (state) => state.profile ? `${state.profile.firstName} ${state.profile.lastName}` : '',
    firstName: (state) => state.profile ? state.profile.firstName : '',

  },

  actions: {
    async loadProfile() {
      this.loading = true;
      this.error = null;
      try {
        this.profile = await fetchUserProfile();
      } catch  {
        this.error = 'Erreur lors du chargement du profil';
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(
      payload: UserProfileUpdate
    ): Promise<AxiosResponse<{ message: string; user?: UserProfile }>> {
      this.loading = true
      this.error = null
      try {
        const response = await updateUserProfile(payload)
        if (response.data.user) {
          this.profile = response.data.user
        }
        return response
      } catch (err: any) {
        this.error = err.response?.data?.error
        throw err
      } finally {
        this.loading = false
      }
    },

    logout() {
      const auth = useAuthStore()
      auth.logout()
      this.profile = null
    }
  },
});
