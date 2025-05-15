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
import type { Product } from '@/models/Product';

const props = defineProps<{
  modelValue: number;
  product: Product;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const quantity = ref(props.modelValue);

// Sync with parent
watch(() => props.modelValue, (val) => {
  quantity.value = val;
});

const isMax = computed(() =>
  props.product.stock !== null && quantity.value >= props.product.stock
);

const step = computed(() => props.product.inter ?? 1);

function increment() {
  const nextValue = +(quantity.value + step.value).toFixed(2);

  if (props.product.stock !== null && nextValue > props.product.stock) {
    return;
  }

  quantity.value = nextValue;
  emit('update:modelValue', quantity.value);
}

function decrement() {
  const newVal = +(quantity.value - step.value).toFixed(2);
  quantity.value = newVal >= 0 ? newVal : 0;
  emit('update:modelValue', quantity.value);
}

const formattedQuantity = computed(() =>
  props.product.unit === 'Kilo'
    ? quantity.value.toFixed(1)
    : Math.round(quantity.value)
);


</script>
