<template>
  <div class="w-full px-4 flex flex-col justify-start relative">
    <div>
      <h1 class="text-3xl font-semibold mb-10 text-center">Vos commandes</h1>

      <div v-if="loading" class="text-center py-10 text-gray-500">Chargement des commandes...</div>

      <div
        v-else-if="!hasOrder"
        class="flex flex-1 items-center justify-center text-2xl font-semibold text-center"
      >
        Vous n'avez pas encore de commande en cours
      </div>

      <div v-else>
        <div v-for="order in paginatedOrders" :key="order.id" class="mb-4">
          <OrderCard :order="order" :key="order.id" />
        </div>

        <div class="w-fit m-auto">
          <OrderPagination
            :currentPage="currentPage"
            :totalPages="totalPages"
            @prev="prevPage"
            @next="nextPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getOrders } from '@/services/order-history-service.ts'
import type { OrderHistory } from '@/models/order/order-history.ts'
import OrderCard from '@/components/order/OrderCard.vue'
import OrderPagination from '@/components/order/OrderPagination.vue'

const loading = ref(true)
const orders = ref<OrderHistory[]>([])
const currentPage = ref(1)
const perPage = 5

const hasOrder = computed(() => orders.value.length > 0)

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return orders.value.slice(start, start + perPage)
})

const totalPages = computed(() => Math.ceil(orders.value.length / perPage))

onMounted(async () => {
  loading.value = true
  const response = await getOrders()
  orders.value = response.data
  loading.value = false
})

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
</script>
