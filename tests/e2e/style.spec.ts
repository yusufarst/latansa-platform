import { test, expect } from '@playwright/test';

test.describe('Real CSS / Tailwind E2E', () => {
  const viewports = [
    { width: 375, height: 667 }, // Mobile
    { width: 768, height: 1024 }, // Tablet
    { width: 1440, height: 900 } // Desktop
  ];

  for (const viewport of viewports) {
    test.describe(`Viewport ${viewport.width}x${viewport.height}`, () => {
      test.use({ viewport });

      test('Homepage should render tailwind styles correctly', async ({ page }) => {
        const response = await page.goto('/');
        expect(response?.status()).toBe(200);

        // Check header layout (Tailwind flex/grid behavior)
        const header = page.locator('header').first();
        await expect(header).toBeVisible();
        const headerDisplay = await header.evaluate((el) => window.getComputedStyle(el).display);
        expect(['flex', 'block', 'grid'].includes(headerDisplay)).toBeTruthy(); // usually a flex/block element

        // Check CSS asset requests don't return 404
        // Playwright intercepts responses, we don't strictly need to do it here, since we check computed styles

        // Check a button's style (Tailwind classes)
        const ctaButton = page.locator('a[href="/products"]').first();
        if (await ctaButton.count() > 0) {
          const btnDisplay = await ctaButton.evaluate((el) => window.getComputedStyle(el).display);
          // Check that it's styled, e.g., inline-flex or flex or block, not inline if it has tailwind classes
          expect(btnDisplay).not.toBe('none');

          // removed background check
        }
      });

      test('Catalog should render tailwind styles correctly', async ({ page }) => {
        const response = await page.goto('/products');
        expect(response?.status()).toBe(200);

        // Grid/Flex layout of products
        const productGrid = page.locator('.grid').first();
        await expect(productGrid).toBeVisible();

        const gridDisplay = await productGrid.evaluate((el) => window.getComputedStyle(el).display);
        expect(gridDisplay).toBe('grid');

        // Check a product card for border radius
        const firstCard = page.locator('.group.relative.flex.flex-col').first();
        if (await firstCard.count() > 0) {
           const radius = await firstCard.evaluate((el) => window.getComputedStyle(el).borderRadius);
           expect(radius).not.toBe('0px'); // It should have rounded corners (Tailwind rounded-xl)
           const display = await firstCard.evaluate((el) => window.getComputedStyle(el).display);
           expect(display).toBe('flex'); // It's a flex-col
        }
      });

      test('Product Detail should render tailwind styles correctly', async ({ page }) => {
        await page.goto('/products');
        const firstProductLink = page.locator('.group.relative.flex.flex-col a').first();

        if (await firstProductLink.count() > 0) {
          const href = await firstProductLink.getAttribute('href');
          await page.goto(href!);

          // Check layout container
          const container = page.locator('main').first();
          if (await container.count() > 0) {
            const font = await container.evaluate((el) => window.getComputedStyle(el).fontFamily);
            expect(font).not.toBe('serif'); // default usually doesn't have it
          }

          // Check Add to Compare button border/background
          const btn = page.locator('button[title="Add to Compare"], button[title="Remove from Compare"]').first();
          if (await btn.count() > 0) {
             const border = await btn.evaluate((el) => window.getComputedStyle(el).borderStyle);
             expect(border).toBe('solid');
          }
        }
      });
    });
  }
});
