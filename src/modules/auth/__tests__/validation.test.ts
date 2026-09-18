import { describe, it, expect } from "vitest";
import { loginSchema } from "../validation";

describe("Validation", () => {
  it("valid login input", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("test@example.com");
    }
  });

  it("normalizes email", () => {
    const result = loginSchema.safeParse({
      email: "  Test@EXAMPLE.com  ",
      password: "password123",
    });
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("test@example.com");
    }
  });

  it("invalid email fails", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    
    expect(result.success).toBe(false);
  });

  it("missing password fails", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "",
    });
    
    expect(result.success).toBe(false);
  });
});
