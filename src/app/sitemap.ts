import { MetadataRoute } from 'next';
import { db } from '@/db';
import { products, categories, brands } from '@/modules/products/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base static routes
  const routes = [
    '',
    '/products',
    '/products/compare',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Published products
  const publishedProducts = await db
    .select({ slug: products.slug, updatedAt: products.updatedAt })
    .from(products)
    .where(eq(products.status, 'PUBLISHED'));

  const productRoutes = publishedProducts.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: p.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Categories
  const activeCategories = await db
    .select({ slug: categories.slug })
    .from(categories)
    .where(eq(categories.isActive, true));

  const categoryRoutes = activeCategories.map((c) => ({
    url: `${baseUrl}/products?category=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Brands
  const activeBrands = await db
    .select({ slug: brands.slug })
    .from(brands)
    .where(eq(brands.isActive, true));

  const brandRoutes = activeBrands.map((b) => ({
    url: `${baseUrl}/products?brand=${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [...routes, ...productRoutes, ...categoryRoutes, ...brandRoutes];
}
