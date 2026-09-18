import { test, expect } from '@playwright/test';

test.describe('Admin User Journey', () => {
  test('Super Admin can log in, navigate to Catalog, Create a Product, Publish', async ({ page }) => {
    // Gate the test
    test.skip(process.env.RUN_PRODUCT_ADMIN_E2E !== '1', 'Skipping authenticated admin E2E unless RUN_PRODUCT_ADMIN_E2E is set');

    // 1. Log in
    await page.goto('/login');

    // Check if redirect to login happened or if we are already logged in
    // check title

    // Since we require credentials from environment
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_INITIAL_PASSWORD;

    expect(email, 'SUPER_ADMIN_EMAIL must be set').toBeDefined();
    expect(password, 'SUPER_ADMIN_INITIAL_PASSWORD must be set').toBeDefined();

    const isLogin = await Promise.race([
      page.waitForSelector('input[type="email"]', { timeout: 5000 }).then(() => true).catch(() => false),
      page.waitForURL('**/internal**', { timeout: 5000 }).then(() => false).catch(() => true),
    ]);

    if (isLogin) {
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await page.fill('input[type="email"]', email!);
      await page.fill('input[type="password"]', password!);
      await page.getByRole('button', { name: /sign in/i }).click();

      await Promise.race([
        page.waitForURL('**/internal**', { timeout: 10000 }),
        page.waitForSelector('.text-red-800', { timeout: 10000 })
          .then(async (el) => { throw new Error('Login failed: ' + await el.textContent()); })
          .catch(() => new Promise(() => {})) // ignore timeout
      ]);
    }

    // 2. Navigate to Catalog
    await page.click('a[href="/internal/products"]');
    await expect(page).toHaveURL(/.*\/internal\/products/);

    // 3. Create a Product
    await page.click('text=Add Product');

    // Fill the form
    const uniqueId = Date.now();
    await page.fill('input[name="name"]', `E2E Test Product ${uniqueId}`);
    await page.fill('input[name="sku"]', `E2E-${uniqueId}`);
    // Slug should auto-generate based on title

    // Select category and brand (just pick the first enabled option)
    await page.locator('select[name="categoryId"]').selectOption({ index: 1 });
    await page.locator('select[name="brandId"]').selectOption({ index: 1 });

    await page.fill('input[name="publicPrice"]', '100000');
    await page.fill('textarea[name="shortDescription"]', 'E2E Test description');

    // Submit
    await page.click('button:has-text("Save Changes")');

    // Should be redirected to the product edit page
    await page.waitForURL(/.*\/internal\/products\/[0-9a-fA-F-]+/);
    await expect(page.locator('h1', { hasText: 'Edit Product' })).toBeVisible();

    // Add a specification
    await page.click('button:has-text("Add Spec")');
    const specKeyInputs = page.locator('input[placeholder="Key (e.g. Height)"]');
    await specKeyInputs.last().fill('E2E Spec');
    const specValueInputs = page.locator('input[placeholder="Value (e.g. 10 cm)"]');
    await specValueInputs.last().fill('E2E Value');
    await page.click('button:has-text("Save Changes")');
    await page.waitForTimeout(1000);

    // 4. Publish
    const publishButton = page.locator('button:has-text("Publish Product")');
    if (await publishButton.count() > 0) {
      await publishButton.click();
      await page.waitForTimeout(1000);
    }

    // 5. Verify public visibility
    // The slug should be e2e-test-product-uniqueId
    await page.goto(`/products/e2e-test-product-${uniqueId}`);
    await expect(page.locator('h1', { hasText: `E2E Test Product ${uniqueId}` })).toBeVisible();

    // 6. Move back to archive (from admin)
    await page.goto('/internal/products');

    // We can just click the product in the table. Let's find the link.
    const productRow = page.locator('tr', { hasText: `E2E Test Product ${uniqueId}` });
    const productLink = productRow.locator('a:has-text("Edit")');
    await productLink.click();
    await page.waitForURL(/.*\/internal\/products\/.+/);

    const archiveButton = page.locator('button:has-text("Archive Product")');
    if (await archiveButton.count() > 0) {
      await archiveButton.click();
      await page.waitForTimeout(1000);
    }

    // 7. Verify public invisibility
    await page.goto(`/products/e2e-test-product-${uniqueId}`);
    // Should be 404 or redirect or just not visible
    await expect(
      page.locator('text=Product not found').or(page.locator('text=This page could not be found.'))
    ).toBeVisible({ timeout: 5000 });
  });
});
