<template>
  <div class="flex justify-between mt-4 items-center text-sm gap-4">
    <button
      @click="$emit('prev')"
      :disabled="currentPage === 1"
      class="text-blue-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
    >
      < Précédent
    </button>

    <span>Page {{ currentPage }} sur {{ totalPages }}</span>

    <button
      @click="$emit('next')"
      :disabled="currentPage === totalPages"
      class="text-blue-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
    >
      Suivant >
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number;
  totalPages: number;
}>()

defineEmits<{
  (e: 'prev'): void;
  (e: 'next'): void;
}>()
</script>
