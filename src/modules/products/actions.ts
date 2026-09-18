"use server";

import { requireRole } from "../auth/authorization";
import {
  createCategory, updateCategory,
  createBrand, updateBrand,
  createProductWithSpecs, updateProductWithSpecs,
  publishProduct, archiveProduct, unpublishProduct,
} from "./services/internal";
import { categorySchema, brandSchema, productSchema, productSpecSchema } from "./validations";
import { uploadProductImage, deleteProductImage, setPrimaryImage } from "./services/images";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// ─── Category Actions ───────────────────────────────────

export async function createCategoryAction(_prev: unknown, formData: FormData) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);

  const rawData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || null,
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  };

  try {
    const parsed = categorySchema.parse(rawData);
    await createCategory(parsed);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create category" };
  }

  revalidatePath("/internal/products/categories");
  redirect("/internal/products/categories");
}

export async function updateCategoryAction(_prev: unknown, formData: FormData) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  const id = formData.get("id") as string;

  const rawData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || null,
    isActive: formData.get("isActive") === "true",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  };

  try {
    const parsed = categorySchema.parse(rawData);
    await updateCategory(id, parsed);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update category" };
  }

  revalidatePath("/internal/products/categories");
  redirect("/internal/products/categories");
}

// ─── Brand Actions ──────────────────────────────────────

export async function createBrandAction(_prev: unknown, formData: FormData) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);

  const rawData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || null,
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  };

  try {
    const parsed = brandSchema.parse(rawData);
    await createBrand(parsed);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create brand" };
  }

  revalidatePath("/internal/products/brands");
  redirect("/internal/products/brands");
}

export async function updateBrandAction(_prev: unknown, formData: FormData) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  const id = formData.get("id") as string;

  const rawData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || null,
    isActive: formData.get("isActive") === "true",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  };

  try {
    const parsed = brandSchema.parse(rawData);
    await updateBrand(id, parsed);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update brand" };
  }

  revalidatePath("/internal/products/brands");
  redirect("/internal/products/brands");
}

// ─── Product Actions ────────────────────────────────────

export async function createProductAction(_prev: unknown, formData: FormData) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);

  const rawData = {
    name: formData.get("name") as string,
    sku: formData.get("sku") as string,
    slug: formData.get("slug") as string,
    categoryId: formData.get("categoryId") as string,
    brandId: formData.get("brandId") as string,
    publicPrice: (formData.get("publicPrice") as string) || null,
    shortDescription: (formData.get("shortDescription") as string) || null,
    description: (formData.get("description") as string) || null,
    trackingMode: (formData.get("trackingMode") as string) || "QUANTITY",
    isFeatured: formData.get("isFeatured") === "true",
  };

  const specsJson = formData.get("specifications") as string;
  let parsedSpecs: z.infer<typeof productSpecSchema>[] = [];
  if (specsJson) {
    try {
      const rawSpecs = JSON.parse(specsJson);
      parsedSpecs = z.array(productSpecSchema).parse(rawSpecs);
    } catch {
      return { error: "Invalid specifications data provided." };
    }
  }

  let productId: string;
  try {
    const parsedProduct = productSchema.parse({ ...rawData, status: "DRAFT" });
    const product = await createProductWithSpecs(parsedProduct, parsedSpecs);
    productId = product.id;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create product" };
  }

  revalidatePath("/internal/products");
  redirect(`/internal/products/${productId}`);
}

export async function updateProductAction(_prev: unknown, formData: FormData) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  const id = formData.get("id") as string;

  const rawData = {
    name: formData.get("name") as string,
    sku: formData.get("sku") as string,
    slug: formData.get("slug") as string,
    categoryId: formData.get("categoryId") as string,
    brandId: formData.get("brandId") as string,
    publicPrice: (formData.get("publicPrice") as string) || null,
    shortDescription: (formData.get("shortDescription") as string) || null,
    description: (formData.get("description") as string) || null,
    trackingMode: (formData.get("trackingMode") as string) || "QUANTITY",
    isFeatured: formData.get("isFeatured") === "true",
  };

  const specsJson = formData.get("specifications") as string;
  let parsedSpecs: z.infer<typeof productSpecSchema>[] | undefined = undefined;
  if (specsJson) {
    try {
      const rawSpecs = JSON.parse(specsJson);
      parsedSpecs = z.array(productSpecSchema).parse(rawSpecs);
    } catch {
      return { error: "Invalid specifications data provided." };
    }
  }

  try {
    // We parse the rawData as partial for update, or just use the same schema without status
    const parsedProduct = productSchema.omit({ status: true }).parse(rawData);
    await updateProductWithSpecs(id, parsedProduct, parsedSpecs);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update product" };
  }

  revalidatePath("/internal/products");
  revalidatePath(`/internal/products/${id}`);
  return { success: true };
}

export async function publishProductAction(id: string) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  try {
    await publishProduct(id);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to publish" };
  }
  revalidatePath("/internal/products");
  revalidatePath(`/internal/products/${id}`);
  return { success: true };
}

export async function archiveProductAction(id: string) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  try {
    await archiveProduct(id);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to archive" };
  }
  revalidatePath("/internal/products");
  revalidatePath(`/internal/products/${id}`);
  return { success: true };
}

export async function unpublishProductAction(id: string) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  try {
    await unpublishProduct(id);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to unpublish" };
  }
  revalidatePath("/internal/products");
  revalidatePath(`/internal/products/${id}`);
  return { success: true };
}

// ─── Image Actions ──────────────────────────────────────

export async function uploadImageAction(productId: string, formData: FormData) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  const file = formData.get("file") as File;
  const altText = (formData.get("altText") as string) || undefined;

  if (!file) return { error: "No file provided" };

  try {
    await uploadProductImage(productId, file, { altText });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload failed" };
  }

  revalidatePath(`/internal/products/${productId}`);
  return { success: true };
}

export async function deleteImageAction(imageId: string, productId: string) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  try {
    await deleteProductImage(imageId);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Delete failed" };
  }
  revalidatePath(`/internal/products/${productId}`);
  return { success: true };
}

export async function setPrimaryImageAction(imageId: string, productId: string) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  try {
    await setPrimaryImage(imageId, productId);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to set primary" };
  }
  revalidatePath(`/internal/products/${productId}`);
  return { success: true };
}

export async function updateImageMetadataAction(imageId: string, productId: string, data: { altText?: string | null }) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  const { updateImageMetadata } = await import("./services/images");
  try {
    await updateImageMetadata(imageId, productId, data);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update image" };
  }
  revalidatePath(`/internal/products/${productId}`);
  return { success: true };
}

export async function updateImageOrderAction(productId: string, imageIds: string[]) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  const { updateImageOrder } = await import("./services/images");
  try {
    await updateImageOrder(productId, imageIds);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to reorder images" };
  }
  revalidatePath(`/internal/products/${productId}`);
  return { success: true };
}

// ─── Helpers ────────────────────────────────────────────
