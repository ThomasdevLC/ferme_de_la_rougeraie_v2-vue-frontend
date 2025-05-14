// stores/uiStore.ts
import { defineStore } from 'pinia';

export const useUIStore = defineStore('ui', {
  state: () => ({
    cartOpen: false,
  }),
  actions: {
    toggleCart() {
      this.cartOpen = !this.cartOpen;
    },
    openCart() {
      this.cartOpen = true;
    },
    closeCart() {
      this.cartOpen = false;
    },
  },
});
