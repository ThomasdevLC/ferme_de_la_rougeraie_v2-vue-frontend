import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ProductCard from '@/components/product/ProductCard.vue'
import type { Product, ProductVariant } from '@/models/product/product'

const makeVariantProduct = (overrides: Partial<Product> = {}): Product =>
  makeProduct({
    id: 50,
    name: 'Concombres',
    price: null,
    unit: 'Pièce',
    hasStock: false,
    stock: null,
    hasVariants: true,
    variants: [
      { id: 1, label: 'Petit', price: 1.2, stock: 10 },
      { id: 2, label: 'Gros', price: 1.8, stock: 20 },
    ] as ProductVariant[],
    ...overrides,
  })

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
          props: ['product', 'variant'],
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
    expect(wrapper.text()).toContain('2.50')
    expect(wrapper.text()).toContain('€')
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

  describe('variants', () => {
    it('does not render a variant selector for a simple product', () => {
      const wrapper = factory(makeProduct())
      expect(wrapper.find('select').exists()).toBe(false)
    })

    it('renders a selector with all variant labels in order', () => {
      const wrapper = factory(makeVariantProduct())
      const options = wrapper.findAll('option')
      expect(options).toHaveLength(2)
      expect(options[0].text()).toBe('Petit')
      expect(options[1].text()).toBe('Gros')
    })

    it('preselects the first variant and shows its price', () => {
      const wrapper = factory(makeVariantProduct())
      const select = wrapper.find('select').element as HTMLSelectElement
      expect(select.value).toBe('1')
      expect(wrapper.text()).toContain('1.20')
    })

    it('updates the displayed price when another variant is selected', async () => {
      const wrapper = factory(makeVariantProduct())
      await wrapper.find('select').setValue('2')
      expect(wrapper.text()).toContain('1.80')
      expect(wrapper.text()).not.toContain('1.20')
    })

    it('passes the selected variant to ProductQuantity', async () => {
      const wrapper = factory(makeVariantProduct())
      const stub = wrapper.findComponent({ name: 'ProductQuantity' })
      expect(stub.props('variant')).toMatchObject({ id: 1, label: 'Petit' })
      await wrapper.find('select').setValue('2')
      expect(stub.props('variant')).toMatchObject({ id: 2, label: 'Gros' })
    })
  })
})
