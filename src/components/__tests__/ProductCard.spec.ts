import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ProductCard from '@/components/product/ProductCard.vue'
import type { Product } from '@/models/product/product'

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  name: 'Pomme',
  price: 2.5,
  unit: 'kg',
  inter: 1,
  image: 'pomme.jpg',
  stock: 10,
  limited: false,
  discount: false,
  discountText: null,
  ...overrides,
})

function factory(product: Product) {
  return mount(ProductCard, {
    props: { product },
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })],
      stubs: {
        ProductQuantity: {
          name: 'ProductQuantity',
          props: ['product'],
          template: '<div class="product-quantity-stub" />',
        },
      },
    },
  })
}

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders product name, formatted price and unit', () => {
    const wrapper = factory(makeProduct({ name: 'Pomme', price: 2.5, unit: 'kg' }))
    expect(wrapper.text()).toContain('Pomme')
    expect(wrapper.text()).toContain('2.50 €')
    expect(wrapper.text()).toContain('kg')
  })

  it('shows "Quantité limitée" badge when product.limited is true', () => {
    const wrapper = factory(makeProduct({ limited: true }))
    expect(wrapper.text()).toContain('Quantité limitée')
  })

  it('does not show the badge when product.limited is false', () => {
    const wrapper = factory(makeProduct({ limited: false }))
    expect(wrapper.text()).not.toContain('Quantité limitée')
  })

  it('shows the promo image when product.discount is true', () => {
    const wrapper = factory(makeProduct({ discount: true }))
    const promo = wrapper.find('img[alt="Promotion"]')
    expect(promo.exists()).toBe(true)
  })

  it('does not show the promo image when product.discount is false', () => {
    const wrapper = factory(makeProduct({ discount: false }))
    expect(wrapper.find('img[alt="Promotion"]').exists()).toBe(false)
  })

  it('renders the quantity control', () => {
    const wrapper = factory(makeProduct())
    expect(wrapper.find('.product-quantity-stub').exists()).toBe(true)
  })

  it('does not render the "AJOUTER AU PANIER" call to action anymore', () => {
    const wrapper = factory(makeProduct())
    expect(wrapper.text()).not.toContain('AJOUTER AU PANIER')
    expect(wrapper.text()).not.toContain('AJOUTÉ')
  })
})
