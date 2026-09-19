import { test, expect } from '@playwright/test';

test.describe('Auth Runtime', () => {
  // Gate the test
  test.skip(process.env.RUN_AUTH_RUNTIME_E2E !== '1', 'Skipping auth runtime e2e as RUN_AUTH_RUNTIME_E2E=1 is not set');

  test('Super Admin Login, Navigation, and Logout flow', async ({ page }) => {
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_INITIAL_PASSWORD;

    if (!email || !password) {
      throw new Error('Bootstrap credentials not set in environment.');
    }

    // 1. go to /login
    await page.goto('/login');

    // 2. fill email/password
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);

    // 3. submit
    await page.click('button[type="submit"]');

    // 4. verify successful navigation to /internal
    await expect(page).toHaveURL(/\/internal$/, { timeout: 10000 });

    // 5. verify authenticated dashboard content renders
    // Expect some common dashboard element to be visible
    await expect(page.locator('h1').filter({ hasText: /Dashboard/i })).toBeVisible();

    // 6. navigate to /internal/inventory
    await page.goto('/internal/inventory');

    // 7. SUPER_ADMIN must be allowed
    // Expect heading to contain Inventory
    await expect(page.locator('h1').filter({ hasText: /Inventory/i })).toBeVisible();

    // 8. navigate to /internal/products
    await page.goto('/internal/products');

    // 9. SUPER_ADMIN must be allowed
    // Expect heading to contain Products
    await expect(page.locator('h1').filter({ hasText: /Products/i })).toBeVisible();

    // 10. logout
    // Assume there is a logout button with text Logout
    await page.click('button:has-text("Logout"), a:has-text("Logout")');

    // 11. verify redirected to /login
    await expect(page).toHaveURL(/\/login$/);

    // 12. try /internal again
    await page.goto('/internal');

    // 13. verify authentication is required (redirects back to login)
    await expect(page).toHaveURL(/\/login$/);
  });
});
