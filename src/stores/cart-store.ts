
import { defineStore } from 'pinia';
import type { Product } from '@/models/product/product.ts';
import type { CartItem } from '@/models/cart/cart-item.ts';
import { convertPriceToCents, formatPrice } from '@/utils/price'
import { createOrder } from '@/services/order-service.ts'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],

  }),

  getters: {

    isProductInCart: (state) => (productId: number): boolean => {
      return state.items.some(item => item.product.id === productId);
    },

    getProductQuantity: (state) => (productId: number): number => {
      const item = state.items.find(item => item.product.id === productId);
      return item ? item.quantity : 0;
    },

    cartTotal(state): string {
      const totalCents = state.items.reduce((sum, item) => {
        const unitPriceCents = convertPriceToCents(item.product.price);
        return sum + Math.round(unitPriceCents * item.quantity);
      }, 0);

      return formatPrice(totalCents);
    },

    numberOfProducts(state): number {
      return state.items.length;
    },

    isEmpty(state): boolean {
      return state.items.length === 0;
    },


  },


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


    addToCart(product: Product, quantity: number): boolean {
      if (quantity <= 0) return false;

      if (this.isProductInCart(product.id)) {
        return false;
      } else {
        this.items.push({ product, quantity });
        this.saveCartToStorage();
        return true;
      }
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

    getItemTotal(item: CartItem): string {
      const unitPriceInCents = convertPriceToCents(item.product.price);
      const totalInCents = Math.round(unitPriceInCents * item.quantity);
      return formatPrice(totalInCents);
    },

    async submitOrder(pickup: 'TUESDAY' | 'THURSDAY') {
      const payload = {
        pickup,
        items: this.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

        const response = await createOrder(payload);
        this.clearCart();
        return response;
    }
  },

});
