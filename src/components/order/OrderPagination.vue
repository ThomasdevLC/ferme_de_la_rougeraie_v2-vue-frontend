<template>
  <div class="flex justify-between mt-4 items-center text-sm gap-4">
    <button
      v-if="currentPage > 1"
      @click="$emit('prev')"
      class="cursor-pointer hover:underline"
    >
      &lt; Précédent
    </button>
    <span v-else />

    <span>Page {{ currentPage }} sur {{ totalPages }}</span>

    <button
      v-if="currentPage < totalPages"
      @click="$emit('next')"
      class="cursor-pointer hover:underline"
    >
      Suivant &gt;
    </button>
    <span v-else />
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
