import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/LATANSA/);
});

test('renders logo', async ({ page }) => {
  await page.goto('/');
  // Expect the brand logo to be visible
  await expect(page.locator('img[alt="LATANSA Platform Logo"]')).toBeVisible();
});
