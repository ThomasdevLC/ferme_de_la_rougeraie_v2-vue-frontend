<template>
  <div class="border-b border-gray-200 py-3 px-4 md:flex md:flex-row md:items-center md:justify-between md:gap-4 md:py-5 md:px-12">

    <!-- Ligne 1 : image + nom + X (mobile) -->
    <div class="flex items-center gap-3">
      <div class="relative shrink-0">
        <img
          :src="`${baseUrl}${item.product.image}`"
          :alt="item.product.name"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div
          v-if="item.product.limited"
          class="absolute top-0 left-0 w-[13px] h-[13px] rounded-full bg-primary border-2 border-white"
        />
      </div>

      <div class="flex-1 min-w-0 md:w-48">
        <p class="font-medium leading-5 text-sm">{{ item.product.name }}</p>
        <p class="text-xs text-gray-500 mt-1 hidden md:block">
          {{ item.product.price.toFixed(2) }} € / {{ item.product.unit }}
        </p>
      </div>

      <button
        class="ml-auto md:hidden text-gray-4 hover:text-black cursor-pointer transition"
        @click="cart.removeFromCart(item.product.id)"
      >
        <X class="w-5 h-5" :stroke-width="1.5" />
      </button>
    </div>

    <!-- Ligne 2 : quantité + prix (mobile) -->
    <div class="flex items-center justify-between mt-2 md:hidden">
      <CartQuantity :product="item.product" :quantity="item.quantity" />
      <span class="font-roboto text-base">{{ getItemTotal(item) }}</span>
    </div>

    <!-- Desktop : quantité, prix, X séparés -->
    <div class="hidden md:flex items-center">
      <CartQuantity :product="item.product" :quantity="item.quantity" />
    </div>
    <div class="hidden md:block text-right font-roboto text-base w-20">
      {{ getItemTotal(item) }}
    </div>
    <button
      class="hidden md:block text-gray-4 hover:text-black cursor-pointer transition"
      @click="cart.removeFromCart(item.product.id)"
    >
      <X class="w-5 h-5" :stroke-width="1.5" />
    </button>

  </div>
</template>

<script lang="ts" setup>
import type { CartItem } from '@/models/cart/cart-item.ts'
import CartQuantity from './CartQuantity.vue'
import { useCartStore } from '@/stores/cart-store.ts'
import { getItemTotal } from '@/utils/price'
import { X } from 'lucide-vue-next'

const cart = useCartStore()
const baseUrl = import.meta.env.VITE_API_BASE_URL

defineProps<{
  item: CartItem
}>()
</script>
