import { test, expect } from '@playwright/test'

test.describe('Smoke tests', () => {
  test('marketing landing renders', async ({ page }) => {
    const res = await page.goto('/')
    expect(res?.status()).toBe(200)
    await expect(page.locator('text=Rawaj')).toBeVisible()
  })

  test('sign-in route renders', async ({ page }) => {
    const res = await page.goto('/sign-in')
    expect(res?.status()).toBe(200)
    await expect(page.locator('text=Welcome back')).toBeVisible()
  })

  test('404 page renders', async ({ page }) => {
    const res = await page.goto('/this-does-not-exist')
    expect(res?.status()).toBe(404)
    await expect(page.locator('text=could not find')).toBeVisible()
  })

  test('privacy page returns 200', async ({ page }) => {
    const res = await page.goto('/privacy')
    expect(res?.status()).toBe(200)
  })

  test('terms page returns 200', async ({ page }) => {
    const res = await page.goto('/terms')
    expect(res?.status()).toBe(200)
  })

  test('docs page returns 200', async ({ page }) => {
    const res = await page.goto('/docs')
    expect(res?.status()).toBe(200)
  })

  test('status page returns 200', async ({ page }) => {
    const res = await page.goto('/status')
    expect(res?.status()).toBe(200)
  })
})
