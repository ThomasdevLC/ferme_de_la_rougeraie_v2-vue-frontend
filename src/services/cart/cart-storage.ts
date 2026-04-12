import type { CartItem } from '@/models/cart/cart-item'
import { CART_KEY } from '@/constants/storageKeys'

export const cartStorage = {
  load(): CartItem[] {
    const stored = localStorage.getItem(CART_KEY)
    return stored ? JSON.parse(stored) : []
  },
  save(items: CartItem[]): void {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  },
}
