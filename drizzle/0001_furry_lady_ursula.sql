DROP INDEX "auth_rate_limits_email_idx";--> statement-breakpoint
DROP INDEX "auth_rate_limits_ip_hash_idx";--> statement-breakpoint
ALTER TABLE "auth_rate_limits" DROP COLUMN "ip_hash";--> statement-breakpoint
ALTER TABLE "auth_rate_limits" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_code_check" CHECK ("roles"."code" IN ('SUPER_ADMIN', 'INVENTORY_ADMIN', 'PRODUCT_SALES_ADMIN'));--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_lower_check" CHECK ("users"."email" = lower("users"."email"));