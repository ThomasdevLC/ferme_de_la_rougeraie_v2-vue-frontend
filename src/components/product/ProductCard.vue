<template>
  <div
    class="flex flex-col npm run devw-[260px] h-[440px] bg-white border border-gray-2 relative"
    :title="
      product.discount && product.discountText
        ? `${product.name} - ${product.discountText}`
        : product.name
    "
  >
    <div class="absolute bottom-[165px] ml-[-5px]">
      <p v-if="product.limited" class="bg-primary text-white text-sm font-medium px-2 py-1 mb-4">
        Quantité limitée
      </p>
    </div>

    <div class="h-[280px] overflow-hidden">
      <img
        :src="`${baseUrl}${product.image}`"
        :alt="`Image de ${product.name}`"
        loading="lazy"
        class="w-full h-full object-cover"
      />
      <img
        v-if="product.discount"
        src="/assets/promo.png"
        alt="Promotion"
        class="absolute top-[-9px] right-[-14px] w-19 h-19"
      />
    </div>

    <div class="px-2 py-3 flex-1 flex flex-col justify-between text-text-color">
      <p class="text-[1.8rem] font-titles truncate">
        {{ product.name }}
      </p>
      <p class="text-md text-[0.9rem] text-gray-4 mt-1">
        <span class="font-roboto">{{ product.price.toFixed(2) }} €</span> /
        <span class="tracking-tighter">{{ product.unit }}</span>
      </p>

      <ProductQuantity v-model="quantity" :product="product" />

      <p class="font-medium text-[0.9rem] cursor-pointer hover:text-primary" @click="onAddToCart">
        {{ added ? 'AJOUTÉ' : 'AJOUTER AU PANIER' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/models/product/product.ts'
import ProductQuantity from '@/components/product/ProductQuantity.vue'
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart-store.ts'

const { product } = defineProps<{ product: Product }>()
const cart = useCartStore()

const baseUrl = import.meta.env.VITE_API_BASE_URL

const quantity = ref(0)
const added = ref(false)

function onAddToCart() {
  if (quantity.value <= 0) return
  cart.addToCart(product, quantity.value)
  added.value = true
  setTimeout(() => {
    added.value = false
  }, 1500)
}
</script>
