<template>
  <OrderCard
    v-for="order in orders"
    :key="order.id"
    :order="order"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getOrders } from '@/services/order-history-service.ts';
import type { OrderHistory } from '@/models/order/order-history.ts'
import OrderCard from '@/components/order/OrderCard.vue'

const orders = ref<OrderHistory[]>([]);

onMounted(async () => {
  try {
    const response = await getOrders();
    orders.value = response.data as OrderHistory[];
  } catch (error) {
    console.error('Erreur chargement produits :', error);
  }
});
</script>

<style scoped>

</style>
