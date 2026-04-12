
import { defineStore } from 'pinia';
import type { Product } from '@/models/product/product.ts';
import type { CartItem } from '@/models/cart/cart-item.ts';
import { convertPriceToCents, formatPrice } from '@/utils/price'
import { createOrder } from '@/services/order/order-service.ts'
import { cartStorage } from '@/services/cart/cart-storage'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],

    isEditing: false,
    editPickupDate: '' as string,
    currentOrderId: null as number | null,

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

    getMaxAllowed: (state) => (product: Product): number | null => {

      if (!state.isEditing) {
        return product.stock ?? null;
      }
      const item = state.items.find(i => i.product.id === product.id);

      if (item) {
        return item.maxAllowed ?? item.product.stock ?? null;
      }
      return product.stock ?? null;
    },

  },


  actions: {
    loadCartFromStorage() {
      this.items = cartStorage.load()
    },

    saveCartToStorage() {
      cartStorage.save(this.items)
    },


    addToCart(product: Product, quantity: number, maxAllowed?: number | null): boolean {
      if (quantity <= 0) return false;

      if (this.isProductInCart(product.id)) {
        return false;
      } else {
        this.items.push({ product, quantity, maxAllowed: maxAllowed ?? null });
        this.saveCartToStorage();
        return true;
      }
    },

    incrementQuantity(productId: number) {
      const item = this.items.find(i => i.product.id === productId);
      if (!item) return;

      const step = item.product.inter ?? 1;
      const newQuantity = +(item.quantity + step).toFixed(2);

      const limit = this.isEditing
        ? (item.maxAllowed ?? item.product.stock ?? null)  // 👈 fallback IMPORTANT
        : (item.product.stock ?? null);

      if (limit !== null && newQuantity > limit) {
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

    async submitOrder(pickupDate: string) {
      if (!pickupDate) {
        throw new Error('Date de retrait manquante')
      }
      const payload = {
        pickupDate,
        items: this.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

        const response = await createOrder(payload);
        this.clearCart();
        return response;
    },

    /**
     * @param orderId
     * @param pickupDateIso ISO Date "YYYY-MM-DD"
     */
    startEditing(orderId: number, pickupDateIso: string) {
      this.currentOrderId  = orderId
      this.isEditing       = true
      this.editPickupDate  = pickupDateIso
    },

    stopEditing() {
      this.currentOrderId  = null
      this.isEditing      = false
      this.editPickupDate = ''
    }

  },

});
