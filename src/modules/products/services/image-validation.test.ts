import { describe, it, expect } from "vitest";
import { validateImageUpload, validateMagicBytesFromBuffer } from "./image-validation";

describe("Image Validation Security", () => {
  it("rejects path traversal attempts in filenames", () => {
    const maliciousFile = {
      name: "../../../etc/passwd.png",
      size: 1024,
      type: "image/png"
    };
    const result = validateImageUpload(maliciousFile);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe("Invalid filename");
    }
  });

  it("rejects non-image MIME types", () => {
    const maliciousFile = {
      name: "test.pdf",
      size: 1024,
      type: "application/pdf"
    };
    const result = validateImageUpload(maliciousFile);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toContain("is not allowed");
    }
  });

  it("rejects dangerous file extensions disguised as images", () => {
    const maliciousFile = {
      name: "script.js.png.php",
      size: 1024,
      type: "image/png"
    };
    const result = validateImageUpload(maliciousFile);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe("File extension is not allowed");
    }
  });

  it("rejects files that are too large", () => {
    const oversizedFile = {
      name: "large.png",
      size: 10 * 1024 * 1024, // 10MB
      type: "image/png"
    };
    const result = validateImageUpload(oversizedFile);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toContain("File size exceeds maximum allowed");
    }
  });

  it("validates valid image metadata", () => {
    const validFile = {
      name: "product-image.png",
      size: 1024,
      type: "image/png"
    };
    const result = validateImageUpload(validFile);
    expect(result.valid).toBe(true);
  });

  it("validates JPEG magic bytes correctly", () => {
    // Valid JPEG header
    const validBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]);
    expect(validateMagicBytesFromBuffer(validBuffer, "image/jpeg")).toBe(true);

    // Invalid header
    const invalidBuffer = Buffer.from([0x00, 0x00, 0x00, 0x00]);
    expect(validateMagicBytesFromBuffer(invalidBuffer, "image/jpeg")).toBe(false);
  });
});
