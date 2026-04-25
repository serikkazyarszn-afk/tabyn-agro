import { test, expect } from '@playwright/test';

test('landing page loads without error', async ({ page }) => {
  await page.goto('/en');
  await expect(page).not.toHaveTitle(/error/i);
  await expect(page.locator('h1').first()).toBeVisible();
});

test('animals listing page loads', async ({ page }) => {
  await page.goto('/en/animals');
  await expect(page.locator('h1')).toBeVisible();
});

test('login page loads', async ({ page }) => {
  await page.goto('/en/login');
  await expect(page.locator('input[type="email"]')).toBeVisible();
});

test('signup page loads', async ({ page }) => {
  await page.goto('/en/signup');
  await expect(page.locator('input[type="email"]')).toBeVisible();
});
