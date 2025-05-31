<template>
  <div v-if="marqueeMessages.length" class="marquee-container bg-black/20">
<div class="marquee-content py-4 text-xl font-medium font-titles border-b border-b-black">
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp;|&nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>
  <span v-for="msg in marqueeMessages" :key="msg.id">{{ msg.content }} &nbsp; &nbsp;|&nbsp; &nbsp;</span>

</div>
</div>
</template>

<script setup lang="ts">
import { useMessageStore } from '@/stores/message-store.ts';
import { onMounted } from 'vue';

const messageStore = useMessageStore();

onMounted(() => {
  if (!messageStore.messages.length) {
    messageStore.loadMessages();
  }
});

const marqueeMessages = messageStore.marqueeMessages;


</script>

<style scoped>
.marquee-container {
  overflow: hidden;
  white-space: nowrap;
}

.marquee-content {
  display: inline-block;
  animation: marquee 100s linear infinite;
}

@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
</style>
