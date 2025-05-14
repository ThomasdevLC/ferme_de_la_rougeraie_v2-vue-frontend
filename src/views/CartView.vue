<template>
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
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore';

const cart = useCartStore();
</script>
