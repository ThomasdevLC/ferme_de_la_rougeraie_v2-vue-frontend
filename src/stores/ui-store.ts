// stores/ui-store.ts
import { defineStore } from 'pinia';

export const useUIStore = defineStore('ui', {
  state: () => ({
    cartOpen: false,
    userMenuOpen: false,
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

    toggleUserMenu() {
      this.userMenuOpen = !this.userMenuOpen;
    },
    closeUserMenu() {
      this.userMenuOpen = false;
    }
  },
});
