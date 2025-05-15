<!-- components/cart/CartItem.vue -->
<template>
  <div class="flex items-center justify-between border p-4 rounded shadow-sm">
    <div class="flex items-center space-x-4">
      <img
        :src="`${baseUrl}${item.product.image}`"
        :alt="item.product.name"
        class="w-20 h-20 object-cover rounded"
      />
      <div>
        <p class="font-semibold text-lg">{{ item.product.name }}</p>
        <p class="text-sm text-gray-500">
          {{ item.product.price.toFixed(2) }} € / {{ item.product.unit }}
        </p>
        <CartQuantity :product="item.product" :quantity="item.quantity" />

        <p class="text-sm text-gray-500">
          Total : {{ cart.getItemTotal(item) }}
        </p>
      </div>
    </div>

    <button
      @click="cart.removeFromCart(item.product.id)"
      class="text-red-500 hover:underline text-sm"
    >
      Supprimer
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { CartItem } from '@/models/CartItem'
import CartQuantity from './CartQuantity.vue'
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore()
const baseUrl = import.meta.env.VITE_API_BASE_URL;

defineProps<{
  item: CartItem
}>()
</script>
