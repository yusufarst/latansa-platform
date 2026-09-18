import { describe, it, expect } from "vitest";
import { productSchema, publishValidation, generateSlug } from "./validations";

describe("Product Validations", () => {
  it("validates valid product payload", () => {
    const payload = {
      name: "Test Product",
      sku: "TEST-01",
      slug: "test-product",
      categoryId: "123e4567-e89b-12d3-a456-426614174000",
      brandId: "123e4567-e89b-12d3-a456-426614174001",
      publicPrice: "10000",
    };
    const result = productSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("fails when slug format is invalid", () => {
    const payload = {
      name: "Test Product",
      sku: "TEST-01",
      slug: "test_product-invalid!",
      categoryId: "123e4567-e89b-12d3-a456-426614174000",
      brandId: "123e4567-e89b-12d3-a456-426614174001",
    };
    const result = productSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success && result.error?.issues?.length > 0) {
      expect(result.error.issues[0].message).toBe("Invalid slug format");
    }
  });

  it("enforces mandatory fields on publish validation", () => {
    const result = publishValidation.safeParse({ name: "Only Name" });
    expect(result.success).toBe(false);
  });

  it("generateSlug converts strings to valid slugs safely", () => {
    expect(generateSlug("  My Awesome Product ! 2024  ")).toBe("my-awesome-product-2024");
    expect(generateSlug("Invalid_Chars*&^$")).toBe("invalidchars");
  });
});
