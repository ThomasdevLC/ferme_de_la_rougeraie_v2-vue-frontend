<template>
  <QuantityControl
    :displayedQuantity="formattedQuantity"
    :unit="product.unit"
    :isMax="isMax"
    :onIncrement="handleIncrement"
    :onDecrement="handleDecrement"
  />
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { formatFloat } from '@/utils/number-format';
import { useCartStore } from '@/stores/cart-store';
import type { Product } from '@/models/product/product';
import QuantityControl from '@/components/ui/common/QuantityControl.vue';

const props = defineProps<{ modelValue: number; product: Product }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>();
const cart = useCartStore();

const quantity = ref(props.modelValue);
watch(() => props.modelValue, v => quantity.value = v);

const inCartQty = computed(() => cart.getProductQuantity(props.product.id));
const isInCart  = computed(() => cart.isProductInCart(props.product.id));
const displayed = computed(() => isInCart.value ? inCartQty.value : quantity.value);
const isMax     = computed(() => props.product.stock !== null && displayed.value >= props.product.stock);
const step      = props.product.inter ?? 1;

watch(inCartQty, (newQty, oldQty) => {
  if (oldQty > 0 && newQty === 0) {
    quantity.value = 0;
    emit('update:modelValue', 0);
  }
});

function handleIncrement() {
  if (isInCart.value) cart.incrementQuantity(props.product.id);
  else {
    const nextQty = +(displayed.value + step).toFixed(2);
    quantity.value = nextQty;
    emit('update:modelValue', nextQty);
  }
}

function handleDecrement() {
  if (isInCart.value) cart.decrementQuantity(props.product.id);
  else {
    const nextQty = Math.max(+(displayed.value - step).toFixed(2), 0);
    quantity.value = nextQty;
    emit('update:modelValue', nextQty);
  }
}

const formattedQuantity = computed(() =>
  props.product.unit === 'Kilo'
    ? formatFloat(displayed.value)
    : Math.round(displayed.value).toString()
);
</script>
