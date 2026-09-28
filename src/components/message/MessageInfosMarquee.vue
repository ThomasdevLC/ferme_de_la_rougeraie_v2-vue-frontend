<template>
  <div
    v-if="marqueeMessage"
    class="flex items-center overflow-hidden bg-gray-1 sm:bg-black/20 border-b border-black text-text-color py-2 sm:py-3"
  >
    <div
      ref="stripRef"
      class="flex animate-marquee whitespace-nowrap"
      :style="{ '--marquee-duration': `${duration}s` }"
    >
      <span v-for="i in 8" :key="'a' + i" class="inline-flex items-center uppercase text-xl sm:text-2xl font-black font-roboto mx-6">
        {{ marqueeMessage.content }} &nbsp; <img :src="tomatoeSrc" alt="" class="w-10 h-10 inline mx-2 rotate-12" /> &nbsp;
      </span>
      <span v-for="i in 8" :key="'b' + i" class="inline-flex items-center uppercase text-xl sm:text-2xl font-black font-roboto mx-6">
        {{ marqueeMessage.content }} &nbsp; <img :src="tomatoeSrc" alt="" class="w-10 h-10 inline mx-2 rotate-12" /> &nbsp;
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessageStore } from '@/stores/message-store.ts'
import { computed, ref, watch } from 'vue'
import tomatoe from '/assets/tomatoe.png'

// Vitesse de défilement constante, indépendante de la longueur du message
const SPEED_PX_PER_SEC = 50

const messageStore = useMessageStore()
const marqueeMessage = computed(() => messageStore.marqueeMessage)
const tomatoeSrc = tomatoe

const stripRef = ref<HTMLElement | null>(null)
const duration = ref(90)

const updateDuration = () => {
  if (!stripRef.value) return
  // L'animation parcourt la moitié de la bande (translateX -50%)
  const distance = stripRef.value.scrollWidth / 2
  if (distance > 0) duration.value = distance / SPEED_PX_PER_SEC
}

// La bande n'existe qu'une fois le message chargé (v-if) : on observe la ref
watch(stripRef, (el, _, onCleanup) => {
  if (!el) return
  updateDuration()
  const observer = new ResizeObserver(updateDuration)
  observer.observe(el)
  onCleanup(() => observer.disconnect())
})
</script>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee var(--marquee-duration, 90s) linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-marquee {
    animation: none;
  }
}
</style>
