<template>
  <transition name="slide">
    <div
      v-if="ui.cartOpen"
      class="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 p-4 overflow-auto"
    >
      <button @click="ui.closeCart" class="mb-4 text-right">Fermer</button>
      <!-- Ton CartView ici -->
      <div class="p-4 max-w-5xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">Mon Panier</h1>

        <div v-if="cart.items.length === 0" class="text-gray-500">
          Votre panier est vide.
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="item in cart.items"
            :key="item.product.id"
            class="flex items-center justify-between border p-4 rounded shadow-sm"
          >
            <div class="flex items-center space-x-4">
              <img
                :src="`http://localhost:8000${item.product.image}`"
                :alt="item.product.name"
                class="w-20 h-20 object-cover rounded"
              />
              <div>
                <p class="font-semibold text-lg">{{ item.product.name }}</p>
                <p class="text-sm text-gray-500">
                  {{ item.product.price.toFixed(2) }} € / {{ item.product.unit }}
                </p>
                <p class="text-sm text-gray-700 mt-1">
                  Quantité : {{ item.quantity }}
                </p>
              </div>
            </div>

            <button
              @click="cart.removeFromCart(item.product.id)"
              class="text-red-500 hover:underline text-sm"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>    </div>
  </transition>
</template>

<script lang="ts" setup>
import { useUIStore } from '@/stores/uiStore';
import { useCartStore } from '@/stores/cartStore.js'

const cart = useCartStore();

const ui = useUIStore();
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
