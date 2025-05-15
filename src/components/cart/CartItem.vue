<template>
  <div
    class="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 py-4 px-2"
  >
    <!-- Image produit + badge limité -->
    <div class="relative">
      <img
        :src="`${baseUrl}${item.product.image}`"
        :alt="item.product.name"
        class="w-10 h-10  rounded-full object-cover"
      />
      <div
        v-if="item.product.limited"
        class="absolute top-0 left-0 w-[13px] h-[13px] rounded-full bg-primary border-2 border-white"
      />
    </div>

    <!-- Infos produit -->
    <div class="flex-1 sm:w-48 text-center sm:text-left">
      <p class="font-medium leading-5">{{ item.product.name }}</p>
      <p class="text-xs text-gray-500 mt-1 hidden sm:block">
        {{ item.product.price.toFixed(2) }} € / {{ item.product.unit }}
      </p>
    </div>

    <!-- Quantité -->
    <div class="flex items-center mb-1 sm:mb-0">
      <CartQuantity :product="item.product" :quantity="item.quantity" />
    </div>

    <!-- Total -->
    <div class="text-right text-base font-semibold w-20 sm:w-24">
      {{ cart.getItemTotal(item) }}
    </div>

    <!-- Supprimer -->
    <button
      @click="cart.removeFromCart(item.product.id)"
      class="text-red-500 hover:text-black text-sm"
    >
      <span class="material-icons">clear</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { CartItem } from '@/models/CartItem'
import CartQuantity from './CartQuantity.vue'
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore()
const baseUrl = import.meta.env.VITE_API_BASE_URL

defineProps<{
  item: CartItem
}>()
</script>
