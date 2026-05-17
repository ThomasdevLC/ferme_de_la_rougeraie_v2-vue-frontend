import type { CartItem } from '@/models/cart/cart-item'
import { CART_KEY } from '@/constants/storageKeys'

const CART_EXPIRATION_MS = 2 * 60 * 60 * 1000

interface StoredCart {
  savedAt: number
  items: CartItem[]
}

function isStoredCart(value: unknown): value is StoredCart {
  return (
    typeof value === 'object' &&
    value !== null &&
    'savedAt' in value &&
    'items' in value &&
    typeof value.savedAt === 'number' &&
    Array.isArray(value.items)
  )
}

export const cartStorage = {
  load(): CartItem[] {
    const stored = localStorage.getItem(CART_KEY)
    if (!stored) return []

    const parsed = JSON.parse(stored)

    if (Array.isArray(parsed)) {
      return parsed
    }

    if (!isStoredCart(parsed)) {
      localStorage.removeItem(CART_KEY)
      return []
    }

    if (Date.now() - parsed.savedAt > CART_EXPIRATION_MS) {
      localStorage.removeItem(CART_KEY)
      return []
    }

    return parsed.items
  },
  save(items: CartItem[]): void {
    localStorage.setItem(CART_KEY, JSON.stringify({
      savedAt: Date.now(),
      items,
    }))
  },
}
