import { describe, it, expect } from 'vitest'
import { convertPriceToCents, formatPrice, getItemTotal, getUnitPrice } from '@/utils/price'
import type { CartItem } from '@/models/cart/cart-item'
import type { ProductVariant } from '@/models/product/product'

describe('convertPriceToCents', () => {
  it('converts an integer euro price to cents', () => {
    expect(convertPriceToCents(5)).toBe(500)
  })

  it('converts a decimal euro price to cents', () => {
    expect(convertPriceToCents(2.5)).toBe(250)
    expect(convertPriceToCents(2.99)).toBe(299)
  })

  it('rounds to 2 decimals before converting', () => {
    expect(convertPriceToCents(1.239)).toBe(124)
    expect(convertPriceToCents(1.234)).toBe(123)
  })

  it('handles zero', () => {
    expect(convertPriceToCents(0)).toBe(0)
  })
})

describe('formatPrice', () => {
  it('formats cents as a French euro string', () => {
    expect(formatPrice(500)).toMatch(/5,00\s?€/)
  })

  it('formats zero correctly', () => {
    expect(formatPrice(0)).toMatch(/0,00\s?€/)
  })

  it('formats a non-round amount', () => {
    expect(formatPrice(299)).toMatch(/2,99\s?€/)
  })
})

describe('getItemTotal', () => {
  const makeItem = (price: number, quantity: number): CartItem => ({
    product: { id: 1, price } as CartItem['product'],
    variant: null,
    quantity,
    maxAllowed: null,
  })

  it('computes unit price × quantity for an integer quantity', () => {
    expect(getItemTotal(makeItem(2.5, 3))).toMatch(/7,50\s?€/)
  })

  it('computes total for a decimal quantity (weight-based product)', () => {
    expect(getItemTotal(makeItem(10, 0.5))).toMatch(/5,00\s?€/)
  })

  it('returns 0 € for a zero quantity', () => {
    expect(getItemTotal(makeItem(5, 0))).toMatch(/0,00\s?€/)
  })

  it('uses the variant price when the line carries a variant', () => {
    const variant: ProductVariant = { id: 2, label: 'Gros', price: 1.8, stock: 20 }
    const item = {
      product: { id: 50, price: null } as CartItem['product'],
      variant,
      quantity: 2,
      maxAllowed: null,
    }
    expect(getItemTotal(item)).toMatch(/3,60\s?€/)
  })
})

describe('getUnitPrice', () => {
  it('returns the variant price when present', () => {
    const item = {
      product: { id: 50, price: null } as CartItem['product'],
      variant: { id: 2, label: 'Gros', price: 1.8, stock: 20 } as ProductVariant,
      quantity: 1,
      maxAllowed: null,
    }
    expect(getUnitPrice(item)).toBe(1.8)
  })

  it('falls back to the product price for a simple product', () => {
    const item: CartItem = {
      product: { id: 1, price: 2.5 } as CartItem['product'],
      variant: null,
      quantity: 1,
      maxAllowed: null,
    }
    expect(getUnitPrice(item)).toBe(2.5)
  })

  it('returns 0 when both prices are null', () => {
    const item: CartItem = {
      product: { id: 1, price: null } as CartItem['product'],
      variant: null,
      quantity: 1,
      maxAllowed: null,
    }
    expect(getUnitPrice(item)).toBe(0)
  })
})
