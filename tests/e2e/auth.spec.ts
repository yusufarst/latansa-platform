import { test, expect } from '@playwright/test';

test.describe('Authentication & RBAC DB-independent E2E', () => {
  test('login page renders with branding and form', async ({ page }) => {
    await page.goto('/login');
    
    // Branding
    await expect(page.getByAltText(/LATANSA Platform Logo/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: /Welcome Back|Masuk/i })).toBeVisible();

    // Form fields
    await expect(page.getByLabel(/Email address|Alamat Email/i)).toBeVisible();
    await expect(page.getByLabel(/Password|Kata Sandi/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign in|Masuk/i })).toBeVisible();
  });

  test('unauthenticated internal access redirects to login', async ({ page }) => {
    // Attempt to access internal dashboard
    await page.goto('/internal');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/.*\/login/);
    
    // Attempt to access inventory proof route
    await page.goto('/internal/inventory');
    await expect(page).toHaveURL(/.*\/login/);

    // Attempt to access products proof route
    await page.goto('/internal/products');
    await expect(page).toHaveURL(/.*\/login/);

    // Attempt to access access-denied route
    await page.goto('/internal/access-denied');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('responsive login layout works on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/login');
    
    // Form should still be visible and accessible
    const formContainer = page.locator('form').locator('..');
    
    // Ensure no horizontal scrolling (width <= 375)
    const boundingBox = await formContainer.boundingBox();
    expect(boundingBox?.width).toBeLessThanOrEqual(375);
    
    await expect(page.getByLabel(/Email address|Alamat Email/i)).toBeVisible();
  });
});
