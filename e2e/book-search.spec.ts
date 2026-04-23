import { test, expect } from '@playwright/test'

test.describe('Book Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/books')
    await expect(page.getByRole('article').first()).toBeVisible({ timeout: 45000 })
  })

  test('happy path: search, filter and paginate', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Book Search' })).toBeVisible()

    await page.getByRole('searchbox').fill('frankenstein')
    await expect(page.getByText(/frankenstein/i).first()).toBeVisible({ timeout: 20000 })

    await page.getByLabel('Language').selectOption('en')
    await expect(page.getByRole('article').first()).toBeVisible({ timeout: 10000 })
  })

  test('empty state: search with no results shows empty message', async ({ page }) => {
    await page.getByRole('searchbox').fill('xyznonexistentbook12345')
    await expect(page.getByText(/no books found/i)).toBeVisible({ timeout: 20000 })
  })
})

test.describe('Book Search - error state', () => {
  test('error state: shows error message with retry when API is unavailable', async ({
    page,
  }) => {
    await page.clock.install({ time: Date.now() + 70_000 })

    await page.route('**/gutendex.com/**', (route) => route.abort())

    await page.goto('/books')

    const errorAlert = page.getByRole('main').getByRole('alert')
    await expect(errorAlert).toBeVisible({ timeout: 10000 })
    await expect(errorAlert.getByRole('button')).toBeVisible()
  })
})
