import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import CartItem from '@/components/cart/CartItem.vue'
import { useCartStore } from '@/stores/cart-store'
import type { Product, ProductVariant } from '@/models/product/product'
import type { CartItem as CartItemModel } from '@/models/cart/cart-item'

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  name: 'Pomme',
  price: 2.5,
  unit: 'kg',
  inter: 1,
  image: 'pomme.jpg',
  hasStock: true,
  stock: 10,
  limited: false,
  discount: false,
  discountText: null,
  hasVariants: false,
  variants: [],
  category: null,
  isBasket: false,
  basketItems: [],
  ...overrides,
})

const makeItem = (overrides: Partial<CartItemModel> = {}): CartItemModel => ({
  product: makeProduct(),
  variant: null,
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
          props: ['product', 'variant', 'quantity'],
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
    expect(cart.removeFromCart).toHaveBeenCalledWith(42, null)
  })

  it('passes product and quantity to the CartQuantity child', () => {
    const product = makeProduct({ id: 7 })
    const wrapper = factory(makeItem({ product, quantity: 3 }))
    const child = wrapper.findComponent({ name: 'CartQuantity' })
    expect(child.props('product')).toMatchObject({ id: 7 })
    expect(child.props('quantity')).toBe(3)
  })

  describe('variants', () => {
    const bigVariant: ProductVariant = { id: 2, label: 'Gros', price: 1.8, stock: 20 }

    it('appends the variant label to the product name', () => {
      const wrapper = factory(
        makeItem({ product: makeProduct({ name: 'Concombres', price: null }), variant: bigVariant }),
      )
      expect(wrapper.text()).toContain('Concombres — Gros')
    })

    it('renders the variant unit price and computes the line total from it', () => {
      const wrapper = factory(
        makeItem({
          product: makeProduct({ price: null }),
          variant: bigVariant,
          quantity: 2,
        }),
      )
      expect(wrapper.text()).toContain('1.80 €')
      expect(wrapper.text()).toMatch(/3,60\s?€/)
    })

    it('removes the correct variant line on click', async () => {
      const wrapper = factory(
        makeItem({ product: makeProduct({ id: 50, price: null }), variant: bigVariant }),
      )
      const cart = useCartStore()
      await wrapper.find('button').trigger('click')
      expect(cart.removeFromCart).toHaveBeenCalledWith(50, 2)
    })

    it('passes the variant to the CartQuantity child', () => {
      const wrapper = factory(makeItem({ product: makeProduct({ price: null }), variant: bigVariant }))
      const child = wrapper.findComponent({ name: 'CartQuantity' })
      expect(child.props('variant')).toMatchObject({ id: 2, label: 'Gros' })
    })
  })
})
