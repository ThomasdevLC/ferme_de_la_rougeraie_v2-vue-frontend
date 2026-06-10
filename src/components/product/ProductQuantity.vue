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
import { computed } from 'vue'
import { formatFloat } from '@/utils/number-format'
import { useCartStore } from '@/stores/cart-store'
import type { Product } from '@/models/product/product'
import QuantityControl from '@/components/ui/common/QuantityControl.vue'

const props = defineProps<{ product: Product }>()
const cart = useCartStore()

const inCartQty = computed(() => cart.getProductQuantity(props.product.id))
const isInCart = computed(() => cart.isProductInCart(props.product.id))
const displayed = computed(() => inCartQty.value)
const step = props.product.inter ?? 1
const maxAllowed = computed(() => cart.getMaxAllowed(props.product))
const isMax = computed(() => {
  if (maxAllowed.value === null) return false
  return displayed.value >= maxAllowed.value
})

function handleIncrement() {
  if (isInCart.value) {
    cart.incrementQuantity(props.product.id)
  } else {
    cart.addToCart(props.product, step)
  }
}

function handleDecrement() {
  if (isInCart.value) cart.decrementQuantity(props.product.id)
}

const formattedQuantity = computed(() =>
  props.product.unit === 'Kilo'
    ? formatFloat(displayed.value)
    : Math.round(displayed.value).toString()
)
</script>
