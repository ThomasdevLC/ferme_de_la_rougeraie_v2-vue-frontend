import { defineStore } from 'pinia'
import type { UserProfile } from '@/models/user/user-profile.ts'
import type { UserProfileUpdate } from '@/models/user/user-profile-update.ts'
import {
  apiFetchUserProfile, apiDeleteUserAccount, apiUpdateUserProfile
} from '@/services/user/user-profile-service.ts'
import { useAuthStore } from '@/stores/auth-store.ts'
import type { AxiosResponse } from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as UserProfile | null,
    loading: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.profile,
    fullName: (state) =>
      state.profile ? `${state.profile.firstName} ${state.profile.lastName}` : '',
    firstName: (state) => (state.profile ? state.profile.firstName : ''),
  },

  actions: {
    async loadProfile(): Promise<UserProfile> {
      const profile = await apiFetchUserProfile()
      this.profile = profile
      return profile
    },

    async updateUserProfile(
      payload: UserProfileUpdate
    ): Promise<AxiosResponse<{ message: string; user?: UserProfile }>> {
      const response = await apiUpdateUserProfile(payload)

      if (response.data.user) {
        this.profile = response.data.user
      }

      return response
    },

    async deleteUserAccount(): Promise<AxiosResponse<{ message: string }>> {
      return await apiDeleteUserAccount()
    },


    logout() {
      const auth = useAuthStore()
      auth.logout()
      this.profile = null
    },
  },
})
