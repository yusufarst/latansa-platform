import { test, expect } from '@playwright/test';

test.describe('Public User Journey', () => {
  test('browse products, apply filter, view product, click WhatsApp', async ({ page }) => {
    // 1. Browse products
    await page.goto('/');
    
    // Click "Browse Catalog"
    await page.click('text=Browse Catalog');
    await expect(page).toHaveURL(/.*\/products/);
    
    // 2. Apply a filter (assuming there's a category or brand link)
    // Find the first category filter link
    const firstCategoryLink = page.locator('aside a[href*="?category="]').first();
    const categoryName = await firstCategoryLink.textContent();
    
    if (categoryName) {
      await firstCategoryLink.click();
      await expect(page).toHaveURL(/.*category=/);
      
      // Wait for products to load
      // Wait for products to load
      await page.waitForSelector('div.group');
      
      // 3. Click into a product
      const firstProductLink = page.locator('div.group a').first();
      await firstProductLink.click();
      
      // Ensure we are on the product page
      await expect(page.locator('h1')).toBeVisible();
      
      // 4. Click WhatsApp CTA
      const whatsappButton = page.locator('a[href*="/api/go/whatsapp/"]');
      await expect(whatsappButton).toBeVisible();
      const href = await whatsappButton.getAttribute('href');
      expect(href).toContain('/api/go/whatsapp/');
    }
  });
});
