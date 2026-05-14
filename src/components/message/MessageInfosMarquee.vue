<template>
  <div
    v-if="marqueeMessage"
    class="flex items-center overflow-hidden bg-gray-1 sm:bg-black/20 border-b border-black text-text-color py-2 sm:py-3"
  >
    <div class="flex animate-marquee whitespace-nowrap">
      <span v-for="i in 8" :key="'a' + i" class="inline-flex items-center uppercase text-xl sm:text-[1.5rem] font-black mx-6">
        {{ marqueeMessage.content }} &nbsp; <img :src="tomatoeSrc" alt="" class="w-10 h-10 inline mx-2 rotate-12" /> &nbsp;
      </span>
      <span v-for="i in 8" :key="'b' + i" class="inline-flex items-center uppercase text-xl sm:text-[1.5rem] font-black mx-6">
        {{ marqueeMessage.content }} &nbsp; <img :src="tomatoeSrc" alt="" class="w-10 h-10 inline mx-2 rotate-12" /> &nbsp;
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessageStore } from '@/stores/message-store.ts'
import { computed } from 'vue'
import tomatoe from '/assets/tomatoe.png'

const messageStore = useMessageStore()
const marqueeMessage = computed(() => messageStore.marqueeMessage)
const tomatoeSrc = tomatoe
</script>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 40s linear infinite;
}
</style>
