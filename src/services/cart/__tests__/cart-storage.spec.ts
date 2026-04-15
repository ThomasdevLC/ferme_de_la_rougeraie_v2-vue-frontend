import { describe, it, expect, beforeEach } from 'vitest'
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
  })

  describe('load', () => {
    it('returns an empty array when storage is empty', () => {
      expect(cartStorage.load()).toEqual([])
    })

    it('returns the parsed items when storage contains a cart', () => {
      const items = [makeItem(1, 2), makeItem(2, 3)]
      localStorage.setItem(CART_KEY, JSON.stringify(items))
      expect(cartStorage.load()).toEqual(items)
    })
  })

  describe('save', () => {
    it('writes the items to localStorage under CART_KEY', () => {
      const items = [makeItem(42, 5)]
      cartStorage.save(items)
      expect(JSON.parse(localStorage.getItem(CART_KEY)!)).toEqual(items)
    })

    it('overwrites previous cart content', () => {
      cartStorage.save([makeItem(1)])
      cartStorage.save([makeItem(2)])
      expect(cartStorage.load()).toEqual([makeItem(2)])
    })

    it('persists an empty array', () => {
      cartStorage.save([])
      expect(localStorage.getItem(CART_KEY)).toBe('[]')
    })
  })
})
