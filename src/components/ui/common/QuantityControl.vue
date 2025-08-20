<template>
  <div class="flex flex-col md:flex-row items-center my-3">
    <div class="flex items-center">
      <button @click="onDecrement" class="cursor-pointer w-7 bg-white border text-sm px-2 py-0.5">
        –
      </button>

      <div
        class="flex items-center justify-center px-2 py-0.5 text-sm border-t border-b"
        :class="{
        'w-14': unit === 'Kilo',
        'w-10': unit !== 'Kilo',
      }"
      >
        <span>{{ displayedQuantity }}</span>
        <span v-if="unit === 'Kilo'" class="text-xs ml-1">Kg</span>
      </div>

      <div class="relative inline-flex">
        <button
          @click="onIncrement"
          :disabled="isMax"
          class="cursor-pointer w-7 bg-white border text-sm px-2 py-0.5"
        >
          +
        </button>

        <p
          v-if="isMax"
          class="absolute bottom-full left-1 mb-1
               text-xs bg-red-50 text-red-600 border border-red-200
               rounded-sm px-2 py-0.5  whitespace-nowrap z-10
               pointer-events-none"
        >
          Stock max atteint
        </p>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const { displayedQuantity, unit, isMax, onIncrement, onDecrement } = defineProps<{
  displayedQuantity: number | string
  unit: string
  isMax: boolean
  onIncrement: () => void
  onDecrement: () => void
}>()
</script>
