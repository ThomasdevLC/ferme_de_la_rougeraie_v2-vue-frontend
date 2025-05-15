<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useUIStore } from '@/stores/uiStore';
import CartSidebar from '@/components/cart/CartSidebar.vue'

const ui = useUIStore();
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo cursor-pointer"
      src="@/assets/logo.svg"
      width="125"
      height="125"
      @click="ui.openCart"
    />

    <div class="wrapper">
      <nav>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/products">Produits</RouterLink>
        <RouterLink to="/cart">Panier</RouterLink>

      </nav>
    </div>
  </header>

  <RouterView />
  <CartSidebar />
</template>

