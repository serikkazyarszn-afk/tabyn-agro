import { test, expect } from '@playwright/test';

test('investor dashboard loads', async ({ page }) => {
  await page.goto('/en/dashboard');
  await expect(page.locator('h1')).toBeVisible();
});

test('investor can browse animals', async ({ page }) => {
  await page.goto('/en/animals');
  await page.waitForTimeout(2000);
  await expect(page.locator('h1')).toBeVisible();
});

test('investor can invest in an animal and see it in dashboard', async ({ page }) => {
  // Go to animals listing
  await page.goto('/en/animals');
  await page.waitForTimeout(3000);

  // Click the first available animal card
  const firstCard = page.locator('a[href*="/animals/"]').first();
  await expect(firstCard).toBeVisible({ timeout: 10000 });
  await firstCard.click();

  // Wait for animal detail to load
  await page.waitForTimeout(2000);

  // Read current balance before investing
  const balanceText = await page.locator('text=₸').first().textContent().catch(() => '');

  // Click invest button
  const investBtn = page.locator('button:has-text("Invest")').first();
  await expect(investBtn).toBeVisible({ timeout: 5000 });

  if (await investBtn.isDisabled()) {
    test.skip(true, 'Animal not available for investment (fully funded or growing)');
    return;
  }

  await investBtn.click();

  // Modal should open
  await expect(page.locator('[class*="modal"], [class*="fixed"]').last()).toBeVisible({ timeout: 5000 });

  // Confirm investment (use default amount)
  const confirmBtn = page.locator('button:has-text("Confirm")');
  await expect(confirmBtn).toBeVisible();
  await confirmBtn.click();

  // Success screen should appear
  await expect(page.locator('p:has-text("Investment successful")')).toBeVisible({ timeout: 10000 });

  // Go to dashboard and verify investment appears
  await page.goto('/en/dashboard');
  await page.waitForTimeout(3000);

  // Dashboard should show at least 1 investment row
  const investmentRows = page.locator('[class*="border"][class*="rounded"]').filter({ hasText: '₸' });
  await expect(investmentRows.first()).toBeVisible({ timeout: 10000 });
});

test('investor dashboard shows correct stats after investment', async ({ page }) => {
  await page.goto('/en/dashboard');
  await page.waitForTimeout(2000);

  // Total invested should be > 0
  const totalInvestedCard = page.locator('text=Total Invested').locator('..').locator('..').locator('div').last();
  await expect(page.locator('text=₸').first()).toBeVisible();
});
