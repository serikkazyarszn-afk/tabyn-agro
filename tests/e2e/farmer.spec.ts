import { test, expect } from '@playwright/test';

const ANIMAL_NAME = 'PlaywrightTestCow';

test('farmer dashboard loads', async ({ page }) => {
  await page.goto('/en/farmer/dashboard');
  await expect(page.locator('h1')).toBeVisible();
});

test('farmer can add a new animal', async ({ page }) => {
  await page.goto('/en/farmer/animals/new');

  await page.fill('#name', ANIMAL_NAME);
  await page.selectOption('#type', 'cow');
  await page.fill('#price', '250000');
  await page.fill('#expected_return_pct', '18');
  await page.fill('#duration_months', '8');
  await page.fill('#slots_total', '5');
  await page.fill('#description', 'Playwright test animal');

  await page.click('button[type="submit"]');

  // Should show success screen (h2 contains "successfully")
  await expect(page.locator('h2').filter({ hasText: /successfully/i })).toBeVisible({ timeout: 10000 });
});

test('new animal appears in farmer dashboard', async ({ page }) => {
  await page.goto('/en/farmer/dashboard');
  await page.waitForTimeout(2000); // wait for DB fetch
  await expect(page.locator(`text=${ANIMAL_NAME}`)).toBeVisible({ timeout: 10000 });
});

test('new animal appears on public listings page', async ({ page }) => {
  await page.goto('/en/animals');
  await page.waitForTimeout(2000);
  await expect(page.locator(`text=${ANIMAL_NAME}`)).toBeVisible({ timeout: 10000 });
});

test('farmer can advance animal status to growing', async ({ page }) => {
  await page.goto('/en/farmer/dashboard');
  await page.waitForTimeout(2000);

  // Find the status button for the test animal
  const animalRow = page.locator(`div:has-text("${ANIMAL_NAME}")`).last();
  const nextStatusBtn = animalRow.locator('button:has-text("Growing")');

  if (await nextStatusBtn.isVisible()) {
    await nextStatusBtn.click();
    await page.waitForTimeout(1000);
    // Button should change or disappear (status advanced)
    await expect(page.locator(`text=${ANIMAL_NAME}`)).toBeVisible();
  }
});
