<template>
  <div class="flex items-center my-3">
    <button
      @click="cart.decrementQuantity(product.id)"
      class="w-7 bg-white border text-sm px-2 py-0.5 cursor-pointer"
    >
      -
    </button>

    <div class="min-w-8 flex items-center justify-center px-2 py-0.5 text-sm border-t border-b">
      <span>{{ formattedQuantity }}</span>
      <span v-if="product.unit === 'Kilo'" class="text-xs ml-1">Kg</span>
    </div>

    <button
      @click="cart.incrementQuantity(product.id)"
      class="w-7 bg-white border text-sm px-2 py-0.5 cursor-pointer"
    >
      +
    </button>

    <p v-if="isMax" class="text-xs text-red-600 mt-1 ml-2">
      Stock max atteint
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '@/models/product/Product.ts';
import { useCartStore } from '@/stores/cartStore';

const cart = useCartStore();

const props = defineProps<{
  product: Product;
  quantity: number;
}>();

const isMax = computed(() =>
  props.product.stock !== null && props.quantity >= props.product.stock
);

const formattedQuantity = computed(() =>
  props.product.unit === 'Kilo'
    ? props.quantity.toFixed(1)
    : Math.round(props.quantity)
);
</script>
