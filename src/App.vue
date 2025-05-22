<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import CartSidebar from '@/components/cart/CartSidebar.vue'
import Navbar from '@/components/nav/NavBar.vue'
import { useUIStore } from '@/stores/ui-store'
import { useUserStore } from '@/stores/user-store'
import { useAuthStore } from '@/stores/auth-store'

const ui = useUIStore()
const user = useUserStore()
const auth = useAuthStore()

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
  <header>
    <Navbar />
  </header>
  <main @click="ui.closeUserMenu">
    <RouterView />
    <CartSidebar />
  </main>
</template>
