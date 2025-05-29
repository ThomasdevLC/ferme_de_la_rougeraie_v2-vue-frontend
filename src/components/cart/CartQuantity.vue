<template>
  <QuantityControl
    :displayedQuantity="formattedQuantity"
    :unit="product.unit"
    :isMax="isMax"
    :onIncrement="() => cart.incrementQuantity(product.id)"
    :onDecrement="() => cart.decrementQuantity(product.id)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatFloat } from '@/utils/number-format';
import { useCartStore } from '@/stores/cart-store';
import QuantityControl from '@/components/ui/common/QuantityControl.vue';
import type { Product } from '@/models/product/product';

const props = defineProps<{ product: Product; quantity: number }>();
const cart = useCartStore();

const isMax = computed(() =>
  props.product.stock !== null && props.quantity >= props.product.stock
);

const formattedQuantity = computed(() =>
  props.product.unit === 'Kilo'
    ? formatFloat(props.quantity)
    : Math.round(props.quantity).toString()
);
</script>
