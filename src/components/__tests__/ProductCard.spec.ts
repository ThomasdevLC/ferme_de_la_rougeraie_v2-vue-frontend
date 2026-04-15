import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ProductCard from '@/components/product/ProductCard.vue'
import { useCartStore } from '@/stores/cart-store'
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
          props: ['modelValue', 'product'],
          emits: ['update:modelValue'],
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

  afterEach(() => {
    vi.useRealTimers()
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

  it('does not call cart.addToCart when quantity is 0', async () => {
    const wrapper = factory(makeProduct())
    const cart = useCartStore()
    await wrapper.find('p.font-medium.cursor-pointer').trigger('click')
    expect(cart.addToCart).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('AJOUTER AU PANIER')
  })

  it('calls cart.addToCart and shows "AJOUTÉ" when quantity > 0', async () => {
    const wrapper = factory(makeProduct({ id: 1 }))
    const cart = useCartStore()

    wrapper.findComponent({ name: 'ProductQuantity' }).vm.$emit('update:modelValue', 3)
    await wrapper.vm.$nextTick()

    await wrapper.find('p.font-medium.cursor-pointer').trigger('click')

    expect(cart.addToCart).toHaveBeenCalledTimes(1)
    expect(cart.addToCart).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 }),
      3,
    )
    expect(wrapper.text()).toContain('AJOUTÉ')
  })

  it('resets "AJOUTÉ" back to "AJOUTER AU PANIER" after 1500ms', async () => {
    vi.useFakeTimers()
    const wrapper = factory(makeProduct())

    wrapper.findComponent({ name: 'ProductQuantity' }).vm.$emit('update:modelValue', 1)
    await wrapper.vm.$nextTick()

    await wrapper.find('p.font-medium.cursor-pointer').trigger('click')
    expect(wrapper.text()).toContain('AJOUTÉ')

    vi.advanceTimersByTime(1500)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('AJOUTER AU PANIER')
  })
})
