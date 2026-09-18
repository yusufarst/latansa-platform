import { eq, desc } from "drizzle-orm";
import { db } from "../../../db";
import { categories, brands, products, productSpecifications, productImages } from "../db/schema";
import type { ProductStatus } from "../db/schema";
import { requireRole } from "../../auth/authorization";
import { appendAuditLog } from "../../auth/audit";
import { publishValidation } from "../validations";

// ─── Categories ─────────────────────────────────────────

export async function createCategory(input: { name: string; slug: string; description?: string | null; sortOrder?: number }) {
  const { user } = await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);

  const [newCategory] = await db.insert(categories).values({
    name: input.name,
    slug: input.slug,
    description: input.description,
    sortOrder: input.sortOrder || 0,
  }).returning();

  await appendAuditLog("CATEGORY_CREATED", { actorUserId: user.id, entityType: "CATEGORY", entityId: newCategory.id, metadata: { slug: newCategory.slug } });
  return newCategory;
}

export async function updateCategory(id: string, input: { name?: string; slug?: string; description?: string | null; isActive?: boolean; sortOrder?: number }) {
  const { user } = await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);

  const [existing] = await db.select().from(categories).where(eq(categories.id, id));
  const isStatusChange = input.isActive !== undefined && existing && input.isActive !== existing.isActive;

  const [updatedCategory] = await db.update(categories)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(categories.id, id))
    .returning();

  if (isStatusChange) {
    await appendAuditLog("CATEGORY_STATUS_CHANGED", { actorUserId: user.id, entityType: "CATEGORY", entityId: id, metadata: { isActive: input.isActive } });
  } else {
    await appendAuditLog("CATEGORY_UPDATED", { actorUserId: user.id, entityType: "CATEGORY", entityId: id, metadata: { changedKeys: Object.keys(input) } });
  }
  return updatedCategory;
}

export async function getCategoryById(id: string) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  const [cat] = await db.select().from(categories).where(eq(categories.id, id));
  return cat || null;
}

// ─── Brands ─────────────────────────────────────────────

export async function createBrand(input: { name: string; slug: string; description?: string | null; sortOrder?: number }) {
  const { user } = await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);

  const [newBrand] = await db.insert(brands).values({
    name: input.name,
    slug: input.slug,
    description: input.description,
    sortOrder: input.sortOrder || 0,
  }).returning();

  await appendAuditLog("BRAND_CREATED", { actorUserId: user.id, entityType: "BRAND", entityId: newBrand.id, metadata: { slug: newBrand.slug } });
  return newBrand;
}

export async function updateBrand(id: string, input: { name?: string; slug?: string; description?: string | null; isActive?: boolean; sortOrder?: number }) {
  const { user } = await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);

  const [existing] = await db.select().from(brands).where(eq(brands.id, id));
  const isStatusChange = input.isActive !== undefined && existing && input.isActive !== existing.isActive;

  const [updatedBrand] = await db.update(brands)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(brands.id, id))
    .returning();

  if (isStatusChange) {
    await appendAuditLog("BRAND_STATUS_CHANGED", { actorUserId: user.id, entityType: "BRAND", entityId: id, metadata: { isActive: input.isActive } });
  } else {
    await appendAuditLog("BRAND_UPDATED", { actorUserId: user.id, entityType: "BRAND", entityId: id, metadata: { changedKeys: Object.keys(input) } });
  }
  return updatedBrand;
}

export async function getBrandById(id: string) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  const [brand] = await db.select().from(brands).where(eq(brands.id, id));
  return brand || null;
}

// ─── Products ───────────────────────────────────────────

export async function createProductWithSpecs(
  input: {
    sku: string; slug: string; name: string; categoryId: string; brandId: string;
    publicPrice?: string | null; shortDescription?: string | null; description?: string | null;
    trackingMode?: string; isFeatured?: boolean;
  },
  specs: Array<{ key: string; value: string; groupName?: string | null; sortOrder?: number }>
) {
  const { user } = await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);

  return db.transaction(async (tx) => {
    const [newProduct] = await tx.insert(products).values({
      sku: input.sku,
      slug: input.slug,
      name: input.name,
      categoryId: input.categoryId,
      brandId: input.brandId,
      publicPrice: input.publicPrice,
      shortDescription: input.shortDescription,
      description: input.description,
      trackingMode: input.trackingMode || "QUANTITY",
      isFeatured: input.isFeatured ?? false,
      status: "DRAFT",
    }).returning();

    if (specs.length > 0) {
      await tx.insert(productSpecifications).values(
        specs.map((s, i) => ({
          productId: newProduct.id,
          groupName: s.groupName || null,
          key: s.key,
          value: s.value,
          sortOrder: s.sortOrder ?? i,
        }))
      );
    }

    await appendAuditLog("PRODUCT_CREATED", { actorUserId: user.id, entityType: "PRODUCT", entityId: newProduct.id, metadata: { sku: newProduct.sku }, tx });
    return newProduct;
  });
}

export async function updateProductWithSpecs(
  id: string,
  input: {
    sku?: string; slug?: string; name?: string; categoryId?: string; brandId?: string;
    publicPrice?: string | null; shortDescription?: string | null; description?: string | null;
    isFeatured?: boolean; trackingMode?: string;
  },
  specs?: Array<{ key: string; value: string; groupName?: string | null; sortOrder?: number }>
) {
  const { user } = await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);

  return db.transaction(async (tx) => {
    const updateData: Record<string, unknown> = { ...input, updatedAt: new Date() };

    const [updatedProduct] = await tx.update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();

    if (specs !== undefined) {
      await tx.delete(productSpecifications).where(eq(productSpecifications.productId, id));
      if (specs.length > 0) {
        await tx.insert(productSpecifications).values(
          specs.map((s, i) => ({
            productId: id,
            groupName: s.groupName || null,
            key: s.key,
            value: s.value,
            sortOrder: s.sortOrder ?? i,
          }))
        );
      }
      await appendAuditLog("PRODUCT_SPECIFICATIONS_UPDATED", {
        actorUserId: user.id,
        entityType: "PRODUCT",
        entityId: id,
        metadata: { specCount: specs.length },
        tx
      });
    }

    await appendAuditLog("PRODUCT_UPDATED", { actorUserId: user.id, entityType: "PRODUCT", entityId: id, metadata: { changedKeys: Object.keys(input) }, tx });
    return updatedProduct;
  });
}

export async function publishProduct(id: string) {
  const { user } = await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);

  // Load current product data
  const [product] = await db.select().from(products).where(eq(products.id, id));
  if (!product) throw new Error("Product not found");
  if (product.status === "PUBLISHED") return product;

  // Validate mandatory fields for publishing
  const validation = publishValidation.safeParse(product);
  if (!validation.success) {
    const errors = validation.error.issues.map(e => e.message).join(", ");
    throw new Error(`Cannot publish: ${errors}`);
  }

  const [updated] = await db.update(products)
    .set({ status: "PUBLISHED" as ProductStatus, publishedAt: new Date(), updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();

  await appendAuditLog("PRODUCT_PUBLISHED", { actorUserId: user.id, entityType: "PRODUCT", entityId: id, metadata: { sku: product.sku } });
  return updated;
}

export async function archiveProduct(id: string) {
  const { user } = await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);

  const [product] = await db.select().from(products).where(eq(products.id, id));
  if (!product) throw new Error("Product not found");
  if (product.status === "ARCHIVED") return product;

  const [updated] = await db.update(products)
    .set({ status: "ARCHIVED" as ProductStatus, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();

  await appendAuditLog("PRODUCT_ARCHIVED", { actorUserId: user.id, entityType: "PRODUCT", entityId: id, metadata: { sku: product.sku } });
  return updated;
}

export async function unpublishProduct(id: string) {
  const { user } = await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);

  const [updated] = await db.update(products)
    .set({ status: "DRAFT" as ProductStatus, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();

  await appendAuditLog("PRODUCT_UPDATED", { actorUserId: user.id, entityType: "PRODUCT", entityId: id, metadata: { statusChange: "DRAFT" } });
  return updated;
}

// ─── Specifications ────────────────────────────────────

export async function updateProductSpecifications(
  productId: string,
  specs: Array<{ id?: string; groupName?: string | null; key: string; value: string; sortOrder?: number }>
) {
  const { user } = await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);

  // Delete existing specs and re-insert (simple transactional approach)
  await db.delete(productSpecifications).where(eq(productSpecifications.productId, productId));

  if (specs.length > 0) {
    await db.insert(productSpecifications).values(
      specs.map((s, i) => ({
        productId,
        groupName: s.groupName || null,
        key: s.key,
        value: s.value,
        sortOrder: s.sortOrder ?? i,
      }))
    );
  }

  await appendAuditLog("PRODUCT_SPECIFICATIONS_UPDATED", {
    actorUserId: user.id,
    entityType: "PRODUCT",
    entityId: productId,
    metadata: { specCount: specs.length },
  });
}

export async function getProductSpecifications(productId: string) {
  return db.select().from(productSpecifications)
    .where(eq(productSpecifications.productId, productId))
    .orderBy(productSpecifications.sortOrder);
}

export async function getProductImages(productId: string) {
  return db.select().from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(productImages.sortOrder);
}

// ─── Admin List Queries ─────────────────────────────────

export async function getCategoriesAdmin() {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  return db.select().from(categories).orderBy(categories.sortOrder, categories.name);
}

export async function getBrandsAdmin() {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  return db.select().from(brands).orderBy(brands.sortOrder, brands.name);
}

export async function getProductsAdmin() {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  return db.select().from(products).orderBy(desc(products.createdAt));
}

export async function getProductById(id: string) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  const [product] = await db.select().from(products).where(eq(products.id, id));
  return product || null;
}
