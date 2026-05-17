import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { cartStorage } from '@/services/cart/cart-storage'
import { CART_KEY } from '@/constants/storageKeys'
import type { CartItem } from '@/models/cart/cart-item'

const makeItem = (id: number, quantity = 1): CartItem => ({
  product: { id, price: 2.5 } as CartItem['product'],
  quantity,
  maxAllowed: null,
})

describe('cartStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useRealTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('load', () => {
    it('returns an empty array when storage is empty', () => {
      expect(cartStorage.load()).toEqual([])
    })

    it('returns the parsed items when storage contains a cart', () => {
      const items = [makeItem(1, 2), makeItem(2, 3)]
      localStorage.setItem(CART_KEY, JSON.stringify({
        savedAt: Date.now(),
        items,
      }))
      expect(cartStorage.load()).toEqual(items)
    })

    it('keeps compatibility with legacy cart arrays', () => {
      const items = [makeItem(1, 2)]
      localStorage.setItem(CART_KEY, JSON.stringify(items))
      expect(cartStorage.load()).toEqual(items)
    })

    it('removes the cart when it is older than 2 hours', () => {
      const items = [makeItem(1, 2)]
      localStorage.setItem(CART_KEY, JSON.stringify({
        savedAt: Date.now() - (2 * 60 * 60 * 1000) - 1,
        items,
      }))

      expect(cartStorage.load()).toEqual([])
      expect(localStorage.getItem(CART_KEY)).toBeNull()
    })
  })

  describe('save', () => {
    it('writes the items to localStorage under CART_KEY', () => {
      vi.setSystemTime(new Date('2026-05-17T10:00:00.000Z'))
      const items = [makeItem(42, 5)]
      cartStorage.save(items)
      expect(JSON.parse(localStorage.getItem(CART_KEY)!)).toEqual({
        savedAt: Date.now(),
        items,
      })
    })

    it('overwrites previous cart content', () => {
      cartStorage.save([makeItem(1)])
      cartStorage.save([makeItem(2)])
      expect(cartStorage.load()).toEqual([makeItem(2)])
    })

    it('persists an empty array', () => {
      cartStorage.save([])
      expect(JSON.parse(localStorage.getItem(CART_KEY)!)).toEqual({
        savedAt: Date.now(),
        items: [],
      })
    })
  })
})
