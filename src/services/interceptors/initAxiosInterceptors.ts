import type { Router } from 'vue-router'
import http from '@/services/api/api-client.ts'
import { useAuthStore } from '@/stores/auth-store.ts'
import { useUserStore } from '@/stores/user-store.ts'

export function initAxiosInterceptors(router: Router) {
  http.interceptors.response.use(
    response => response,
    (error) => {
      if (error.response?.status === 401) {
        const auth = useAuthStore()
        const user = useUserStore()

        auth.logout()
        user.logout()

        router.push('/login')
      }

      return Promise.reject(error)
    }
  )
}
