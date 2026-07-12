import { describe, it, expect } from 'vitest'
import { deriveCategories } from '@/utils/product-category'
import type { Product, ProductCategory } from '@/models/product/product'

const VEGETABLE: ProductCategory = { key: 'VEGETABLE', label: 'Légumes' }
const FRUIT: ProductCategory = { key: 'FRUIT', label: 'Fruits' }

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  name: 'Pomme',
  price: 2.5,
  unit: 'kg',
  inter: 1,
  image: '',
  hasStock: true,
  stock: 10,
  limited: false,
  discount: false,
  discountText: null,
  hasVariants: false,
  variants: [],
  category: null,
  ...overrides,
})

describe('deriveCategories', () => {
  it('returns categories in order of appearance (backend order)', () => {
    const products = [
      makeProduct({ id: 1, category: VEGETABLE }),
      makeProduct({ id: 2, category: FRUIT }),
    ]
    expect(deriveCategories(products)).toEqual([VEGETABLE, FRUIT])
  })

  it('deduplicates a category that appears on several products', () => {
    const products = [
      makeProduct({ id: 1, category: VEGETABLE }),
      makeProduct({ id: 2, category: VEGETABLE }),
      makeProduct({ id: 3, category: FRUIT }),
    ]
    expect(deriveCategories(products)).toEqual([VEGETABLE, FRUIT])
  })

  it('ignores products without a category', () => {
    const products = [
      makeProduct({ id: 1, category: VEGETABLE }),
      makeProduct({ id: 2, category: null }),
    ]
    expect(deriveCategories(products)).toEqual([VEGETABLE])
  })

  it('returns an empty array for an empty catalogue', () => {
    expect(deriveCategories([])).toEqual([])
  })

  it('returns an empty array when no product has a category', () => {
    const products = [makeProduct({ id: 1 }), makeProduct({ id: 2 })]
    expect(deriveCategories(products)).toEqual([])
  })
})
