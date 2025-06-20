<template>
  <Modal v-model="ui.cartOpen" :closable="true" :closeOnBackdrop="true">

    <template #header>
      <div class="flex gap-3 items-center">
        <ShoppingBag class="w-8 h-8" />
        <h1 class="text-2xl font-bold">Panier</h1>
        <p v-if="!cart.isEmpty" class="text-gray-500">{{ cart.numberOfProducts }} article(s)</p>
      </div>
    </template>

    <template #default>
      <OrderConfirmation
        v-if="displayMessage"
        :userFirstName="user.firstName"
        :pickup="displayPickupLabel"
        @follow-orders="goToOrders"
      />

      <div v-else class="p-4 space-y-4">
        <div v-if="cart.isEmpty" class="text-gray-500 text-center">Votre panier est vide.</div>

        <div v-else class="flex flex-col space-y-4">
          <CartItem v-for="item in cart.items" :key="item.product.id" :item="item" />

          <p class="flex justify-end text-xl font-semibold">Total : {{ cart.cartTotal }}</p>

          <div v-if="user.isLoggedIn" class="flex flex-col space-y-4">
            <label class="font-semibold">Jour de retrait&nbsp;:</label>
            <CartCalendar v-model="pickupDate" />
            <button
              class="bg-primary text-white px-4 py-2 hover:bg-opacity-90 cursor-pointer w-fit mx-auto"
              @click="onSubmit"
            >
              {{ cart.isEditing ? 'Mettre à jour la commande' : 'Valider commande' }}            </button>
          </div>

          <p v-if="errorMessage" class="text-red-500 text-center font-semibold">
            {{ errorMessage }}
          </p>

          <div v-else-if="!user.isLoggedIn" class="mt-6 text-center">
            <p class="text-gray-500 mb-4">Veuillez vous connecter pour passer une commande.</p>
            <router-link
              to="/login"
              class="text-primary font-medium flex items-center gap-1 justify-center"
              @click="ui.closeCart()"
            >
              Se connecter
              <ArrowRightFromLine class="w-4 h-4" />
            </router-link>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { format, parseISO } from 'date-fns'
import { ShoppingBag, ArrowRightFromLine } from 'lucide-vue-next'
import Modal from '@/components/ui/ModalComponent.vue'
import CartItem from '@/components/cart/CartItem.vue'
import OrderConfirmation from '@/components/cart/OrderConfirmation.vue'
import CartCalendar from '@/components/cart/CartCalendar.vue'

import { useUIStore } from '@/stores/ui-store'
import { useCartStore } from '@/stores/cart-store'
import { useUserStore } from '@/stores/user-store'
import { handleAxiosError } from '@/utils/handle-axios-error'
import { updateOrder } from '@/services/order-edit-service'

const ui    = useUIStore()
const cart  = useCartStore()
const user  = useUserStore()
const router = useRouter()

// Local UI state
const displayMessage = ref(false)
const errorMessage   = ref<string|null>(null)
const pickupDate = ref<Date|null>(null)

watch(
  () => cart.editPickupDate,
  iso => {
    pickupDate.value = iso ? parseISO(iso) : null
  },
  { immediate: true }
)

watch(pickupDate, date => {
  cart.editPickupDate = date ? format(date, 'yyyy-MM-dd') : ''
})

const displayPickupLabel = computed(() => {
  if (!pickupDate.value) return ''
  return pickupDate.value.toLocaleDateString('fr-FR', { weekday: 'long' })
})

function goToOrders() {
  router.push('/orders')
  ui.closeCart()
}


async function onSubmit() {
  if (!pickupDate.value) return
  const isoDate = format(pickupDate.value, 'yyyy-MM-dd')

  try {
    if (cart.isEditing) {
      await updateOrder(
        cart.currentOrderId!,
        cart.items.map(i => ({
          productId: i.product.id,
          quantity:  i.quantity
        })),
        isoDate
      )
      cart.stopEditing()

    } else {
      await cart.submitOrder(isoDate)
    }

    displayMessage.value = true
    setTimeout(() => {
      displayMessage.value = false
      pickupDate.value = null
      cart.stopEditing()
      cart.clearCart()
      ui.closeCart()
    }, 5000)

  } catch (err) {
    errorMessage.value = handleAxiosError(err)
  }
}
</script>
