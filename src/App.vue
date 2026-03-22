<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { onMounted, computed } from 'vue'
import CartModal from '@/components/cart/CartModal.vue'
import Navbar from '@/components/nav/NavBar.vue'
import image from "/assets/about/background.png";
import { useUIStore } from '@/stores/ui-store'
import { useUserStore } from '@/stores/user-store'
import { useAuthStore } from '@/stores/auth-store'
import { useMessageStore } from '@/stores/message-store'

const ui = useUIStore()
const user = useUserStore()
const auth = useAuthStore()
const messageStore = useMessageStore()

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
  messageStore.loadMessages()

})
</script>

<template>
  <header v-if="displayNavbar" class="fixed z-50 w-full">
    <Navbar />
  </header>

  <main @click="ui.closeUserMenu" class="relative min-h-screen text-text-color pt-80 md:pt-60 pb-12" :style="{ 'background-image': `url(${image})` }">
    <RouterView />
    <CartModal class="z-60" />
  </main>
</template>

<style>
.p-button {
  background-color: #fe8401 !important;
  border-color: #fe8401 !important;
  color: #ffffff !important;
}

.p-inputtext:hover {
  border-color: #fe8401 !important;
}
</style>
