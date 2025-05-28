<template>
  <transition name="modal">
    <div v-if="ui.cartOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-xs" @click="ui.closeCart"></div>

      <div
        class="relative bg-white min-w-3xl max-w-[65vw] pt-8 pl-6  shadow-lg z-10 max-h-[75vh] overflow-y-auto"
      >
        <button
          @click="ui.closeCart"
          class="absolute top-8 right-8 text-xl text-gray-4 hover:text-black cursor-pointer transition"
        >
          <X class="w-8 h-8" :stroke-width="1.5" />
        </button>

        <!-- Contenu principal -->
        <div
          v-if="displayMessage"
          class="text-center font-semibold text-xl flex flex-col justify-center min-h-48"
        >
          Merci pour votre commande {{ user.name }} ! à
          {{ pickup === 'TUESDAY' ? 'mardi' : 'jeudi' }}.
        </div>

        <div v-else class="p-4">
          <div class="flex gap-3 items-center mb-4">
            <ShoppingBag class="w-8 h-8" />
            <h1 class="text-2xl font-bold">Panier</h1>
            <p v-if="!cart.isEmpty" class="text-gray-500">{{ cart.numberOfProducts }} article(s)</p>
          </div>

          <div v-if="cart.isEmpty" class="text-gray-500 text-center">Votre panier est vide.</div>

          <div class="px-8 flex flex-col space-y-4">
            <CartItem v-for="item in cart.items" :key="item.product.id" :item="item" />

            <p v-if="!cart.isEmpty" class="flex justify-end text-xl ">
              <span class="font-semibold">Total : </span>&nbsp;{{ cart.cartTotal }}
            </p>

            <div v-if="user.isLoggedIn && !cart.isEmpty" class=" flex flex-col justify-center">
              <label class="block mb-3 font-semibold">Jour de retrait :</label>
              <select v-model="pickup" class="border px-2 py-1 w-full mb-4">
                <option value="TUESDAY">Mardi</option>
                <option value="THURSDAY">Jeudi</option>
              </select>
            </div>

            <button
              class="bg-primary text-white px-4 py-2 hover:bg-opacity-90 cursor-pointer w-fit mx-auto"
              @click="placeOrder"
            >
              Valider commande
            </button>
          </div>
          <p v-if="errorMessage" class="text-red-500 text-center font-semibold mt-4">
            {{ errorMessage }}
          </p>

          <div v-else-if="!user.isLoggedIn && !cart.isEmpty" class="mt-6 flex flex-col text-center">
            <p class="text-gray-500 mb-4">Veuillez vous connecter pour passer une commande.</p>
            <router-link
              to="/login"
              class="text-primary font-medium hover:underline flex items-baseline gap-2 mx-auto"
              @click="ui.closeCart()"
            >
              <p>Se connecter</p>
              <ArrowRightFromLine class="w-4 h-4" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUIStore } from '@/stores/ui-store.ts'
import { useCartStore } from '@/stores/cart-store.ts'
import { useUserStore } from '@/stores/user-store.ts'
import { handleAxiosError } from '@/utils/handle-axios-error.ts'
import { X } from 'lucide-vue-next'

import CartItem from '@/components/cart/CartItem.vue'
import { ArrowRightFromLine, ShoppingBag } from 'lucide-vue-next'

const cart = useCartStore()
const ui = useUIStore()
const user = useUserStore()

const displayMessage = ref(false)
const errorMessage = ref<string | null>(null)

const pickup = ref<'TUESDAY' | 'THURSDAY'>('TUESDAY')

const placeOrder = async () => {
  try {
    await cart.submitOrder(pickup.value)
    displayMessage.value = true
    await new Promise((resolve) => setTimeout(resolve, 3000))
    ui.closeCart()
    displayMessage.value = false
    errorMessage.value = null
  } catch (err: unknown) {
    errorMessage.value = handleAxiosError(err)
  }
}
</script>
