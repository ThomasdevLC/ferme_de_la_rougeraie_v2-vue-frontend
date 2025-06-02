<template>
  <div v-if="marqueeMessage" class="marquee bg-black/20 border-b border-b-black text-text-color py-3">
    <span>{{ marqueeMessage.content }} &nbsp;|&nbsp;</span>
    <span >{{ marqueeMessage.content }} &nbsp;|&nbsp;</span>
    <span>{{ marqueeMessage.content }} &nbsp;|&nbsp;</span>
    <span>{{ marqueeMessage.content }} &nbsp;|&nbsp;</span>
    <span>{{ marqueeMessage.content }} &nbsp;|&nbsp;</span>
  </div>
</template>

<script setup lang="ts">
import { useMessageStore } from '@/stores/message-store.ts'
import { onMounted, computed } from 'vue'

const messageStore = useMessageStore()

onMounted(() => {
  messageStore.loadMessages();
});


const marqueeMessage = computed(() => messageStore.marqueeMessage)
</script>

<style scoped>
.marquee {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
}

.marquee span {
  text-transform: uppercase;
  will-change: transform;
  white-space: nowrap;
  animation: marquee 10s linear infinite;
  font-size: 1.5rem;
  font-weight: 900;
}

.marquee span svg {
  width: 1.5em;
  height: 1.5em;
  margin: 0 0.5rem;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
