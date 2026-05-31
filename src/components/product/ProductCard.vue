<template>
  <div class="flex flex-col w-[260px] h-[440px] bg-white border border-gray-2 relative">
    <div class="absolute bottom-[165px] ml-[-5px]">
      <p v-if="product.limited" class="bg-primary text-white text-sm font-medium px-2 py-1 mb-4 uppercase">
        Quantité limitée
      </p>
    </div>

    <div class="h-[280px] overflow-hidden">
      <img
        :src="`${baseUrl}${product.image}`"
        :alt="`Image de ${product.name}`"
        loading="lazy"
        class="w-full h-full object-cover"
      />
      <img
        v-if="product.discount"
        src="/assets/promo.png"
        alt="Promotion"
        class="absolute top-[-9px] right-[-14px] w-19 h-19"
      />
    </div>

    <div class="px-2 py-3 flex-1 flex flex-col justify-between text-text-color">
      <div class="flex items-start gap-1">
        <p ref="nameElement" class="min-w-0 flex-1 text-[1.8rem] font-titles truncate">
          {{ product.name }}
        </p>

        <div v-if="showInfoButton" class="relative group shrink-0 mt-2">
          <button
            type="button"
            class="flex h-5 w-5 items-center justify-center text-gray-4 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            :aria-label="infoLabel"
          >
            <Info class="h-4 w-4" stroke-width="2" />
          </button>

          <div
            class="pointer-events-none absolute right-0 top-7 z-20 hidden w-56 border border-gray-2 bg-white px-3 py-2 text-sm leading-snug text-text-color shadow-lg group-hover:block group-focus-within:block"
          >
            <p>{{ product.name }}</p>
            <p v-if="product.discount && product.discountText" class="mt-1 font-medium text-primary" v-html="highlightNumbers(product.discountText)"></p>
          </div>
        </div>
      </div>
      <p class="text-md text-[0.9rem] text-gray-4 mt-1">
        <span class="font-roboto">{{ product.price.toFixed(2) }}</span> € /
        <span class="tracking-tighter">{{ product.unit }}</span>
      </p>

      <ProductQuantity v-model="quantity" :product="product" />

      <p class="font-medium text-[0.9rem] cursor-pointer hover:text-primary" @click="onAddToCart">
        {{ added ? 'AJOUTÉ' : 'AJOUTER AU PANIER' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/models/product/product.ts'
import ProductQuantity from '@/components/product/ProductQuantity.vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useCartStore } from '@/stores/cart-store.ts'
import { Info } from 'lucide-vue-next'

const { product } = defineProps<{ product: Product }>()
const cart = useCartStore()

const baseUrl = import.meta.env.VITE_API_BASE_URL

const quantity = ref(0)
const added = ref(false)
const nameElement = ref<HTMLElement | null>(null)
const isNameTruncated = ref(false)

const hasDiscountInfo = computed(() => Boolean(product.discount && product.discountText))
const showInfoButton = computed(() => hasDiscountInfo.value || isNameTruncated.value)
const infoLabel = computed(() =>
  hasDiscountInfo.value ? `Voir les informations de ${product.name}` : `Voir le nom complet de ${product.name}`,
)

function updateNameTruncation() {
  const element = nameElement.value
  if (!element) return
  isNameTruncated.value = element.scrollWidth > element.clientWidth
}

onMounted(() => {
  nextTick(updateNameTruncation)
  window.addEventListener('resize', updateNameTruncation)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateNameTruncation)
})

watch(() => product.name, () => nextTick(updateNameTruncation))

function highlightNumbers(text: string): string {
  return text.replace(/\d+([.,]\d+)?/g, '<span class="font-roboto font-normal">$&</span>')
}

function onAddToCart() {
  if (quantity.value <= 0) return
  cart.addToCart(product, quantity.value)
  added.value = true
  setTimeout(() => {
    added.value = false
  }, 1500)
}
</script>
