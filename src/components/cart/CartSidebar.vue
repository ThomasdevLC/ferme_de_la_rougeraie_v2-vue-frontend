<template>
  <transition name="slide">
    <div
      v-if="ui.cartOpen"
      class="fixed top-0 right-0 w-full max-w-1/3 h-full bg-white shadow-lg z-50 p-4 overflow-auto"
    >
      <button @click="ui.closeCart" class="mb-4 text-right">Fermer</button>
      <!-- Ton CartView ici -->
      <div class="p-4 max-w-5xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">Votre Panier</h1>

        <div v-if="cart.items.length === 0" class="text-gray-500">Votre panier est vide.</div>

        <CartItem v-for="item in cart.items" :key="item.product.id" :item="item" />

        <p>
          <span class="font-bold">Total:</span>
          {{ cart.cartTotal }} €
        </p>
      </div>
      <label class="block mb-2 font-semibold">Jour de retrait :</label>
      <select v-model="pickup" class="border px-2 py-1 rounded w-full mb-4">
        <option value="TUESDAY">Mardi</option>
        <option value="THURSDAY">Jeudi</option>
      </select>
      <button
        class="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
        @click="placeOrder"
      >
        Valider ma commande
      </button>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { useUIStore } from '@/stores/uiStore'
import { useCartStore } from '@/stores/cartStore.js'
import CartItem from '@/components/cart/CartItem.vue'
import { ref } from 'vue'

const cart = useCartStore()
const ui = useUIStore()

const pickup = ref<'TUESDAY' | 'THURSDAY'>('TUESDAY')

const placeOrder = async () => {
  try {
    const response = await cart.submitOrder(pickup.value)
    console.log('Commande créée ✅', response.data)
    // Optionnel : rediriger, afficher un toast, etc.
  } catch (err) {
    console.error('Erreur commande ❌', err)
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-enter-to {
  transform: translateX(0);
}

.slide-leave-from {
  transform: translateX(0);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>
