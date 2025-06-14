<template>
  <Modal v-model="ui.cartOpen" :closable="true" :closeOnBackdrop="true" >

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
        :pickup="pickup"
        @follow-orders="goToOrders"
      />

      <div v-else class="p-4 space-y-4">
        <div v-if="cart.isEmpty" class="text-gray-500 text-center">Votre panier est vide.</div>

        <div v-else class="flex flex-col space-y-4">
          <CartItem v-for="item in cart.items" :key="item.product.id" :item="item" />

          <p class="flex justify-end text-xl font-semibold">Total : {{ cart.cartTotal }}</p>

          <div v-if="user.isLoggedIn" class="flex flex-col space-y-4 ">
            <label class="font-semibold">Jour de retrait :</label>
            <select v-model="pickup" class="border px-2 py-1 w-full mb-4">
              <option value="TUESDAY">Mardi</option>
              <option value="THURSDAY">Jeudi</option>
            </select>

            <button
              class="bg-primary text-white px-4 py-2 hover:bg-opacity-90 cursor-pointer w-fit mx-auto"
              @click="placeOrder"
            >
              Valider commande
            </button>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui-store.ts'
import { useCartStore } from '@/stores/cart-store.ts'
import { useUserStore } from '@/stores/user-store.ts'
import { handleAxiosError } from '@/utils/handle-axios-error.ts'
import { ShoppingBag, ArrowRightFromLine } from 'lucide-vue-next'

import Modal from '@/components/ui/ModalComponent.vue'
import CartItem from '@/components/cart/CartItem.vue'
import OrderConfirmation from '@/components/cart/OrderConfirmation.vue'

const ui = useUIStore()
const cart = useCartStore()
const user = useUserStore()
const router = useRouter()

const displayMessage = ref(false)
const errorMessage = ref<string | null>(null)
const pickup = ref<'TUESDAY' | 'THURSDAY'>('TUESDAY')

function goToOrders() {
  router.push('/orders')
  ui.closeCart()
}

async function placeOrder() {
  try {
    await cart.submitOrder(pickup.value)
    displayMessage.value = true
    await new Promise((res) => setTimeout(res, 5000))
    ui.closeCart()
    displayMessage.value = false
    errorMessage.value = null
  } catch (err: unknown) {
    errorMessage.value = handleAxiosError(err)
  }
}
</script>
