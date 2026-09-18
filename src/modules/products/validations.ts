import { z } from "zod";
import { PRODUCT_STATUSES, TRACKING_MODES } from "./db/schema";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().max(2000).nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const brandSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().max(2000).nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const productSpecSchema = z.object({
  id: z.string().uuid().optional(),
  groupName: z.string().max(255).nullable().optional(),
  key: z.string().min(1).max(255),
  value: z.string().min(1).max(1000),
  sortOrder: z.number().int().default(0),
});

export const productImageSchema = z.object({
  id: z.string().uuid().optional(),
  storageKey: z.string().min(1).max(500),
  altText: z.string().max(500).nullable().optional(),
  sortOrder: z.number().int().default(0),
  isPrimary: z.boolean().default(false),
  mimeType: z.string().max(100),
  fileSize: z.number().int().min(0),
});

export const productSchema = z.object({
  sku: z.string().min(1, "SKU is required").max(100),
  slug: z.string().min(1, "Slug is required").max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  name: z.string().min(1, "Name is required").max(255),
  shortDescription: z.string().max(1000).nullable().optional(),
  description: z.string().max(10000).nullable().optional(),
  categoryId: z.string().uuid("Invalid category ID"),
  brandId: z.string().uuid("Invalid brand ID"),
  publicPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").nullable().optional(),
  status: z.enum(PRODUCT_STATUSES).default("DRAFT"),
  trackingMode: z.enum(TRACKING_MODES).default("QUANTITY"),
  isFeatured: z.boolean().default(false),
  specifications: z.array(productSpecSchema).optional(),
  images: z.array(productImageSchema).optional(),
});

/** Validation for publishing — requires mandatory fields */
export const publishValidation = z.object({
  name: z.string().min(1, "Name is required to publish"),
  sku: z.string().min(1, "SKU is required to publish"),
  categoryId: z.string().uuid("Category is required to publish"),
  brandId: z.string().uuid("Brand is required to publish"),
  slug: z.string().min(1, "Slug is required to publish"),
});

// Safe public DTOs — NEVER expose internal data
export type PublicCategoryDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type PublicBrandDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

/** Public image DTO — storageKey is NEVER exposed */
export type PublicImageDTO = {
  url: string;
  altText: string | null;
  isPrimary: boolean;
};

export type PublicProductDTO = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  publicPrice: string | null;
  isFeatured: boolean;
  category: PublicCategoryDTO;
  brand: PublicBrandDTO;
  images: PublicImageDTO[];
  specifications: Array<{
    groupName: string | null;
    key: string;
    value: string;
  }>;
};

export type CatalogSort = "default" | "newest" | "name-az" | "price-low" | "price-high";

export type CatalogFilters = {
  search?: string;
  categorySlug?: string;
  brandSlug?: string;
  sort?: CatalogSort;
  page?: number;
  pageSize?: number;
};

/** Convert internal storageKey to safe public URL */
export function storageKeyToPublicUrl(storageKey: string): string {
  return `/api/media/${storageKey}`;
}

/** Generate slug from name */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
