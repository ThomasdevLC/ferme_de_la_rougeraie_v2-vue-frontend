<template>
  <Modal v-model="ui.cartOpen" :closable="true" :closeOnBackdrop="true">
    <template #header>
      <div class="flex gap-3 items-center" v-if="!displayMessage">
        <ShoppingBag class="w-8 h-8" />
        <h1 class="text-2xl font-bold">Panier</h1>
        <p v-if="!cart.isEmpty" class="text-gray-500">{{ cart.numberOfProducts }} article(s)</p>
      </div>
      <div
        class="pt-4 flex flex-row justify-center items-baseline space-x-2 text-base"
        v-if="cart.isEditing && !displayMessage"
      >
        <CircleAlert class="w-5 h-5 text-primary" />
        <p>Modification de votre commande n° {{ cart.currentOrderId }} en cours</p>
      </div>
    </template>

    <template #default>
      <OrderConfirmation
        v-if="displayMessage"
        :userFirstName="user.firstName"
        :pickup="lastPickupLabel"
        @follow-orders="goToOrders"
      />

      <div v-else class="p-4 space-y-4">
        <div v-if="cart.isEmpty" class="text-gray-500 text-center">Votre panier est vide.</div>

        <div v-else class="flex flex-col space-y-4">
          <CartItem v-for="item in cart.items" :key="item.product.id" :item="item" />

          <p class="flex justify-end text-xl font-semibold">Total : {{ cart.cartTotal }}</p>

          <router-link
            to="/products"
            class="text-lg text-primary font-medium flex items-center gap-1 justify-center mb-6 hover:text-primary-hover"
            @click="ui.closeCart()"
          >
            Ajouter des produits
            <shopping-bag class="ml-2 w-6 h-6" />
          </router-link>

          <div v-if="user.isLoggedIn" class="flex flex-col space-y-4">
            <div class="flex items-baseline space-x-4">
            <label class="font-semibold align-baseline">Jour de retrait&nbsp;:</label>
            <CartCalendar v-model="pickupDate" />
            </div>
            <div class="flex justify-center space-x-4 pt-4">
              <button
                class="text-primary border-2 border-primary px-4 py-2 hover:bg-opacity-90 cursor-pointer w-fit "
                v-if="cart.isEditing"
                @click="abortUpdate"
              >
                Abandonner la modification
              </button>

              <button
                class="bg-primary text-white px-4 py-2 hover:bg-opacity-90 cursor-pointer w-fit "
                @click="onSubmit"
              >
                {{ cart.isEditing ? 'Mettre à jour la commande' : 'Valider commande' }}
              </button>
            </div>
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
import { ref, computed, watch, toRef } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { ShoppingBag, ArrowRightFromLine, CircleAlert } from 'lucide-vue-next'
import Modal from '@/components/ui/ModalComponent.vue'
import CartItem from '@/components/cart/CartItem.vue'
import OrderConfirmation from '@/components/cart/OrderConfirmation.vue'
import CartCalendar from '@/components/cart/CartCalendar.vue'

import { useSyncedDate } from '@/composables/useSyncedDate'
import { useUIStore } from '@/stores/ui-store'
import { useCartStore } from '@/stores/cart-store'
import { useUserStore } from '@/stores/user-store'
import { useOrderStore } from '@/stores/order-store'
import { handleAxiosError } from '@/utils/handle-axios-error'
import { updateOrder } from '@/services/order/order-edit-service.ts'

const ui = useUIStore()
const cart = useCartStore()
const user = useUserStore()
const orderStore = useOrderStore()
const router = useRouter()

const displayMessage = ref(false)
const errorMessage = ref<string | null>(null)
const lastPickupLabel = ref<string>('')
const isoPickupRef = toRef(cart, 'editPickupDate')
const pickupDate = useSyncedDate(isoPickupRef)
const originalPickup = ref<string>('')
const originalItems = ref<{ productId: number; quantity: number }[]>([])

watch(
  () => cart.isEditing,
  (isEditing) => {
    if (isEditing) {
      originalPickup.value = cart.editPickupDate
      originalItems.value = cart.items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      }))
    }
  },
)

function abortUpdate() {
  cart.stopEditing()
  cart.clearCart()
  ui.closeCart()
}

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

  if (cart.isEditing) {
    const currentItems = cart.items.map((i) => ({
      productId: i.product.id,
      quantity: i.quantity,
    }))
    const sameDate = isoDate === originalPickup.value
    const sameItems = JSON.stringify(currentItems) === JSON.stringify(originalItems.value)
    if (sameDate && sameItems) {
      return
    }
  }

  try {
    if (cart.isEditing) {
      const payload = {
        pickupDate: isoDate,
        items: cart.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      }
      await updateOrder(cart.currentOrderId!, payload)
      lastPickupLabel.value = displayPickupLabel.value
      displayMessage.value = true
      await orderStore.loadOrders()
    } else {
      await cart.submitOrder(isoDate)
      lastPickupLabel.value = displayPickupLabel.value
      displayMessage.value = true
    }

    setTimeout(() => {
      cart.stopEditing()
      displayMessage.value = false
      pickupDate.value = null
      cart.clearCart()
      ui.closeCart()
    }, 5000)
  } catch (err) {
    errorMessage.value = handleAxiosError(err)
  }
}
</script>
