<template>
  <div
    class="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-200 py-5 px-12"
  >
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

    <div class="flex-1 sm:w-48 text-center sm:text-left">
      <p class="font-medium leading-5">{{ item.product.name }}</p>
      <p class="text-xs text-gray-500 mt-1 hidden sm:block">
        {{ item.product.price.toFixed(2) }} € / {{ item.product.unit }}
      </p>
    </div>

    <div class="flex items-center mb-1 sm:mb-0">
      <CartQuantity :product="item.product" :quantity="item.quantity" />
    </div>

    <div class="text-right text-base w-20 sm:w-24">
      {{ cart.getItemTotal(item) }}
    </div>

    <button
      @click="cart.removeFromCart(item.product.id)"
      class="text-gray-4 hover:text-black text-sm cursor-pointer transition "
    >
      <X class="w-5 h-5" :stroke-width="1.5" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { CartItem } from '@/models/cart/cart-item.ts'
import CartQuantity from './CartQuantity.vue'
import { useCartStore } from '@/stores/cart-store.ts'
import { X } from 'lucide-vue-next'

const cart = useCartStore()
const baseUrl = import.meta.env.VITE_API_BASE_URL

defineProps<{
  item: CartItem
}>()
</script>
