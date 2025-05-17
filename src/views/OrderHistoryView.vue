<template>
  <div v-for="order in paginatedOrders" :key="order.id">
    <OrderCard :order="order" />
  </div>

  <OrderPagination
    :currentPage="currentPage"
    :totalPages="totalPages"
    @prev="prevPage"
    @next="nextPage"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getOrders } from '@/services/order-history-service.ts'
import type { OrderHistory } from '@/models/order/order-history.ts'
import OrderCard from '@/components/order/OrderCard.vue'
import OrderPagination from '@/components/order/OrderPagination.vue'

const orders = ref<OrderHistory[]>([])
const currentPage = ref(1)
const perPage = 5

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return orders.value.slice(start, start + perPage)
})

const totalPages = computed(() =>
  Math.ceil(orders.value.length / perPage)
)

onMounted(async () => {
  const response = await getOrders()
  orders.value = response.data
})

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
</script>
