<template>
  <div class="flex items-center my-3">
    <button
      @click="decrement"
      class="w-7 bg-white border text-sm px-2 py-0.5 cursor-pointer"
    >
      -
    </button>

    <div
      class="min-w-8 flex items-center justify-center px-2 py-0.5 text-sm border-t border-b"
    >
      <span>{{ formattedQuantity }}</span>
      <span v-if="product.unit === 'Kilo'" class="text-xs ml-1">Kg</span>
    </div>

    <button
      @click="increment"
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
import { ref, watch, computed } from 'vue';
import type { Product } from '@/models/product/product.ts';
import { formatFloat } from '@/utils/number-format.ts'
import { useCartStore } from '@/stores/cart-store.ts';

const props = defineProps<{
  modelValue: number;
  product: Product;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const cart = useCartStore();

const quantity = ref(props.modelValue);
watch(() => props.modelValue, val => quantity.value = val);

const quantityInCart = computed(() =>
  cart.getProductQuantity(props.product.id)
);

const isInCart = computed(() =>
  cart.isProductInCart(props.product.id)
);

const displayedQuantity = computed(() =>
  isInCart.value
    ? quantityInCart.value
    : quantity.value
);

const isMax = computed(() =>
  props.product.stock !== null && displayedQuantity.value >= props.product.stock
);

const step = computed(() => props.product.inter ?? 1);

function increment() {
  const nextValue = +(displayedQuantity.value + step.value).toFixed(2);
  if (props.product.stock !== null && nextValue > props.product.stock) return;

  if (isInCart.value) {
    cart.incrementQuantity(props.product.id);
  } else {
    quantity.value = nextValue;
    emit('update:modelValue', quantity.value);
  }
}

function decrement() {
  const newVal = +(displayedQuantity.value - step.value).toFixed(2);
  const nextQty = Math.max(newVal, 0);

  if (isInCart.value) {
    cart.decrementQuantity(props.product.id);
  } else {
    quantity.value = nextQty;
    emit('update:modelValue', quantity.value);
  }
}

const formattedQuantity = computed(() =>
  props.product.unit === 'Kilo'
    ? formatFloat(displayedQuantity.value)
    : Math.round(displayedQuantity.value).toString()
);
</script>
