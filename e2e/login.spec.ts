import { test, expect } from '@playwright/test'

test.describe('Login page', () => {
  test('displays the login form', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible()
    await expect(page.locator('input#email')).toBeVisible()
    await expect(page.locator('input#password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible()
  })

  test('logs the user in and redirects to /products', async ({ page }) => {
    await page.route('**/api/login_check', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'fake-jwt-token' }),
      }),
    )

    await page.route('**/api/me', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          email: 'test@example.com',
          firstName: 'Thomas',
          lastName: 'Test',
          phone: '',
        }),
      }),
    )

    await page.route('**/api/products', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      }),
    )

    await page.goto('/login')
    await page.locator('input#email').fill('test@example.com')
    await page.locator('input#password').fill('secret')
    await page.getByRole('button', { name: 'Se connecter' }).click()

    await expect(page).toHaveURL(/\/products/)
  })

  test('shows an error message when credentials are invalid', async ({ page }) => {
    await page.route('**/api/login_check', (route) =>
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Identifiants invalides' }),
      }),
    )

    await page.goto('/login')
    await page.locator('input#email').fill('test@example.com')
    await page.locator('input#password').fill('wrong')
    await page.getByRole('button', { name: 'Se connecter' }).click()

    await expect(page.getByText('Identifiants invalides')).toBeVisible()
    await expect(page).toHaveURL(/\/login/)
  })
})
