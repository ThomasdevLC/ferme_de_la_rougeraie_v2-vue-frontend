import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import CartItem from '@/components/cart/CartItem.vue'
import { useCartStore } from '@/stores/cart-store'
import type { Product } from '@/models/product/product'
import type { CartItem as CartItemModel } from '@/models/cart/cart-item'

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

const makeItem = (overrides: Partial<CartItemModel> = {}): CartItemModel => ({
  product: makeProduct(),
  quantity: 2,
  maxAllowed: null,
  ...overrides,
})

function factory(item: CartItemModel) {
  return mount(CartItem, {
    props: { item },
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })],
      stubs: {
        CartQuantity: {
          name: 'CartQuantity',
          props: ['product', 'quantity'],
          template: '<div class="cart-quantity-stub" />',
        },
        X: { template: '<svg class="x-icon-stub" />' },
      },
    },
  })
}

describe('CartItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the product name', () => {
    const wrapper = factory(makeItem({ product: makeProduct({ name: 'Pomme' }) }))
    expect(wrapper.text()).toContain('Pomme')
  })

  it('renders the formatted unit price and unit', () => {
    const wrapper = factory(makeItem({ product: makeProduct({ price: 2.5, unit: 'kg' }) }))
    expect(wrapper.text()).toContain('2.50 €')
    expect(wrapper.text()).toContain('kg')
  })

  it('renders the line total (price × quantity)', () => {
    const wrapper = factory(makeItem({ product: makeProduct({ price: 2.5 }), quantity: 2 }))
    expect(wrapper.text()).toMatch(/5,00\s?€/)
  })

  it('calls cart.removeFromCart with the product id when the X button is clicked', async () => {
    const wrapper = factory(makeItem({ product: makeProduct({ id: 42 }) }))
    const cart = useCartStore()
    await wrapper.find('button').trigger('click')
    expect(cart.removeFromCart).toHaveBeenCalledWith(42)
  })

  it('passes product and quantity to the CartQuantity child', () => {
    const product = makeProduct({ id: 7 })
    const wrapper = factory(makeItem({ product, quantity: 3 }))
    const child = wrapper.findComponent({ name: 'CartQuantity' })
    expect(child.props('product')).toMatchObject({ id: 7 })
    expect(child.props('quantity')).toBe(3)
  })
})
