import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductQuantity from '@/components/product/ProductQuantity.vue'
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

function factory(product: Product, pinia = createPinia()) {
  return mount(ProductQuantity, {
    props: { product },
    global: {
      plugins: [pinia],
    },
  })
}

describe('ProductQuantity', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('adds the product to the cart on the first increment', async () => {
    const cart = useCartStore()
    const addToCartSpy = vi.spyOn(cart, 'addToCart')
    const incrementSpy = vi.spyOn(cart, 'incrementQuantity')
    const wrapper = factory(makeProduct({ id: 1, inter: 0.5 }), pinia)

    await wrapper.findAll('button')[1].trigger('click')

    expect(addToCartSpy).toHaveBeenCalledTimes(1)
    expect(addToCartSpy).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 }),
      0.5,
    )
    expect(incrementSpy).not.toHaveBeenCalled()
  })

  it('increments an existing cart line when the product is already in the cart', async () => {
    const cart = useCartStore()
    const product = makeProduct({ id: 3 })
    cart.addToCart(product, 2)
    const addToCartSpy = vi.spyOn(cart, 'addToCart')
    const incrementSpy = vi.spyOn(cart, 'incrementQuantity')
    const wrapper = factory(product, pinia)

    await wrapper.findAll('button')[1].trigger('click')

    expect(incrementSpy).toHaveBeenCalledWith(3)
    expect(addToCartSpy).not.toHaveBeenCalled()
  })
})
