<template>
  <div
    v-if="loading"
    class="text-center py-8 text-gray-3 font-base"
  >
    Chargement des produits...
  </div>

  <div
    v-else
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4"
  >
    <div
      v-for="product in products"
      :key="product.id"
      class="bg-gray-1 border border-gray-2 font-base rounded-2xl p-4 text-center shadow-sm"
    >
      <img
        :src="`http://localhost:8000${product.image}`"
        :alt="`Image de ${product.name}`"
        class="w-full h-40 object-cover rounded-lg mb-4"
      />
      <h3 class="text-lg font-semibold text-primary font-titles">
        {{ product.name }}
      </h3>
      <p class="text-gray-4 font-base mb-1">
        {{ product.price }} € / {{ product.unit }}
      </p>
      <p
        v-if="product.discount"
        class="text-secondary font-bold text-sm mt-1"
      >
        🔥 Promo disponible
      </p>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchProducts } from '@/services/productService';
import type { Product } from '@/models/Product';

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
