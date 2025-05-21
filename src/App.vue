<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import CartSidebar from '@/components/cart/CartSidebar.vue'
import Navbar from '@/components/nav/NavBar.vue'
import { useUserStore } from '@/stores/user-store.ts'

const user = useUserStore()

onMounted(() => {
  user.loadProfile()
})
</script>

<template>
  <header>
    <Navbar />
  </header>
  <main>
    <RouterView />
    <CartSidebar />
  </main>
</template>
