<template>
  <div
    v-if="marqueeMessage"
    class="flex items-center justify-start overflow-hidden bg-gray-1 sm:bg-black/20 border-b border-black text-text-color py-2 sm:py-3"
  >
    <span
      v-for="i in 6"
      :key="i"
      class="uppercase whitespace-nowrap animate-marquee text-xl sm:text-[1.5rem] font-black mr-6"
    >
      {{ marqueeMessage.content }} &nbsp; | &nbsp;
    </span>
  </div>
</template>

<script setup lang="ts">
import { useMessageStore } from '@/stores/message-store.ts'
import { computed } from 'vue'

const messageStore = useMessageStore()

const marqueeMessage = computed(() => messageStore.marqueeMessage)
</script>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-marquee {
  animation: marquee 10s linear infinite;
}
</style>

