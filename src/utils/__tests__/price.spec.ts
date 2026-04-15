import { describe, it, expect } from 'vitest'
import { convertPriceToCents, formatPrice, getItemTotal } from '@/utils/price'
import type { CartItem } from '@/models/cart/cart-item'

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
})
