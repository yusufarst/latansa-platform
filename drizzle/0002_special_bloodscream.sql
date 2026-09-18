ALTER TABLE "auth_rate_limits" ADD COLUMN "scope" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_rate_limits" ADD COLUMN "key_hash" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_rate_limits" ADD COLUMN "window_started_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX "auth_rate_limits_key_hash_idx" ON "auth_rate_limits" USING btree ("key_hash");--> statement-breakpoint
ALTER TABLE "auth_rate_limits" ADD CONSTRAINT "auth_rate_limits_key_hash_unique" UNIQUE("key_hash");