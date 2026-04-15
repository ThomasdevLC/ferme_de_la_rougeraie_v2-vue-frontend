import { test, expect, type Page } from '@playwright/test'

const fakeProduct = {
  id: 1,
  name: 'Pomme Gala',
  price: 2.5,
  unit: 'kg',
  inter: 1,
  image: '/placeholder.png',
  stock: 10,
  limited: false,
  discount: false,
  discountText: null,
}

const fakeProfile = {
  id: 1,
  email: 'test@example.com',
  firstName: 'Thomas',
  lastName: 'Test',
  phone: '',
}

async function mockBackend(page: Page) {
  await page.route('**/api/login_check', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'fake-jwt-token' }) }),
  )
  await page.route('**/api/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fakeProfile) }),
  )
  await page.route('**/api/messages', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
  )
  await page.route('**/api/products', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([fakeProduct]) }),
  )
}

async function login(page: Page) {
  await page.goto('/login')
  await page.locator('input#email').fill('test@example.com')
  await page.locator('input#password').fill('secret')
  await page.getByRole('button', { name: 'Se connecter' }).click()
  await expect(page).toHaveURL(/\/products/)
}

test.describe('Cart flow', () => {
  test('adds a product to the cart and shows it in the cart modal', async ({ page }) => {
    await mockBackend(page)
    await login(page)

    const productCard = page.locator('div').filter({ hasText: 'Pomme Gala' }).first()
    await expect(productCard).toBeVisible()

    const incrementButton = productCard.getByRole('button', { name: '+' })
    await incrementButton.click()

    await productCard.getByText('AJOUTER AU PANIER').click()
    await expect(productCard.getByText('AJOUTÉ')).toBeVisible()

    const cartIcon = page.locator('nav').locator('.lucide-shopping-bag').first()
    await cartIcon.click()

    const cartModal = page.getByRole('heading', { name: 'Panier' })
    await expect(cartModal).toBeVisible()
    await expect(page.locator('body')).toContainText('Pomme Gala')
    await expect(page.locator('body')).toContainText('1 article(s)')
  })
})
