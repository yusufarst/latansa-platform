import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../password";

describe("Password Hashing", () => {
  it("hash does not equal plaintext", async () => {
    const password = "mySecretPassword123!";
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    expect(hash).toBeDefined();
    expect(hash.length).toBeGreaterThan(10);
  });

  it("valid password verifies", async () => {
    const password = "mySecretPassword123!";
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it("invalid password fails", async () => {
    const password = "mySecretPassword123!";
    const hash = await hashPassword(password);
    const isValid = await verifyPassword("wrongPassword", hash);
    expect(isValid).toBe(false);
  });
});
