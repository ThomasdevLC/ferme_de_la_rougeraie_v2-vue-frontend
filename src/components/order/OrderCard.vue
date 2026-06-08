<template>
  <div class="border border-b-gray-3 min-w-72 max-w-120 mx-auto  rounded-sm shadow p-4 mb-6 bg-white/80 ">
    <div class="flex flex-row justify-between mb-4">
      <div>
        <p class="text-xs md:text-sm text-gray-500">Commande n°{{ order.id }}</p>
        <p class="text-sm md:text-md font-semibold">
          {{ formatDate(order.createdAt) }}
        </p>
      </div>
      <div class="text-right">
        <span
          class="text-xs inline-block px-2 py-1 rounded font-medium"
          :class="order.done ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
        >
          {{ order.done ? 'Traitée' : 'En attente' }}
        </span>
        <p class="text-xs md:text-sm text-gray-500 mt-1">Retrait : {{ formatDate(order.pickupDate, true, false) }}</p>
      </div>
    </div>

    <table class="w-full text-xs md:text-sm text-left text-gray-700 border-t">
      <thead class="bg-gray-100 uppercase text-gray-600 text-[0.65rem] md:text-xs">
      <tr>
        <th scope="col" class="px-2 py-1.5 md:px-3 md:py-2">Produit</th>
        <th scope="col" class="px-2 py-1.5 md:px-3 md:py-2 text-right">Qté</th>
        <th scope="col" class="px-2 py-1.5 md:px-3 md:py-2 text-right">Prix unitaire</th>
        <th scope="col" class="px-2 py-1.5 md:px-3 md:py-2 text-right">Total</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, i) in order.items" :key="i" class="border-b">
        <td class="px-2 py-1.5 md:px-3 md:py-2">{{ item.product.name }}</td>
        <td class="px-2 py-1.5 md:px-3 md:py-2 text-right">{{ item.quantity }}</td>
        <td class="px-2 py-1.5 md:px-3 md:py-2 text-right">{{ item.unitPrice.toFixed(2) }} €</td>
        <td class="px-2 py-1.5 md:px-3 md:py-2 text-right">
          {{ (item.lineTotal.toFixed(2)) }} €
        </td>
      </tr>
      </tbody>
      <tfoot>
      <tr class="font-semibold text-gray-900 border-t">
        <td colspan="3" class="px-2 py-1.5 md:px-3 md:py-2 text-right">Total :</td>
        <td class="px-2 py-1.5 md:px-3 md:py-2 text-right whitespace-nowrap">{{ order.total.toFixed(2) }} €</td>
      </tr>
      </tfoot>
    </table>

    <div class="flex justify-center">
      <button v-if="order.isEditable"
        class="w-fit mt-4 bg-primary text-xs md:text-sm text-white px-4 py-2 rounded hover:bg-opacity-90 transition cursor-pointer"
        @click="onEditClick"
      >
        Modifier la commande
      </button>
    </div>

    <ModalComponent v-model="showConfirm" :closable="true" :close-on-backdrop="true">
      <template #header>
        <h2 class="text-base font-bold">Commande en cours</h2>
      </template>
      <p class="text-sm">Votre panier contient des articles. Voulez-vous le vider pour modifier cette commande ?</p>
      <template #footer>
        <div class="flex justify-end gap-3 text-sm">
          <button
            @click="showConfirm = false"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
          >
            Annuler
          </button>
          <button
            @click="confirmEdit"
            class="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 cursor-pointer"
          >
            Continuer
          </button>
        </div>
      </template>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { OrderHistory } from '@/models/order/order-history.ts'
import { getOneOrder } from '@/services/order/order-single-service.ts'
import { formatDate } from '@/utils/date-format.ts'
import { useUIStore } from '@/stores/ui-store.ts'
import { useCartStore } from '@/stores/cart-store.ts'
import ModalComponent from '@/components/ui/ModalComponent.vue'

const { order } = defineProps<{ order: OrderHistory }>()

const ui = useUIStore()
const cart = useCartStore()

const showConfirm = ref(false)

function onEditClick() {
  if (!cart.isEmpty && !cart.isEditing) {
    showConfirm.value = true
  } else {
    fetchOrder()
  }
}

async function confirmEdit() {
  showConfirm.value = false
  await fetchOrder()
}

const fetchOrder = async () => {
  try {
    const res       = await getOneOrder(order.id)
    const orderData = res.data

    cart.clearCart()
    cart.startEditing(
      orderData.id,
      orderData.pickupDate.slice(0, 10)
    )

    orderData.items.forEach((item) => {
      cart.addToCart(item.product, item.quantity, item.availableStock ?? null)
    })
    ui.openCart()
  } catch (error) {
    console.error('Erreur fetchOrder :', error)
  }
}
</script>
