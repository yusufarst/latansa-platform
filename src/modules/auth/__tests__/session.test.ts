import { describe, it, expect, vi } from "vitest";
import { generateSessionToken, hashSessionToken, getCookieConfig } from "../session";

// Mock env so hashing has a consistent secret
vi.mock("@/config/env", () => ({
  env: {
    SESSION_SECRET: "test-secret-key-1234567890123456",
  },
}));

describe("Session Crypto", () => {
  it("generated tokens are nontrivial/random", () => {
    const token1 = generateSessionToken();
    const token2 = generateSessionToken();
    
    expect(token1).toBeDefined();
    expect(token2).toBeDefined();
    expect(token1.length).toBeGreaterThan(30); // 32 bytes hex = 64 chars
    expect(token1).not.toBe(token2);
  });

  it("same token hashes consistently", () => {
    const token = generateSessionToken();
    const hash1 = hashSessionToken(token);
    const hash2 = hashSessionToken(token);
    
    expect(hash1).toBe(hash2);
  });

  it("different tokens hash differently", () => {
    const token1 = generateSessionToken();
    const token2 = generateSessionToken();
    const hash1 = hashSessionToken(token1);
    const hash2 = hashSessionToken(token2);
    
    expect(hash1).not.toBe(hash2);
  });

  it("raw session token is not the stored token hash", () => {
    const token = generateSessionToken();
    const hash = hashSessionToken(token);
    
    expect(token).not.toBe(hash);
  });
});

describe("Session Cookie Policy", () => {
  it("uses standard secure defaults", () => {
    const config = getCookieConfig();
    expect(config.httpOnly).toBe(true);
    expect(config.sameSite).toBe("lax");
    expect(config.path).toBe("/");
    expect(config.secure).toBe(process.env.NODE_ENV === "production");
  });

  it("sets correct expiration when provided", () => {
    const expiresAt = new Date();
    const config = getCookieConfig(expiresAt) as any;
    expect(config.expires).toBe(expiresAt);
    expect(config.maxAge).toBeUndefined();
  });

  it("sets maxAge 0 when clearing cookie (no expiration provided)", () => {
    const config = getCookieConfig() as any;
    expect(config.maxAge).toBe(0);
    expect(config.expires).toBeUndefined();
  });
});
