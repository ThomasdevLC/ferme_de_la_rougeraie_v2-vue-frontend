<template>
  <div v-if="loading">Chargement des produits...</div>

  <div v-else class="grid">
    <div v-for="product in products" :key="product.id" class="card">
      <img :src="`http://localhost:8000${product.image}`" alt="Image de {{ product.name }}" class="card-img" />
      <h3 class="card-title">{{ product.name }}</h3>
      <p class="card-price">{{ product.price }} € / {{ product.unit }}</p>
      <p v-if="product.discount" class="card-discount">🔥 Promo disponible</p>
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

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.card {
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  padding: 1rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  text-align: center;
}

.card-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0.5rem 0 0.2rem;
}

.card-price {
  color: #555;
}

.card-discount {
  color: red;
  font-weight: bold;
}
</style>
