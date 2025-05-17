// auth-store.ts
import { defineStore } from 'pinia'
import { AUTH_TOKEN_KEY } from '@/constants/storageKeys'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(AUTH_TOKEN_KEY) || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem(AUTH_TOKEN_KEY, token)
    },
    logout() {
      this.token = null
      localStorage.removeItem(AUTH_TOKEN_KEY)
    },
  },
})
