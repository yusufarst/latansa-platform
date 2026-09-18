import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// This is a minimal schema foundation for users/sessions
// It will be expanded in the upcoming Authentication phase

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('PUBLIC'), // SUPER_ADMIN, INVENTORY_ADMIN, PRODUCT_SALES_ADMIN, PUBLIC
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
