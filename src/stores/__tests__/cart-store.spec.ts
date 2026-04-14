import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '@/stores/cart-store'
import type { Product } from '@/models/product/product'

vi.mock('@/services/order/order-service', () => ({
  createOrder: vi.fn(async () => ({ id: 99 })),
}))

import { createOrder } from '@/services/order/order-service'

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  name: 'Pomme',
  price: 2.5,
  unit: 'kg',
  inter: 1,
  image: '',
  stock: 10,
  limited: false,
  discount: false,
  discountText: null,
  ...overrides,
})

describe('cart-store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('addToCart', () => {
    it('adds a new product to the cart', () => {
      const cart = useCartStore()
      const added = cart.addToCart(makeProduct(), 2)
      expect(added).toBe(true)
      expect(cart.items).toHaveLength(1)
      expect(cart.items[0].quantity).toBe(2)
    })

    it('does not add a product already in the cart', () => {
      const cart = useCartStore()
      const product = makeProduct()
      cart.addToCart(product, 1)
      const added = cart.addToCart(product, 3)
      expect(added).toBe(false)
      expect(cart.items).toHaveLength(1)
    })

    it('refuses a non-positive quantity', () => {
      const cart = useCartStore()
      expect(cart.addToCart(makeProduct(), 0)).toBe(false)
      expect(cart.addToCart(makeProduct(), -1)).toBe(false)
      expect(cart.items).toHaveLength(0)
    })
  })

  describe('getters', () => {
    it('isProductInCart detects presence', () => {
      const cart = useCartStore()
      cart.addToCart(makeProduct({ id: 1 }), 1)
      expect(cart.isProductInCart(1)).toBe(true)
      expect(cart.isProductInCart(2)).toBe(false)
    })

    it('getProductQuantity returns quantity or 0', () => {
      const cart = useCartStore()
      cart.addToCart(makeProduct({ id: 1 }), 3)
      expect(cart.getProductQuantity(1)).toBe(3)
      expect(cart.getProductQuantity(999)).toBe(0)
    })

    it('numberOfProducts counts distinct items', () => {
      const cart = useCartStore()
      cart.addToCart(makeProduct({ id: 1 }), 1)
      cart.addToCart(makeProduct({ id: 2 }), 5)
      expect(cart.numberOfProducts).toBe(2)
    })

    it('isEmpty reflects cart state', () => {
      const cart = useCartStore()
      expect(cart.isEmpty).toBe(true)
      cart.addToCart(makeProduct(), 1)
      expect(cart.isEmpty).toBe(false)
    })

    it('cartTotal sums unit price × quantity across items', () => {
      const cart = useCartStore()
      cart.addToCart(makeProduct({ id: 1, price: 2.5 }), 2)
      cart.addToCart(makeProduct({ id: 2, price: 3 }), 1)
      expect(cart.cartTotal).toMatch(/8,00\s?€/)
    })
  })

  describe('incrementQuantity', () => {
    it('increments by product.inter step', () => {
      const cart = useCartStore()
      cart.addToCart(makeProduct({ id: 1, inter: 0.5, stock: 10 }), 1)
      cart.incrementQuantity(1)
      expect(cart.items[0].quantity).toBe(1.5)
    })

    it('does not exceed product stock when not editing', () => {
      const cart = useCartStore()
      cart.addToCart(makeProduct({ id: 1, inter: 1, stock: 2 }), 2)
      cart.incrementQuantity(1)
      expect(cart.items[0].quantity).toBe(2)
    })
  })

  describe('decrementQuantity', () => {
    it('decrements by product.inter step', () => {
      const cart = useCartStore()
      cart.addToCart(makeProduct({ id: 1, inter: 1 }), 3)
      cart.decrementQuantity(1)
      expect(cart.items[0].quantity).toBe(2)
    })

    it('removes the item when quantity reaches 0', () => {
      const cart = useCartStore()
      cart.addToCart(makeProduct({ id: 1, inter: 1 }), 1)
      cart.decrementQuantity(1)
      expect(cart.items).toHaveLength(0)
    })
  })

  describe('removeFromCart / clearCart', () => {
    it('removeFromCart removes a specific product', () => {
      const cart = useCartStore()
      cart.addToCart(makeProduct({ id: 1 }), 1)
      cart.addToCart(makeProduct({ id: 2 }), 1)
      cart.removeFromCart(1)
      expect(cart.items).toHaveLength(1)
      expect(cart.items[0].product.id).toBe(2)
    })

    it('clearCart empties the cart', () => {
      const cart = useCartStore()
      cart.addToCart(makeProduct({ id: 1 }), 1)
      cart.addToCart(makeProduct({ id: 2 }), 1)
      cart.clearCart()
      expect(cart.items).toEqual([])
    })
  })

  describe('editing mode', () => {
    it('startEditing sets editing state', () => {
      const cart = useCartStore()
      cart.startEditing(42, '2026-05-01')
      expect(cart.isEditing).toBe(true)
      expect(cart.currentOrderId).toBe(42)
      expect(cart.editPickupDate).toBe('2026-05-01')
    })

    it('stopEditing clears editing state', () => {
      const cart = useCartStore()
      cart.startEditing(42, '2026-05-01')
      cart.stopEditing()
      expect(cart.isEditing).toBe(false)
      expect(cart.currentOrderId).toBeNull()
      expect(cart.editPickupDate).toBe('')
    })

    it('getMaxAllowed returns product.stock when not editing', () => {
      const cart = useCartStore()
      const product = makeProduct({ id: 1, stock: 10 })
      expect(cart.getMaxAllowed(product)).toBe(10)
    })

    it('getMaxAllowed returns item.maxAllowed when editing', () => {
      const cart = useCartStore()
      cart.addToCart(makeProduct({ id: 1, stock: 10 }), 1, 15)
      cart.startEditing(1, '2026-05-01')
      expect(cart.getMaxAllowed(makeProduct({ id: 1, stock: 10 }))).toBe(15)
    })
  })

  describe('submitOrder', () => {
    it('throws when pickupDate is missing', async () => {
      const cart = useCartStore()
      cart.addToCart(makeProduct(), 1)
      await expect(cart.submitOrder('')).rejects.toThrow('Date de retrait manquante')
    })

    it('calls createOrder with the cart payload and clears the cart', async () => {
      const cart = useCartStore()
      cart.addToCart(makeProduct({ id: 1 }), 2)
      cart.addToCart(makeProduct({ id: 2 }), 1)

      const response = await cart.submitOrder('2026-05-01')

      expect(createOrder).toHaveBeenCalledWith({
        pickupDate: '2026-05-01',
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
      })
      expect(response).toEqual({ id: 99 })
      expect(cart.items).toEqual([])
    })
  })

  describe('storage sync', () => {
    it('loadCartFromStorage reads items from cartStorage', () => {
      localStorage.setItem(
        'cart',
        JSON.stringify([{ product: makeProduct({ id: 7 }), quantity: 4, maxAllowed: null }]),
      )
      const cart = useCartStore()
      cart.loadCartFromStorage()
      expect(cart.items).toHaveLength(1)
      expect(cart.items[0].product.id).toBe(7)
    })

    it('addToCart persists items to localStorage', () => {
      const cart = useCartStore()
      cart.addToCart(makeProduct({ id: 1 }), 2)
      const stored = JSON.parse(localStorage.getItem('cart')!)
      expect(stored).toHaveLength(1)
      expect(stored[0].product.id).toBe(1)
    })
  })
})
