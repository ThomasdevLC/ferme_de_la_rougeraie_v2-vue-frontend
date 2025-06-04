import { defineStore } from 'pinia';
import { fetchMessages } from '@/services/message-service';
import type { Message } from '@/models/message/message';

export const useMessageStore = defineStore('messages', {
  state: () => ({
    messages: [] as Message[],
    loading: false,
    error: null as string | null,
  }),
  getters: {
    marqueeMessage(state) {
      return state.messages.find(m => m.type === 'MARQUEE' && m.isActive);
    },
    closedShopMessage(state) {
      return state.messages.find(m => m.type === 'CLOSEDSHOP' && m.isActive);
    },
  },
  actions: {
    async loadMessages() {
      this.loading = true;
      this.error = null;
      try {
        this.messages = await fetchMessages();
      } catch (err) {
        this.error = (err as Error).message;
      } finally {
        this.loading = false;
      }
    },
  },
});
