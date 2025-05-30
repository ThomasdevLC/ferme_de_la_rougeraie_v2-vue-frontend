<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { onMounted, computed } from 'vue'
import CartModal from '@/components/cart/CartModal.vue'
import Navbar from '@/components/nav/NavBar.vue'
import { useUIStore } from '@/stores/ui-store'
import { useUserStore } from '@/stores/user-store'
import { useAuthStore } from '@/stores/auth-store'

const ui = useUIStore()
const user = useUserStore()
const auth = useAuthStore()

const router = useRouter()
const route = router.currentRoute

const displayNavbar = computed(() => route.value.path !== '/login')

async function initSession() {
  if (!auth.isTokenValid) {
    user.logout()
    return
  }

  if (auth.token && !user.profile) {
    try {
      await user.loadProfile()
    } catch {
      user.logout()
    }
  }
}

onMounted(() => {
  initSession()
})
</script>

<template>
  <header v-if="displayNavbar" class="fixed z-50 w-full">
    <Navbar />
  </header>
  <main @click="ui.closeUserMenu" class="relative min-h-screen text-text-color pt-64 pb-12">
    <img src="/assets/background.png"
         alt="Background"
         class="fixed inset-0 w-full h-full object-cover pointer-events-none z-0" />
    <RouterView />
    <CartModal class="z-60" />
  </main>
</template>
