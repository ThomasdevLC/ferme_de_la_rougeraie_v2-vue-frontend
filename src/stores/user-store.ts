// src/stores/user-store.ts
import { defineStore } from 'pinia';
import type { UserProfile } from '@/models/user/user-profile.ts'
import type { UserProfileUpdate } from '@/models/user/user-profile-update.ts'
import { fetchUserProfile, updateUserProfile } from '@/services/user-profile-service';

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as UserProfile | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.profile,
    fullName: (state) => state.profile ? `${state.profile.firstName} ${state.profile.lastName}` : '',
    name: (state) => state.profile ? state.profile.firstName : '',

  },

  actions: {
    async loadProfile() {
      this.loading = true;
      this.error = null;
      try {
        this.profile = await fetchUserProfile();
      } catch (err: any) {
        this.error = 'Erreur lors du chargement du profil';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(payload: UserProfileUpdate) {
      this.loading = true;
      this.error = null;
      try {
        await updateUserProfile(payload);
        await this.loadProfile();
      } catch (err: any) {
        this.error = 'Erreur lors de la mise à jour du profil';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
});
