import { test, expect } from '@playwright/test';

test.describe('Public Catalog & Comparison E2E', () => {
  test.skip('Catalog page renders and supports product comparison', async ({ page }) => {
    await page.goto('/products');
    
    // Title should be visible
    await expect(page.locator('h1').filter({ hasText: 'Electronics & IT Equipment Catalog' })).toBeVisible();
    
    // Target the compare buttons within the first two product cards
    const firstProductBtn = page.locator('a.group').nth(0).locator('button');
    const secondProductBtn = page.locator('a.group').nth(1).locator('button');

    // Wait for hydration
    await page.waitForTimeout(2000);

    // Wait for them to be visible (hydrated) and click
    await expect(firstProductBtn).toHaveAttribute('title', 'Add to Compare');
    await firstProductBtn.click();
    await expect(firstProductBtn).toHaveAttribute('title', 'Remove from Compare');

    await expect(secondProductBtn).toHaveAttribute('title', 'Add to Compare');
    await secondProductBtn.click();
    await expect(secondProductBtn).toHaveAttribute('title', 'Remove from Compare');
    
    // The floating compare bar should become visible with the "Compare Products" link
    const compareLink = page.locator('a', { hasText: 'Compare Products' });
    await expect(compareLink).toBeVisible();
    
    // Click the compare link
    await compareLink.click();
    
    // Verify we navigated to the compare page
    await expect(page).toHaveURL(/.*\/compare\?items=.*/);
    await expect(page.locator('h1').filter({ hasText: 'Compare Products' })).toBeVisible();
    
    // Check that "Clear Comparison" is visible
    await expect(page.locator('a', { hasText: 'Clear Comparison' })).toBeVisible();
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
      await expect(page.locator('button[title="Add to Compare"], button[title="Remove from Compare"]')).toBeVisible();
      
      // The page should have a WhatsApp inquiry button
      await expect(page.locator('a', { hasText: /Chat on WhatsApp/i })).toBeVisible();
    }
  });
});
