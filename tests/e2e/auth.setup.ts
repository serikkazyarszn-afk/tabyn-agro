
import { test as setup, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test.local' });

setup('farmer login', async ({ page }) => {
  await page.goto('/en/login');
  await page.fill('input[type="email"]', process.env.TEST_FARMER_EMAIL!);
  await page.fill('input[type="password"]', process.env.TEST_FARMER_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/farmer/dashboard', { timeout: 10000 });
  await page.context().storageState({ path: 'playwright/.auth/farmer.json' });
  console.log('✓ Farmer session saved');
});

setup('investor login', async ({ page }) => {
  await page.goto('/en/login');
  await page.fill('input[type="email"]', process.env.TEST_INVESTOR_EMAIL!);
  await page.fill('input[type="password"]', process.env.TEST_INVESTOR_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await page.context().storageState({ path: 'playwright/.auth/investor.json' });
  console.log('✓ Investor session saved');
});
