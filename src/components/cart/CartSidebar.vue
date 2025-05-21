<template>
  <transition name="modal">
    <div v-if="ui.cartOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Fond assombri -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-xs" @click="ui.closeCart"></div>

      <!-- Fenêtre modale -->
      <div class="relative bg-white min-w-3xl max-w-[65vw] pt-10 p-6 shadow-lg z-10 max-h-[75vh] overflow-y-auto">
        <button
          @click="ui.closeCart"
          class="absolute top-4 right-4 text-sm text-gray-500 hover:text-black"
        >
          Fermer
        </button>

        <!-- Contenu principal -->
        <div class="p-4">
          <div class="flex gap-3 items-baseline mb-4">
            <ShoppingBag class="w-8 h-8" />
            <h1 class="text-2xl font-bold">Panier</h1>
            <p v-if="!cart.isEmpty" class="text-gray-500">{{ cart.numberOfProducts }} article(s)</p>
          </div>

          <div v-if="cart.isEmpty" class="text-gray-500 text-center">Votre panier est vide.</div>

          <CartItem v-for="item in cart.items" :key="item.product.id" :item="item" />

          <p v-if="!cart.isEmpty" class="flex justify-end text-xl mt-4">
            <span class="font-semibold">Total : </span>&nbsp;{{ cart.cartTotal }}
          </p>

          <div v-if="user.isLoggedIn && !cart.isEmpty" class="mt-4 flex flex-col justify-center">
            <label class="block mb-2 font-semibold">Jour de retrait :</label>
            <select v-model="pickup" class="border px-2 py-1 w-full mb-4">
              <option value="TUESDAY">Mardi</option>
              <option value="THURSDAY">Jeudi</option>
            </select>
            <button
              class="bg-primary text-white px-4 py-2 hover:bg-opacity-90 cursor-pointer w-fit mt-6 mx-auto"
              @click="placeOrder"
            >
              Valider ma commande
            </button>
          </div>

          <div v-else-if="!user.isLoggedIn  && !cart.isEmpty" class="mt-6 flex flex-col text-center">
            <p class="text-gray-500 mb-4">Veuillez vous connecter pour passer une commande.</p>
            <router-link to="/login" class="text-primary font-medium hover:underline flex items-baseline gap-2 mx-auto" @click="ui.closeCart()">
             <p>Se connecter</p>
              <ArrowRightFromLine class="w-4 h-4"/>
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

import CartItem from '@/components/cart/CartItem.vue'
import { ShoppingBag, ArrowRightFromLine } from 'lucide-vue-next'

const cart = useCartStore()
const ui = useUIStore()
const user = useUserStore()

const pickup = ref<'TUESDAY' | 'THURSDAY'>('TUESDAY')

const placeOrder = async () => {
  try {
    const response = await cart.submitOrder(pickup.value)
    console.log('Commande créée ', response.data)
  } catch (err) {
    console.error('Erreur commande ', err)
  }
}
</script>

