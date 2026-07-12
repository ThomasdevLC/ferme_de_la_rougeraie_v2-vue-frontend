<template>
  <div class="relative z-10 max-w-[75rem] mx-auto pt-6 md:pt-40">
    <div
      v-if="loading && !closedShopMessage"
      class="flex flex-col items-center justify-center min-h-[60vh] gap-4"
    >
      <img :src="loaderSrc" alt="loader" />
      <p class="text-xl font-roboto font-medium text-gray-4 flex items-center gap-2">
        Chargement
        <Shell class="w-5 h-5 animate-spin" />
      </p>
    </div>

    <p
      v-else-if="closedShopMessage"
      class="text-2xl sm:text-3xl md:text-4xl font-roboto font-medium text-gray-4 text-center mt-40 px-4 whitespace-pre-line"
    >
      {{ closedShopMessage.content }}
    </p>

    <div
      v-if="!loading && !closedShopMessage?.content && categories.length"
      class="flex flex-wrap justify-center gap-3 md:px-24 lg:px-0"
      :class="hasMarquee ? 'pt-16' : 'pt-8'"
    >
      <button
        v-for="category in categories"
        :key="category.key"
        type="button"
        :aria-pressed="isSelected(category.key)"
        class="border px-4 py-2 text-sm font-medium uppercase cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        :class="
          isSelected(category.key)
            ? 'bg-[#FE9C34] text-white border-[#FE9C34]'
            : 'bg-white text-gray-4 border-gray-2 hover:border-primary'
        "
        @click="toggleCategory(category.key)"
      >
        {{ category.label }}
      </button>
    </div>

    <Transition
      name="slide-up"
      enter-active-class="transition duration-400"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div
        v-if="!loading && !closedShopMessage?.content"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 place-items-center gap-6 pt-10 pb-20 md:px-24 lg:px-0"
      >
        <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { fetchProducts } from '@/services/product/product-service.ts'
import { useMessageStore } from '@/stores/message-store.ts'
import type { Product } from '@/models/product/product.ts'
import { deriveCategories } from '@/utils/product-category.ts'
import ProductCard from '@/components/product/ProductCard.vue'
import { Shell } from 'lucide-vue-next'
import loaderImg from '/assets/tomatoe.png'

const products = ref<Product[]>([])
const messageStore = useMessageStore()
const loading = ref(true)
const loaderSrc = loaderImg

const closedShopMessage = computed(() => messageStore.closedShopMessage)
const hasMarquee = computed(() => Boolean(messageStore.marqueeMessage))

const selectedKeys = ref<string[]>([])
const categories = computed(() => deriveCategories(products.value))

function isSelected(key: string) {
  return selectedKeys.value.includes(key)
}

function toggleCategory(key: string) {
  selectedKeys.value = isSelected(key)
    ? selectedKeys.value.filter((k) => k !== key)
    : [...selectedKeys.value, key]
}

const filteredProducts = computed(() =>
  selectedKeys.value.length === 0
    ? products.value
    : products.value.filter((p) => p.category && selectedKeys.value.includes(p.category.key)),
)

onMounted(async () => {
  window.scrollTo({ top: 0 })
  try {
    const response = await fetchProducts()
    products.value = response.data as Product[]
  } catch (error) {
    console.error('Erreur chargement produits :', error)
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
})
</script>
