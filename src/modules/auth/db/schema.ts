import { pgTable, varchar, timestamp, boolean, uuid, jsonb, integer, index, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const ROLE_CODES = ["SUPER_ADMIN", "INVENTORY_ADMIN", "PRODUCT_SALES_ADMIN"] as const;
export type RoleCode = typeof ROLE_CODES[number];

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(), // SUPER_ADMIN, INVENTORY_ADMIN, PRODUCT_SALES_ADMIN
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  codeCheck: check("roles_code_check", sql`${table.code} IN ('SUPER_ADMIN', 'INVENTORY_ADMIN', 'PRODUCT_SALES_ADMIN')`),
}));

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  roleId: uuid("role_id").notNull().references(() => roles.id),
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  emailLowerCheck: check("users_email_lower_check", sql`${table.email} = lower(${table.email})`),
}));

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  tokenHash: varchar("token_hash", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  lastSeenAt: timestamp("last_seen_at"),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const authRateLimits = pgTable("auth_rate_limits", {
  id: uuid("id").primaryKey().defaultRandom(),
  scope: varchar("scope", { length: 50 }).notNull(), // 'IP' or 'EMAIL'
  keyHash: varchar("key_hash", { length: 255 }).notNull().unique(), // Hashed IP or Email
  attempts: integer("attempts").default(0).notNull(),
  windowStartedAt: timestamp("window_started_at").defaultNow().notNull(),
  blockedUntil: timestamp("blocked_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    keyHashIdx: index("auth_rate_limits_key_hash_idx").on(table.keyHash),
  };
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorUserId: uuid("actor_user_id").references(() => users.id), // nullable for unauthenticated events
  action: varchar("action", { length: 255 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }), // e.g. "USER", "SESSION", "INVENTORY"
  entityId: varchar("entity_id", { length: 255 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
