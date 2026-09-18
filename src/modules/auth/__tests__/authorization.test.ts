import { describe, it, expect, vi } from "vitest";
import { requireRole } from "../authorization";
import { getSafeRedirectUrl } from "../utils";
import { ROLE_CODES } from "../db/schema";

// Mock Next.js Navigation
const mockRedirect = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (url: string) => mockRedirect(url),
}));

// Mock Database and Session
let mockRoleCode = "SUPER_ADMIN";
const mockSessionUser = { id: "user-1", email: "test@example.com", roleId: "role-1", isActive: true };

vi.mock("../session", () => ({
  validateSession: vi.fn().mockImplementation(() => {
    return { session: { id: "session-1" }, user: mockSessionUser };
  })
}));

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: (name: string) => ({ value: "fake-token" }),
    has: (name: string) => true,
  })
}));

vi.mock("@/db", () => ({
  db: {
    query: {
      roles: {
        findFirst: vi.fn().mockImplementation(async () => {
          return { id: "role-1", code: mockRoleCode };
        })
      }
    }
  }
}));

// We also need to mock requireUser inside authorization since we just care about requireRole
// But requireUser is defined in the same file. It will use the mocked validateSession.

describe("RBAC Authorization", () => {
  it("SUPER_ADMIN authorized for both proof domains", async () => {
    mockRoleCode = "SUPER_ADMIN";
    mockRedirect.mockClear();
    
    await requireRole(["SUPER_ADMIN", "INVENTORY_ADMIN"]);
    expect(mockRedirect).not.toHaveBeenCalled();
    
    await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("INVENTORY_ADMIN allowed inventory, denied products", async () => {
    mockRoleCode = "INVENTORY_ADMIN";
    mockRedirect.mockClear();
    
    await requireRole(["SUPER_ADMIN", "INVENTORY_ADMIN"]);
    expect(mockRedirect).not.toHaveBeenCalled();
    
    await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
    expect(mockRedirect).toHaveBeenCalledWith("/internal/access-denied");
  });

  it("PRODUCT_SALES_ADMIN allowed products, denied inventory", async () => {
    mockRoleCode = "PRODUCT_SALES_ADMIN";
    mockRedirect.mockClear();
    
    await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
    expect(mockRedirect).not.toHaveBeenCalled();
    
    await requireRole(["SUPER_ADMIN", "INVENTORY_ADMIN"]);
    expect(mockRedirect).toHaveBeenCalledWith("/internal/access-denied");
  });
});

describe("Safe Redirect", () => {
  it("allows internal paths", () => {
    expect(getSafeRedirectUrl("/internal/products")).toBe("/internal/products");
    expect(getSafeRedirectUrl("/internal")).toBe("/internal");
  });

  it("rejects external or malformed paths and falls back to /internal", () => {
    expect(getSafeRedirectUrl("https://evil.com")).toBe("/internal");
    expect(getSafeRedirectUrl("//evil.com")).toBe("/internal");
    expect(getSafeRedirectUrl("javascript:alert(1)")).toBe("/internal");
    expect(getSafeRedirectUrl("/external")).toBe("/internal");
    expect(getSafeRedirectUrl(null)).toBe("/internal");
  });
});

describe("Role Invariants", () => {
  it("has exactly three canonical roles", () => {
    expect(ROLE_CODES).toHaveLength(3);
    expect(ROLE_CODES).toContain("SUPER_ADMIN");
    expect(ROLE_CODES).toContain("INVENTORY_ADMIN");
    expect(ROLE_CODES).toContain("PRODUCT_SALES_ADMIN");
    expect((ROLE_CODES as readonly string[]).includes("PUBLIC")).toBe(false);
  });
});
