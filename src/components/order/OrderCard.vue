<template>
  <div class="border border-b-gray-3 min-w-72 max-w-120 mx-auto  rounded-sm shadow p-4 mb-6 bg-white/80 ">
    <div class="flex flex-row justify-between mb-4">
      <div>
        <p class="text-sm text-gray-500">Commande n°{{ order.id }}</p>
        <p class="text-lg font-semibold">
          {{ formatDate(order.createdAt) }}
        </p>
      </div>
      <div class="text-right">
        <span
          class="text-sm inline-block px-2 py-1 rounded font-medium"
          :class="order.done ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
        >
          {{ order.done ? 'Traitée' : 'En attente' }}
        </span>
        <p class="text-sm text-gray-500 mt-1">Retrait : {{ formatDate(order.pickupDate, true, false) }}</p>
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
        <td class="px-3 py-2">{{ item.product.name }}</td>
        <td class="px-3 py-2 text-right">{{ item.quantity }}</td>
        <td class="px-3 py-2 text-right">{{ item.unitPrice.toFixed(2) }} €</td>
        <td class="px-3 py-2 text-right">
          {{ (item.lineTotal.toFixed(2)) }} €
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
    <button v-if ="order.isEditable"
      class="mt-4 w-full bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
      @click="fetchOrder"
    >
      Modifier la commande
    </button>

  </div>

</template>

<script setup lang="ts">
import type { OrderHistory } from '@/models/order/order-history.ts'
import { getOneOrder } from '@/services/order-single-service.ts'
import { formatDate } from '@/utils/date-format.ts'
import { useUIStore } from '@/stores/ui-store.ts'
import { useCartStore } from '@/stores/cart-store.ts'
const { order } = defineProps<{
  order: OrderHistory
}>()

const ui = useUIStore()
const cart = useCartStore()



const fetchOrder = async () => {
  try {
    const res       = await getOneOrder(order.id)
    const orderData = res.data

    cart.clearCart()
    cart.startEditing(
      orderData.id,
      orderData.pickupDate.slice(0, 10)
    )

    orderData.items.forEach(item => {
      cart.addToCart(item.product, item.quantity)
    })
    ui.openCart()
  } catch (error) {
    console.error('Erreur fetchOrder :', error)
  }
}


</script>
