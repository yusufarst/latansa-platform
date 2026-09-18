import { pgTable, varchar, text, timestamp, boolean, uuid, numeric, integer, jsonb, index, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const PRODUCT_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type ProductStatus = typeof PRODUCT_STATUSES[number];

export const TRACKING_MODES = ["QUANTITY", "SERIALIZED"] as const;
export type TrackingMode = typeof TRACKING_MODES[number];

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  shortDescription: text("short_description"),
  description: text("description"),
  categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: 'restrict' }),
  brandId: uuid("brand_id").notNull().references(() => brands.id, { onDelete: 'restrict' }),
  publicPrice: numeric("public_price", { precision: 12, scale: 2 }),
  status: varchar("status", { length: 50 }).default('DRAFT').notNull(),
  trackingMode: varchar("tracking_mode", { length: 50 }).default('QUANTITY').notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
}, (table) => {
  return {
    statusCheck: check("products_status_check", sql`${table.status} IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')`),
    trackingModeCheck: check("products_tracking_mode_check", sql`${table.trackingMode} IN ('QUANTITY', 'SERIALIZED')`),
    slugIdx: index("products_slug_idx").on(table.slug),
    skuIdx: index("products_sku_idx").on(table.sku),
    statusIdx: index("products_status_idx").on(table.status),
    categoryIdx: index("products_category_id_idx").on(table.categoryId),
    brandIdx: index("products_brand_id_idx").on(table.brandId),
    featuredIdx: index("products_is_featured_idx").on(table.isFeatured),
  };
});

export const productSpecifications = pgTable("product_specifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
  groupName: varchar("group_name", { length: 255 }),
  key: varchar("key", { length: 255 }).notNull(),
  value: varchar("value", { length: 1000 }).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    productIdx: index("product_specs_product_id_idx").on(table.productId),
    keyIdx: index("product_specs_key_idx").on(table.key),
  };
});

export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
  storageKey: varchar("storage_key", { length: 500 }).notNull(),
  altText: varchar("alt_text", { length: 500 }),
  sortOrder: integer("sort_order").default(0).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  fileSize: integer("file_size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    productIdx: index("product_images_product_id_idx").on(table.productId),
  };
});

export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventName: varchar("event_name", { length: 255 }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: 'set null' }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    eventIdx: index("analytics_events_name_idx").on(table.eventName),
    productIdx: index("analytics_events_product_id_idx").on(table.productId),
    createdIdx: index("analytics_events_created_at_idx").on(table.createdAt),
  };
});
