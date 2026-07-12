import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ProductView from '@/views/ProductView.vue'
import type { Product, ProductCategory } from '@/models/product/product'

vi.mock('@/services/product/product-service.ts', () => ({
  fetchProducts: vi.fn(),
}))

import { fetchProducts } from '@/services/product/product-service.ts'

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

const catalogue = [
  makeProduct({ id: 1, name: 'Carotte', category: VEGETABLE }),
  makeProduct({ id: 2, name: 'Courgette', category: VEGETABLE }),
  makeProduct({ id: 3, name: 'Pomme', category: FRUIT }),
  makeProduct({ id: 4, name: 'Promo', category: null }),
]

async function factory(products: Product[] = catalogue) {
  vi.mocked(fetchProducts).mockResolvedValue({ data: products } as never)

  const wrapper = mount(ProductView, {
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })],
      stubs: {
        ProductCard: {
          name: 'ProductCard',
          props: ['product'],
          template: '<div class="product-card-stub">{{ product.name }}</div>',
        },
        Shell: true,
      },
    },
  })

  await flushPromises()
  vi.runAllTimers() // clears the 1s loading timer
  await flushPromises()
  return wrapper
}

const cardNames = (wrapper: Awaited<ReturnType<typeof factory>>) =>
  wrapper.findAll('.product-card-stub').map((c) => c.text())

describe('ProductView', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('renders one chip per present category, in backend order', async () => {
    const wrapper = await factory()
    const chips = wrapper.findAll('button[aria-pressed]')
    expect(chips.map((c) => c.text())).toEqual(['Légumes', 'Fruits'])
  })

  it('shows all products (including uncategorised) when no chip is selected', async () => {
    const wrapper = await factory()
    expect(cardNames(wrapper)).toEqual(['Carotte', 'Courgette', 'Pomme', 'Promo'])
  })

  it('filters the grid to the selected category on chip click', async () => {
    const wrapper = await factory()
    await wrapper.findAll('button[aria-pressed]')[0].trigger('click') // Légumes
    expect(cardNames(wrapper)).toEqual(['Carotte', 'Courgette'])
  })

  it('unions categories when several chips are selected', async () => {
    const wrapper = await factory()
    const chips = wrapper.findAll('button[aria-pressed]')
    await chips[0].trigger('click') // Légumes
    await chips[1].trigger('click') // Fruits
    expect(cardNames(wrapper)).toEqual(['Carotte', 'Courgette', 'Pomme'])
  })

  it('deselects a chip on second click, returning to all products', async () => {
    const wrapper = await factory()
    const chip = wrapper.findAll('button[aria-pressed]')[0]
    await chip.trigger('click')
    await chip.trigger('click')
    expect(chip.attributes('aria-pressed')).toBe('false')
    expect(cardNames(wrapper)).toEqual(['Carotte', 'Courgette', 'Pomme', 'Promo'])
  })

  it('renders no chip bar when no product has a category', async () => {
    const wrapper = await factory([makeProduct({ id: 1, category: null })])
    expect(wrapper.findAll('button[aria-pressed]')).toHaveLength(0)
  })
})
