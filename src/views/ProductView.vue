<template>
  <div class="relative z-10 max-w-[75rem] mx-auto min-h-screen ">
    <div v-if="loading" class="text-center mx-auto py-8 text-gray-800 font-base text-xl">
      <img :src="loaderSrc" alt="loader" class="mx-auto" />
      <p class="text-3xl font-black font-titles text-gray-4" >Chargement ...</p>
    </div>

    <Transition
      name="slide-up"
      enter-active-class="transition duration-400"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div v-if="!loading"
           class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-24">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchProducts } from '@/services/product-service.ts'
import type { Product } from '@/models/product/product.ts'
import ProductCard from '@/components/product/ProductCard.vue'
import loaderImg from '/assets/tomatoe.png'

const products = ref<Product[]>([])
const loading = ref(true)
const loaderSrc = loaderImg

onMounted(async () => {
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




