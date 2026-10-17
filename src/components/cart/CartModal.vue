<template>
  <Modal v-model="ui.cartOpen" :closable="true" :closeOnBackdrop="true">
    <template #header>
      <div class="flex gap-3 items-center" v-if="!displayMessage">
        <ShoppingBag class="w-8 h-8" />
        <h1 class="text-xl font-bold">Panier</h1>
        <span v-if="!cart.isEmpty" class="text-sm text-gray-500">{{ cart.numberOfProducts }} article(s)</span>
      </div>
      <div
        class="pt-4 flex flex-row justify-center items-baseline space-x-2 text-xs md:text-base"
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
        <!-- Édition d'une commande dont on a retiré tous les articles : on propose de l'annuler -->
        <div v-if="cart.isEmpty && cart.isEditing" class="flex flex-col space-y-4">
          <p class="text-gray-500 text-center">
            Votre commande ne contient plus d'article. Vous pouvez l'annuler ou abandonner la modification.
          </p>

          <router-link
            to="/products"
            class="text-base text-primary font-medium flex items-center gap-1 justify-center mt-4 mb-6 hover:text-primary-hover"
            @click="ui.closeCart()"
          >
            Ajouter des produits
            <shopping-bag class="ml-2 w-5 h-5" />
          </router-link>

          <div class="flex justify-center space-x-4 pt-4">
            <button
              class="text-primary text-xs md:text-sm border-2 border-primary px-4 py-2 hover:bg-opacity-90 cursor-pointer w-fit"
              @click="abortUpdate"
            >
              Abandonner la modification
            </button>

            <button
              class="bg-red-500 text-xs md:text-sm text-white font-roboto-mono px-4 py-2 hover:bg-red-600 cursor-pointer w-fit disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isCancelling"
              @click="showCancelConfirm = true"
            >
              {{ isCancelling ? 'Annulation…' : 'Annuler ma commande' }}
            </button>
          </div>

          <p v-if="errorMessage" class="text-red-500 text-center font-semibold">
            {{ errorMessage }}
          </p>
        </div>

        <div v-else-if="cart.isEmpty" class="text-gray-500 text-center">Votre panier est vide.</div>

        <div v-else class="flex flex-col space-y-4">
          <CartItem v-for="item in cart.items" :key="item.product.id" :item="item" />

          <p class="flex justify-end text-base font-semibold">
            Total : <span class="font-roboto">{{ cart.cartTotal }}</span>
          </p>

          <router-link
            to="/products"
            class="text-base text-primary font-medium flex items-center gap-1 justify-center mt-4 mb-6 hover:text-primary-hover"
            @click="ui.closeCart()"
          >
            Ajouter des produits
            <shopping-bag class="ml-2 w-5 h-5" />
          </router-link>

          <div v-if="user.isLoggedIn" class="flex flex-col space-y-4 mt-4">
            <div class="flex items-center gap-3">
              <label class="text-sm font-semibold font-roboto-mono whitespace-nowrap shrink-0"
                >Jour de retrait&nbsp;:</label
              >
              <CartCalendar v-model="pickupDate" />
            </div>
            <div class="flex justify-center space-x-4 pt-4">
              <button
                class="text-primary text-xs md:text-sm border-2 border-primary px-4 py-2 hover:bg-opacity-90 cursor-pointer w-fit"
                v-if="cart.isEditing"
                @click="abortUpdate"
              >
                Abandonner la modification
              </button>

              <button
                class="bg-primary text-xs md:text-sm text-white font-roboto-mono px-4 py-2 hover:bg-opacity-90 cursor-pointer w-fit"
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
            <p class="text-xs text-gray-500 mb-4">Veuillez vous connecter pour passer une commande.</p>
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

      <Modal v-model="showCancelConfirm" :closable="false" :closeOnBackdrop="false">
        <template #header>
          <h2 class="text-xl font-bold">Confirmation</h2>
        </template>

        <p class="text-xs md:text-base">
          Êtes-vous sûr de vouloir annuler votre commande n° {{ cart.currentOrderId }} ? Cette action est définitive.
        </p>

        <template #footer>
          <div class="text-xs md:text-sm flex justify-end gap-4">
            <button
              @click="showCancelConfirm = false"
              class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
            >
              Non, la garder
            </button>
            <button
              @click="confirmCancel"
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
            >
              Oui, annuler
            </button>
          </div>
        </template>
      </Modal>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRef } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
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
import { cancelOrder } from '@/services/order/order-cancel-service.ts'
import type { OrderItem } from '@/models/order/order-item.ts'
import type { OrderNotice } from '@/models/order/order-notice.ts'

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
const originalItems = ref<OrderItem[]>([])
const showCancelConfirm = ref(false)
const isCancelling = ref(false)

watch(
  () => cart.isEditing,
  (isEditing) => {
    if (isEditing) {
      originalPickup.value = cart.editPickupDate
      originalItems.value = cart.orderItems
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

async function confirmCancel() {
  showCancelConfirm.value = false
  if (cart.currentOrderId === null || isCancelling.value) return

  isCancelling.value = true
  errorMessage.value = null
  try {
    await cancelOrder(cart.currentOrderId)
    await leaveEditToOrders({ type: 'success', text: 'Votre commande a bien été annulée.' })
  } catch (err) {
    const status = axios.isAxiosError(err) ? err.response?.status : undefined
    // 403 : déjà annulée ou introuvable, 409 : heure limite dépassée → l'édition n'a plus de sens
    if (status === 403 || status === 409) {
      await leaveEditToOrders({ type: 'error', text: handleAxiosError(err) })
    } else {
      errorMessage.value = handleAxiosError(err)
    }
  } finally {
    isCancelling.value = false
  }
}

async function leaveEditToOrders(notice: OrderNotice) {
  cart.stopEditing()
  cart.clearCart()
  ui.closeCart()
  orderStore.setNotice(notice)

  // Déjà sur /orders : push ne remonte pas la vue, on recharge nous-mêmes
  if (router.currentRoute.value.name === 'order-history') {
    await orderStore.loadOrders()
  } else {
    await router.push('/orders')
  }
}

async function onSubmit() {
  if (!pickupDate.value) return
  const isoDate = format(pickupDate.value, 'yyyy-MM-dd')

  if (cart.isEditing) {
    const sameDate = isoDate === originalPickup.value
    const sameItems = JSON.stringify(cart.orderItems) === JSON.stringify(originalItems.value)
    if (sameDate && sameItems) {
      return
    }
  }

  try {
    if (cart.isEditing) {
      const payload = {
        pickupDate: isoDate,
        items: cart.orderItems,
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
