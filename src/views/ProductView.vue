<template>
  <div class="relative z-10 max-w-[75rem] mx-auto ">
    <div v-if="loading && !closedShopMessage" class="text-center mx-auto py-8 text-gray-800 font-base text-xl">
      <img :src="loaderSrc" alt="loader" class="mx-auto" />
      <p class="text-3xl font-black font-titles text-gray-4">Chargement ...</p>
    </div>

    <p v-else-if="closedShopMessage" class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-4 text-center mt-40 px-4">{{ closedShopMessage.content }}</p>

    <Transition
      name="slide-up"
      enter-active-class="transition duration-400"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div
        v-if="!loading && !closedShopMessage?.content"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 place-items-center gap-6 py-20 md:px-24 lg:px-0"
      >
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { fetchProducts } from '@/services/product-service.ts'
import { useMessageStore } from '@/stores/message-store.ts'
import type { Product } from '@/models/product/product.ts'
import ProductCard from '@/components/product/ProductCard.vue'
import loaderImg from '/assets/tomatoe.png'

const products = ref<Product[]>([])
const messageStore = useMessageStore()
const loading = ref(true)
const loaderSrc = loaderImg

const closedShopMessage = computed(() => messageStore.closedShopMessage)

onMounted(async () => {
  window.scrollTo({ top: 0 })
  try {
    const response = await fetchProducts()
    products.value = response.data as Product[]
  } catch (error) {
    console.error('Erreur chargement produits :', error)
  } finally {
    loading.value = false
  }
})
</script>
