<script setup lang="ts">
import { RouterView } from 'vue-router'
import CartSidebar from '@/components/cart/CartSidebar.vue'
import Navbar from '@/components/nav/NavBar.vue'
import { useUIStore } from '@/stores/ui-store'

const ui = useUIStore()


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
