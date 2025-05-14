<template>
  <div v-if="loading" class="text-center py-8 text-gray-3 font-base">
    Chargement des produits...
  </div>

  <div
    v-else
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4"
  >
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchProducts } from '@/services/productService';
import type { Product } from '@/models/Product';
import ProductCard from '@/components/product/ProductCard.vue';

const products = ref<Product[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await fetchProducts();
    products.value = response.data as Product[];
  } catch (error) {
    console.error('Erreur chargement produits :', error);
  } finally {
    loading.value = false;
  }
});
</script>
