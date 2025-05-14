<template>
  <div
    class="flex flex-col max-w-[260px] h-[440px] bg-white border border-gray-2 relative"
    :title="product.name"
  >

    <div class="absolute bottom-[165px] ml-[-5px]">
    <p
      v-if="product.discount"
      class=" bg-light-primary text-white text-md font-medium px-2 py-1 "
    >
      Promo
    </p>

    <!-- Badge quantité limitée -->
    <p
      v-if="product.limited"
      class=" bg-primary text-white text-md font-medium px-2 py-1 mt-4 "
    >
      Quantité limitée
    </p>
    </div>
    <!-- Image produit -->
    <div class="h-[280px] overflow-hidden">
      <img
        :src="`http://localhost:8000${product.image}`"
        :alt="`Image de ${product.name}`"
        loading="lazy"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Texte produit -->
    <div class="px-2 py-3 flex-1 flex flex-col justify-between text-text-color">
      <p class="text-3xl font-titles  truncate">
        {{ product.name }}
      </p>
      <p class="text-md text-gray-4 mt-1">
        {{ product.price.toFixed(2) }} € / <span>{{ product.unit }}</span>
      </p>

        <div class="flex items-center my-3 ">
          <!-- Minus button -->
          <button
            class="w-[28px] bg-white border  text-sm px-2.5 py-0.5 cursor-pointer"
          >
            -
          </button>

          <!-- Quantity display -->
          <div
            class="min-w-[28px] flex items-center justify-center px-2.5 py-0.5 text-sm border-t border-b "
          >
            <span>0</span>
          </div>

          <!-- Plus button -->
          <button
            class="w-[28px] bg-white border text-sm px-2.5 py-0.5 cursor-pointer"
          >
            +
          </button>
        </div>


        <p class="font-medium cursor-pointer hover:text-primary">AJOUTER AU PANIER</p>


    </div>

  </div>

</template>

<script setup lang="ts">
import type { Product } from '@/models/Product';

defineProps<{ product: Product }>();
</script>
