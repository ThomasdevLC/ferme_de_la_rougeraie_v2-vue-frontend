
import { defineStore } from 'pinia';
import type { Product, ProductVariant } from '@/models/product/product.ts';
import type { CartItem } from '@/models/cart/cart-item.ts';
import type { OrderItem } from '@/models/order/order-item.ts';
import { convertPriceToCents, formatPrice, getUnitPrice } from '@/utils/price'
import { createOrder } from '@/services/order/order-service.ts'
import { cartStorage } from '@/services/cart/cart-storage'

/**
 * Une ligne de panier est identifiée par le couple (productId, variantId) :
 * deux variants d'un même produit = deux lignes distinctes.
 * Produit simple → variantId = null.
 */
const isSameLine = (item: CartItem, productId: number, variantId: number | null): boolean =>
  item.product.id === productId && (item.variant?.id ?? null) === variantId;

/** Stock de référence d'une ligne : celui du variant s'il y en a un, sinon celui du produit. */
const getLineStock = (item: CartItem): number | null =>
  item.variant ? item.variant.stock : (item.product.stock ?? null);

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],

    isEditing: false,
    editPickupDate: '' as string,
    currentOrderId: null as number | null,

  }),

  getters: {

    isProductInCart: (state) => (productId: number, variantId: number | null = null): boolean => {
      return state.items.some(item => isSameLine(item, productId, variantId));
    },

    getProductQuantity: (state) => (productId: number, variantId: number | null = null): number => {
      const item = state.items.find(item => isSameLine(item, productId, variantId));
      return item ? item.quantity : 0;
    },

    cartTotal(state): string {
      const totalCents = state.items.reduce((sum, item) => {
        const unitPriceCents = convertPriceToCents(getUnitPrice(item));
        return sum + Math.round(unitPriceCents * item.quantity);
      }, 0);

      return formatPrice(totalCents);
    },

    numberOfProducts(state): number {
      return state.items.length;
    },

    /** Items du panier au format attendu par l'API commande (variantId si la ligne porte un variant). */
    orderItems(state): OrderItem[] {
      return state.items.map(item => ({
        productId: item.product.id,
        ...(item.variant && { variantId: item.variant.id }),
        quantity: item.quantity,
      }));
    },

    isEmpty(state): boolean {
      return state.items.length === 0;
    },

    getMaxAllowed: (state) => (product: Product, variant: ProductVariant | null = null): number | null => {
      const baseStock = variant ? variant.stock : (product.stock ?? null);

      if (!state.isEditing) {
        return baseStock;
      }
      const item = state.items.find(i => isSameLine(i, product.id, variant?.id ?? null));

      if (item) {
        return item.maxAllowed ?? getLineStock(item);
      }
      return baseStock;
    },

  },


  actions: {
    loadCartFromStorage() {
      this.items = cartStorage.load()
    },

    saveCartToStorage() {
      cartStorage.save(this.items)
    },


    addToCart(
      product: Product,
      quantity: number,
      maxAllowed: number | null = null,
      variant: ProductVariant | null = null,
    ): boolean {
      if (quantity <= 0) return false;

      if (this.isProductInCart(product.id, variant?.id ?? null)) {
        return false;
      } else {
        this.items.push({ product, variant, quantity, maxAllowed });
        this.saveCartToStorage();
        return true;
      }
    },

    incrementQuantity(productId: number, variantId: number | null = null) {
      const item = this.items.find(i => isSameLine(i, productId, variantId));
      if (!item) return;

      const step = item.product.inter ?? 1;
      const newQuantity = +(item.quantity + step).toFixed(2);

      const limit = this.isEditing
        ? (item.maxAllowed ?? getLineStock(item))  // 👈 fallback IMPORTANT
        : getLineStock(item);

      if (limit !== null && newQuantity > limit) {
        return;
      }
      item.quantity = newQuantity;
      this.saveCartToStorage();
    },

    decrementQuantity(productId: number, variantId: number | null = null) {
      const item = this.items.find(i => isSameLine(i, productId, variantId));
      if (!item) return;

      const step = item.product.inter ?? 1;
      const newQuantity = +(item.quantity - step).toFixed(2);

      item.quantity = newQuantity >= 0 ? newQuantity : 0;

      if (item.quantity === 0) {
        this.removeFromCart(productId, variantId);
      }

      this.saveCartToStorage();
    },

    removeFromCart(productId: number, variantId: number | null = null) {
      this.items = this.items.filter(item => !isSameLine(item, productId, variantId));
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
        items: this.orderItems,
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
