<template>
  <div class="border rounded-lg shadow p-4 mb-6">
    <div class="flex flex-col sm:flex-row sm:justify-between mb-4">
      <div>
        <p class="text-sm text-gray-500">Commande n°{{ order.id }}</p>
        <p class="text-lg font-semibold">
          Reçu le {{ formatDate(order.createdAt) }}
        </p>
      </div>
      <div class="text-right">
        <span
          class="text-sm inline-block px-2 py-1 rounded font-medium"
          :class="order.done ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
        >
          {{ order.done ? 'Traitée' : 'En attente' }}
        </span>
        <p class="text-sm text-gray-500 mt-1">Retrait : {{ pickupLabel(order.pickup) }}</p>
      </div>
    </div>

    <table class="w-full text-sm text-left text-gray-700 border-t">
      <thead class="bg-gray-100 text-xs uppercase text-gray-600">
      <tr>
        <th scope="col" class="px-3 py-2">Produit</th>
        <th scope="col" class="px-3 py-2 text-right">Qté</th>
        <th scope="col" class="px-3 py-2 text-right">Prix unitaire</th>
        <th scope="col" class="px-3 py-2 text-right">Total</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, i) in order.items" :key="i" class="border-b">
        <td class="px-3 py-2">{{ item.productName }}</td>
        <td class="px-3 py-2 text-right">{{ item.quantity }}</td>
        <td class="px-3 py-2 text-right">{{ item.unitPrice.toFixed(2) }} €</td>
        <td class="px-3 py-2 text-right">
          {{ (item.unitPrice * item.quantity).toFixed(2) }} €
        </td>
      </tr>
      </tbody>
      <tfoot>
      <tr class="font-semibold text-gray-900 border-t">
        <td colspan="3" class="px-3 py-2 text-right">Total :</td>
        <td class="px-3 py-2 text-right">{{ order.total.toFixed(2) }} €</td>
      </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { OrderHistory } from '@/models/order/order-history.ts'

const props = defineProps<{
  order: OrderHistory
}>()

function formatDate(dateStr: any): string {
  const date = new Date(dateStr.date ?? dateStr)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function pickupLabel(pickup: 'TUESDAY' | 'THURSDAY'): string {
  return pickup === 'TUESDAY' ? 'Mardi' : 'Jeudi'
}
</script>
