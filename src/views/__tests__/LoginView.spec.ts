import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { AxiosError } from 'axios'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/auth-store'
import { useUserStore } from '@/stores/user-store'
import { useCartStore } from '@/stores/cart-store'
import { useUIStore } from '@/stores/ui-store'

vi.mock('@/services/auth/auth-service', () => ({
  login: vi.fn(),
}))

const pushMock = vi.fn()
const replaceMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
  useRoute: () => ({ path: '/login', query: {} }),
}))

import { login } from '@/services/auth/auth-service'

function factory(options: { cartIsEmpty?: boolean } = {}) {
  const { cartIsEmpty = true } = options

  const wrapper = mount(LoginView, {
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })],
      stubs: {
        ModalComponent: { template: '<div><slot /></div>' },
        CircleCheckBig: true,
        Eye: true,
        EyeOff: true,
        Loader: true,
      },
    },
  })

  const cart = useCartStore()
  Object.defineProperty(cart, 'isEmpty', { get: () => cartIsEmpty })

  return wrapper
}

describe('LoginView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders email, password fields and the submit button', () => {
    const wrapper = factory()
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input#password').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').text()).toContain('Se connecter')
  })

  it('calls login, sets the token, loads profile and redirects to /products', async () => {
    ;(login as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { token: 'my-token' },
    })

    const wrapper = factory()
    const auth = useAuthStore()
    const user = useUserStore()

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input#password').setValue('secret')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'secret' })
    expect(auth.setToken).toHaveBeenCalledWith('my-token')
    expect(user.loadProfile).toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledWith('/products')
  })

  it('opens the cart after login when the cart is not empty', async () => {
    ;(login as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { token: 'my-token' },
    })

    const wrapper = factory({ cartIsEmpty: false })
    const ui = useUIStore()

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input#password').setValue('secret')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(ui.openCart).toHaveBeenCalled()
  })

  it('does not open the cart after login when the cart is empty', async () => {
    ;(login as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { token: 'my-token' },
    })

    const wrapper = factory({ cartIsEmpty: true })
    const ui = useUIStore()

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input#password').setValue('secret')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(ui.openCart).not.toHaveBeenCalled()
  })

  it('shows the server error message when login fails with AxiosError', async () => {
    const axiosError = new AxiosError('Request failed')
    ;(axiosError as unknown as { response: unknown }).response = {
      data: { message: 'Identifiants invalides' },
    }
    ;(login as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(axiosError)

    const wrapper = factory()

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input#password').setValue('wrong')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Identifiants invalides')
  })

  it('shows a default error message when login fails with a non-Axios error', async () => {
    ;(login as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('boom'))

    const wrapper = factory()

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input#password').setValue('secret')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Échec de la connexion.')
  })

  it('toggles password visibility when the eye button is clicked', async () => {
    const wrapper = factory()
    const passwordInput = wrapper.find('input#password')
    expect(passwordInput.attributes('type')).toBe('password')

    const toggle = wrapper.find('button[type="button"]')
    await toggle.trigger('click')
    expect(passwordInput.attributes('type')).toBe('text')

    await toggle.trigger('click')
    expect(passwordInput.attributes('type')).toBe('password')
  })
})
