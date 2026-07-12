<template>
  <QuantityControl
    :displayedQuantity="formattedQuantity"
    :unit="product.unit"
    :isMax="isMax"
    :onIncrement="() => cart.incrementQuantity(product.id, variantId)"
    :onDecrement="() => cart.decrementQuantity(product.id, variantId)"
  />

</template>

<script setup lang="ts">
import { computed} from 'vue';
import { formatFloat } from '@/utils/number-format';
import { useCartStore } from '@/stores/cart-store';
import QuantityControl from '@/components/ui/common/QuantityControl.vue';
import type { Product, ProductVariant } from '@/models/product/product';

const props = defineProps<{ product: Product; variant?: ProductVariant | null; quantity: number }>();
const cart = useCartStore();

const variantId = computed(() => props.variant?.id ?? null);

const maxAllowed = computed(() => cart.getMaxAllowed(props.product, props.variant ?? null));

const isMax = computed(() => {
  if (maxAllowed.value === null) return false;
  return props.quantity >= maxAllowed.value;
});

const formattedQuantity = computed(() =>
  props.product.unit === 'Kilo'
    ? formatFloat(props.quantity)
    : Math.round(props.quantity).toString()
);
</script>
