import { test, expect } from '@playwright/test';

test.describe('Public Catalog & Comparison E2E', () => {
  test('Catalog page renders and supports product comparison', async ({ page }) => {
    await page.goto('/products');
    
    // Title should be visible
    await expect(page.locator('h1').filter({ hasText: 'Medical Equipment Catalog' })).toBeVisible();
    
    // Find all compare buttons on the page
    const compareButtons = page.locator('button', { hasText: 'Compare' });
    
    // If there are at least two products, test the compare flow
    const count = await compareButtons.count();
    if (count >= 2) {
      // Click first two compare buttons
      await compareButtons.nth(0).click();
      await compareButtons.nth(1).click();
      
      // The floating compare bar should become visible with the "Compare Products" link
      const compareLink = page.locator('a', { hasText: 'Compare Products' });
      await expect(compareLink).toBeVisible();
      
      // Click the compare link
      await compareLink.click();
      
      // Verify we navigated to the compare page
      await expect(page).toHaveURL(/.*\/products\/compare\?items=.*/);
      await expect(page.locator('h1').filter({ hasText: 'Compare Products' })).toBeVisible();
      
      // Check that "Clear Comparison" is visible
      await expect(page.locator('a', { hasText: 'Clear Comparison' })).toBeVisible();
    }
  });

  test('Product detail page renders correctly', async ({ page }) => {
    // Go to catalog to find a product
    await page.goto('/products');
    
    // Find first product link by a.group class
    const productLinks = page.locator('a.group');
    await expect(productLinks.first()).toBeVisible({ timeout: 10000 });
    
    if (await productLinks.count() > 0) {
      await productLinks.nth(0).click();
      
      // We should be on a product detail page
      await expect(page).toHaveURL(/.*\/products\/.+/);
      
      // The page should have a compare button
      await expect(page.locator('button', { hasText: 'Compare' })).toBeVisible();
      
      // The page should have a WhatsApp inquiry button
      await expect(page.locator('button', { hasText: /Chat on WhatsApp/i })).toBeVisible();
    }
  });
});
