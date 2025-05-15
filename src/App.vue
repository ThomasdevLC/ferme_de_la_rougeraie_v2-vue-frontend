<script setup lang="ts">
import {  RouterView } from 'vue-router';
import CartSidebar from '@/components/cart/CartSidebar.vue'
import Navbar from '@/components/nav/NavBar.vue';
</script>

<template>
  <header>
    <Navbar />
  </header>
  <RouterView />
  <CartSidebar />
</template>

