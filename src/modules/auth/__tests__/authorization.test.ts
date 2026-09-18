import { describe, it, expect, vi } from "vitest";
import { requireRole } from "../authorization";

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
    expect(mockRedirect).toHaveBeenCalledWith("/internal?error=access_denied");
  });

  it("PRODUCT_SALES_ADMIN allowed products, denied inventory", async () => {
    mockRoleCode = "PRODUCT_SALES_ADMIN";
    mockRedirect.mockClear();
    
    await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
    expect(mockRedirect).not.toHaveBeenCalled();
    
    await requireRole(["SUPER_ADMIN", "INVENTORY_ADMIN"]);
    expect(mockRedirect).toHaveBeenCalledWith("/internal?error=access_denied");
  });
});
