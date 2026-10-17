import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { AxiosError } from 'axios'
import CartModal from '@/components/cart/CartModal.vue'
import { useCartStore } from '@/stores/cart-store'
import { useOrderStore } from '@/stores/order-store'
import { useUIStore } from '@/stores/ui-store'

vi.mock('@/services/order/order-cancel-service.ts', () => ({
  cancelOrder: vi.fn(),
}))

const pushMock = vi.fn()
const currentRoute = { value: { name: 'products' as string } }
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock, currentRoute }),
}))

import { cancelOrder } from '@/services/order/order-cancel-service.ts'

const cancelOrderMock = cancelOrder as unknown as ReturnType<typeof vi.fn>

function makeAxiosError(status: number, error: string) {
  const axiosError = new AxiosError('Request failed')
  ;(axiosError as unknown as { response: unknown }).response = {
    status,
    data: { error },
  }
  return axiosError
}

/** Panier en édition de la commande 42, tous les articles retirés. */
function factory() {
  return mount(CartModal, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            ui: { cartOpen: true },
            cart: { items: [], isEditing: true, currentOrderId: 42, editPickupDate: '2026-10-20' },
          },
        }),
      ],
      stubs: {
        ModalComponent: {
          props: ['modelValue'],
          template:
            '<div v-if="modelValue"><slot name="header" /><slot /><slot name="footer" /></div>',
        },
        RouterLink: { template: '<a><slot /></a>' },
      },
    },
  })
}

function findButton(wrapper: VueWrapper, text: string) {
  const button = wrapper.findAll('button').find((b) => b.text() === text)
  if (!button) throw new Error(`Bouton « ${text} » introuvable`)
  return button
}

async function cancelAndConfirm(wrapper: VueWrapper) {
  await findButton(wrapper, 'Annuler ma commande').trigger('click')
  await findButton(wrapper, 'Oui, annuler').trigger('click')
  await flushPromises()
}

describe('CartModal — annulation d’une commande en édition', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    currentRoute.value.name = 'products'
  })

  it('proposes to cancel the order instead of updating it when the cart is emptied', () => {
    const wrapper = factory()

    expect(wrapper.text()).toContain('Votre commande ne contient plus d\'article.')
    expect(findButton(wrapper, 'Annuler ma commande').exists()).toBe(true)
    expect(findButton(wrapper, 'Abandonner la modification').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Mettre à jour la commande')
  })

  it('asks for confirmation before calling the API', async () => {
    const wrapper = factory()

    await findButton(wrapper, 'Annuler ma commande').trigger('click')

    expect(wrapper.text()).toContain('Êtes-vous sûr de vouloir annuler votre commande n° 42 ?')
    expect(cancelOrderMock).not.toHaveBeenCalled()
  })

  it('does not cancel when the user keeps the order', async () => {
    const wrapper = factory()

    await findButton(wrapper, 'Annuler ma commande').trigger('click')
    await findButton(wrapper, 'Non, la garder').trigger('click')

    expect(cancelOrderMock).not.toHaveBeenCalled()
    expect(wrapper.text()).not.toContain('Êtes-vous sûr')
  })

  it('disables the cancel button while the request is pending', async () => {
    let resolveRequest!: () => void
    cancelOrderMock.mockReturnValue(new Promise<void>((resolve) => (resolveRequest = resolve)))
    const wrapper = factory()

    await findButton(wrapper, 'Annuler ma commande').trigger('click')
    await findButton(wrapper, 'Oui, annuler').trigger('click')

    const pendingButton = findButton(wrapper, 'Annulation…')
    expect(pendingButton.attributes('disabled')).toBeDefined()

    resolveRequest()
    await flushPromises()
  })

  it('on 204: leaves edit mode, sets a success notice and redirects to /orders', async () => {
    cancelOrderMock.mockResolvedValue({ status: 204, data: '' })
    const wrapper = factory()
    const cart = useCartStore()
    const orderStore = useOrderStore()
    const ui = useUIStore()

    await cancelAndConfirm(wrapper)

    expect(cancelOrderMock).toHaveBeenCalledWith(42)
    expect(cart.stopEditing).toHaveBeenCalled()
    expect(cart.clearCart).toHaveBeenCalled()
    expect(ui.closeCart).toHaveBeenCalled()
    expect(orderStore.setNotice).toHaveBeenCalledWith({
      type: 'success',
      text: 'Votre commande a bien été annulée.',
    })
    expect(pushMock).toHaveBeenCalledWith('/orders')
    expect(orderStore.loadOrders).not.toHaveBeenCalled()
  })

  it('on 204 while already on /orders: reloads the orders instead of navigating', async () => {
    currentRoute.value.name = 'order-history'
    cancelOrderMock.mockResolvedValue({ status: 204, data: '' })
    const wrapper = factory()
    const orderStore = useOrderStore()

    await cancelAndConfirm(wrapper)

    expect(orderStore.loadOrders).toHaveBeenCalled()
    expect(pushMock).not.toHaveBeenCalled()
  })

  it.each([
    [403, 'Cette commande n\'existe pas ou vous n\'êtes pas autorisé à la modifier.'],
    [409, 'Cette commande ne peut plus être annulée.'],
  ])('on %i: leaves edit mode and forwards the API error as a notice', async (status, message) => {
    cancelOrderMock.mockRejectedValue(makeAxiosError(status, message))
    const wrapper = factory()
    const cart = useCartStore()
    const orderStore = useOrderStore()

    await cancelAndConfirm(wrapper)

    expect(cart.stopEditing).toHaveBeenCalled()
    expect(cart.clearCart).toHaveBeenCalled()
    expect(orderStore.setNotice).toHaveBeenCalledWith({ type: 'error', text: message })
    expect(pushMock).toHaveBeenCalledWith('/orders')
  })

  it('on another error: stays in edit mode and shows the error in the cart', async () => {
    cancelOrderMock.mockRejectedValue(makeAxiosError(500, 'Erreur interne'))
    const wrapper = factory()
    const cart = useCartStore()
    const orderStore = useOrderStore()

    await cancelAndConfirm(wrapper)

    expect(wrapper.text()).toContain('Erreur interne')
    expect(cart.stopEditing).not.toHaveBeenCalled()
    expect(orderStore.setNotice).not.toHaveBeenCalled()
    expect(pushMock).not.toHaveBeenCalled()
    expect(findButton(wrapper, 'Annuler ma commande').attributes('disabled')).toBeUndefined()
  })
})
