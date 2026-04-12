import { createRouter, createWebHistory } from 'vue-router'
import ProductView from '@/views/ProductView.vue'
import { useAuthStore } from '@/stores/auth-store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      redirect: '/about'
    },

    {
      path: '/products',
      name: 'products',
      component: ProductView,
    },

    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    }
    ,
    {
      path: '/orders',
      name: 'order-history',
      component: () => import('@/views/OrderHistoryView.vue'),
      meta: { requiresAuth: true }
    },

    {
      path: '/profile/edit',
      name: 'EditProfile',
      component: () => import('@/views/EditProfileView.vue'),
      meta: { requiresAuth: true }
    }

  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const auth = useAuthStore()
    if (!auth.isTokenValid) {
      return { name: 'login' }
    }
  }
})

export default router
