import { defineStore } from 'pinia';
import type { Product } from '@/models/Product';
import type { CartItem } from '@/models/CartItem';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  actions: {
    loadCartFromStorage() {
      const stored = localStorage.getItem('cart');
      if (stored) {
        this.items = JSON.parse(stored);
      }
    },

    saveCartToStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },

    addToCart(product: Product, quantity: number) {
      if (quantity <= 0) return;

      const existingItem = this.items.find(item => item.product.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        existingItem.quantity = product.stock !== null && newQuantity > product.stock
          ? product.stock
          : newQuantity;
      } else {
        const qty = product.stock !== null && quantity > product.stock
          ? product.stock
          : quantity;

        this.items.push({ product, quantity: qty });
      }

      this.saveCartToStorage();
    },

    incrementQuantity(productId: number) {
      const item = this.items.find(i => i.product.id === productId);
      if (!item) return;

      const step = item.product.inter ?? 1;
      const newQuantity = +(item.quantity + step).toFixed(2);

      if (item.product.stock !== null && newQuantity > item.product.stock) {
        return;
      }

      item.quantity = newQuantity;
      this.saveCartToStorage();
    },

    decrementQuantity(productId: number) {
      const item = this.items.find(i => i.product.id === productId);
      if (!item) return;

      const step = item.product.inter ?? 1;
      const newQuantity = +(item.quantity - step).toFixed(2);

      item.quantity = newQuantity >= 0 ? newQuantity : 0;

      // Supprimer si on veut pas afficher quantité = 0
      if (item.quantity === 0) {
        this.removeFromCart(productId);
      }

      this.saveCartToStorage();
    },

    removeFromCart(productId: number) {
      this.items = this.items.filter(item => item.product.id !== productId);
      this.saveCartToStorage();
    },

    clearCart() {
      this.items = [];
      this.saveCartToStorage();
    },
  },
});
