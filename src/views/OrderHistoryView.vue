<template>
  <div class="w-full px-4 flex flex-col justify-start relative pt-60">
    <div>
      <div class="flex items-center gap-4 mb-10 max-w-120 mx-auto">
        <h1 class="text-2xl font-semibold whitespace-nowrap">Vos commandes</h1>
        <div class="flex-1 h-px bg-black"></div>
      </div>

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
import { useOrderStore } from '@/stores/order-store'
import OrderCard from '@/components/order/OrderCard.vue'
import OrderPagination from '@/components/order/OrderPagination.vue'

const currentPage = ref(1)
const perPage = 5

const orderStore = useOrderStore()

const orders = computed(() => orderStore.orders)
const loading = computed(() => orderStore.loading)

const hasOrder = computed(() => orders.value.length > 0)

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return orders.value.slice(start, start + perPage)
})

const totalPages = computed(() => Math.ceil(orders.value.length / perPage))

onMounted(async () => {
  await orderStore.loadOrders()
})

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
</script>

