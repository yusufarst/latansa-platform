import { eq, and, desc, asc, ilike, or, sql, count } from "drizzle-orm";
import { db } from "../../../db";
import { categories, brands, products, productImages, productSpecifications, analyticsEvents } from "../db/schema";
import { PublicProductDTO, PublicCategoryDTO, PublicBrandDTO, CatalogFilters, storageKeyToPublicUrl } from "../validations";

const DEFAULT_PAGE_SIZE = 24;

export async function getPublicCategories(): Promise<PublicCategoryDTO[]> {
  const data = await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(categories.sortOrder, categories.name);
  return data.map(c => ({
    name: c.name,
    slug: c.slug,
    description: c.description,
  }));
}

export async function getPublicBrands(): Promise<PublicBrandDTO[]> {
  const data = await db.select().from(brands).where(eq(brands.isActive, true)).orderBy(brands.sortOrder, brands.name);
  return data.map(b => ({
    name: b.name,
    slug: b.slug,
    description: b.description,
  }));
}

export async function getPublicProducts(filters?: CatalogFilters): Promise<{
  products: PublicProductDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const page = Math.max(1, filters?.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, filters?.pageSize ?? DEFAULT_PAGE_SIZE));
  const offset = (page - 1) * pageSize;

  // Build where conditions
  const conditions = [
    eq(products.status, "PUBLISHED"),
    eq(categories.isActive, true),
    eq(brands.isActive, true),
  ];

  if (filters?.categorySlug) {
    conditions.push(eq(categories.slug, filters.categorySlug));
  }

  if (filters?.brandSlug) {
    conditions.push(eq(brands.slug, filters.brandSlug));
  }

  if (filters?.search) {
    const term = `%${filters.search}%`;
    
    const { inArray } = await import("drizzle-orm");
    
    const matchingSpecProductIds = db.select({ id: productSpecifications.productId })
      .from(productSpecifications)
      .where(ilike(productSpecifications.value, term));

    conditions.push(
      or(
        ilike(products.name, term),
        ilike(products.sku, term),
        ilike(products.shortDescription, term),
        ilike(categories.name, term),
        ilike(brands.name, term),
        inArray(products.id, matchingSpecProductIds)
      )!
    );
  }

  if (filters?.specs) {
    for (const [key, value] of Object.entries(filters.specs)) {
      if (!value) continue;
      const values = Array.isArray(value) ? value : [value];
      if (values.length === 0) continue;
      
      const { inArray } = await import("drizzle-orm");
      
      // We use a subquery to find product IDs that have this exact spec key and one of the allowed values
      const matchingProductIds = db.select({ id: productSpecifications.productId })
        .from(productSpecifications)
        .where(
          and(
            eq(productSpecifications.key, key),
            inArray(productSpecifications.value, values)
          )
        );
        
      conditions.push(inArray(products.id, matchingProductIds));
    }
  }

  const whereClause = and(...conditions);

  // Sort
  let orderBy;
  switch (filters?.sort) {
    case "newest":
      orderBy = [desc(products.publishedAt)];
      break;
    case "name-az":
      orderBy = [asc(products.name)];
      break;
    case "price-low":
      orderBy = [asc(sql`COALESCE(${products.publicPrice}, 999999999)`)];
      break;
    case "price-high":
      orderBy = [desc(sql`COALESCE(${products.publicPrice}, 0)`)];
      break;
    default:
      orderBy = [desc(products.isFeatured), desc(products.publishedAt)];
  }

  // Count total
  const [countResult] = await db
    .select({ total: count() })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(whereClause);

  const total = countResult.total;

  // Fetch paginated products
  const rows = await db
    .select({
      product: products,
      category: categories,
      brand: brands,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(whereClause)
    .orderBy(...orderBy)
    .limit(pageSize)
    .offset(offset);

  const result: PublicProductDTO[] = rows.map(r => ({
    sku: r.product.sku,
    slug: r.product.slug,
    name: r.product.name,
    shortDescription: r.product.shortDescription,
    description: null, // Omitted in list view
    publicPrice: r.product.publicPrice,
    isFeatured: r.product.isFeatured,
    category: {
      name: r.category.name,
      slug: r.category.slug,
      description: null,
    },
    brand: {
      name: r.brand.name,
      slug: r.brand.slug,
      description: null,
    },
    images: [],
    specifications: [],
  }));

  return {
    products: result,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getPublicProductDetail(slug: string): Promise<PublicProductDTO | null> {
  const rows = await db
    .select({
      product: products,
      category: categories,
      brand: brands,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(
      and(
        eq(products.slug, slug),
        eq(products.status, "PUBLISHED"),
        eq(categories.isActive, true),
        eq(brands.isActive, true),
      )
    )
    .limit(1);

  if (rows.length === 0) return null;

  const row = rows[0];

  const imgs = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, row.product.id))
    .orderBy(productImages.sortOrder);

  const specs = await db
    .select()
    .from(productSpecifications)
    .where(eq(productSpecifications.productId, row.product.id))
    .orderBy(productSpecifications.sortOrder);

  return {
    sku: row.product.sku,
    slug: row.product.slug,
    name: row.product.name,
    shortDescription: row.product.shortDescription,
    description: row.product.description,
    publicPrice: row.product.publicPrice,
    isFeatured: row.product.isFeatured,
    category: {
      name: row.category.name,
      slug: row.category.slug,
      description: row.category.description,
    },
    brand: {
      name: row.brand.name,
      slug: row.brand.slug,
      description: row.brand.description,
    },
    images: imgs.map(i => ({
      url: storageKeyToPublicUrl(i.storageKey),
      altText: i.altText,
      isPrimary: i.isPrimary,
    })),
    specifications: specs.map(s => ({
      groupName: s.groupName,
      key: s.key,
      value: s.value,
    })),
  };
}

export async function getRelatedProducts(productSlug: string, categorySlug: string, limit = 4): Promise<PublicProductDTO[]> {
  const rows = await db
    .select({ product: products, category: categories, brand: brands })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(
      and(
        eq(products.status, "PUBLISHED"),
        eq(categories.slug, categorySlug),
        sql`${products.slug} != ${productSlug}`,
      )
    )
    .orderBy(desc(products.isFeatured), desc(products.publishedAt))
    .limit(limit);

  return rows.map(r => ({
    sku: r.product.sku,
    slug: r.product.slug,
    name: r.product.name,
    shortDescription: r.product.shortDescription,
    description: null,
    publicPrice: r.product.publicPrice,
    isFeatured: r.product.isFeatured,
    category: { name: r.category.name, slug: r.category.slug, description: null },
    brand: { name: r.brand.name, slug: r.brand.slug, description: null },
    images: [],
    specifications: [],
  }));
}

export async function getProductsForCompare(slugs: string[]): Promise<PublicProductDTO[]> {
  if (slugs.length === 0 || slugs.length > 4) return [];

  const result: PublicProductDTO[] = [];
  for (const slug of slugs) {
    const product = await getPublicProductDetail(slug);
    if (product) result.push(product);
  }
  return result;
}

export async function recordWhatsAppClickEvent(productId: string, metadata?: Record<string, unknown>) {
  await db.insert(analyticsEvents).values({
    eventName: "WHATSAPP_CLICK",
    productId,
    metadata: metadata ?? null,
  });
}

export async function isProductPublished(slug: string): Promise<{ published: boolean; productId?: string; productName?: string; sku?: string }> {
  const [row] = await db
    .select({ id: products.id, name: products.name, status: products.status, sku: products.sku })
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!row) return { published: false };
  return {
    published: row.status === "PUBLISHED",
    productId: row.id,
    productName: row.name,
    sku: row.sku,
  };
}

export async function getPublicSpecificationFilters(categorySlug?: string): Promise<Record<string, string[]>> {
  const conditions = [eq(products.status, "PUBLISHED")];

  if (categorySlug) {
    const [cat] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, categorySlug));
    if (cat) {
      conditions.push(eq(products.categoryId, cat.id));
    }
  }

  const rows = await db
    .select({
      key: productSpecifications.key,
      value: productSpecifications.value,
    })
    .from(productSpecifications)
    .innerJoin(products, eq(productSpecifications.productId, products.id))
    .where(and(...conditions));
  const filterMap: Record<string, Set<string>> = {};

  for (const row of rows) {
    if (!filterMap[row.key]) filterMap[row.key] = new Set();
    filterMap[row.key].add(row.value);
  }

  const result: Record<string, string[]> = {};
  for (const [key, valSet] of Object.entries(filterMap)) {
    result[key] = Array.from(valSet).sort();
  }

  return result;
}
