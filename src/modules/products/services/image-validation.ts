import { readFile } from "fs/promises";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export type AllowedMimeType = typeof ALLOWED_MIME_TYPES[number];

const MAGIC_BYTES: Record<AllowedMimeType, number[][]> = {
  "image/jpeg": [[0xFF, 0xD8, 0xFF]],
  "image/png": [[0x89, 0x50, 0x4E, 0x47]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF header; "WEBP" at offset 8
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function isAllowedMimeType(mime: string): mime is AllowedMimeType {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mime);
}

export function validateFileSize(size: number): boolean {
  return size > 0 && size <= MAX_FILE_SIZE;
}

export function generateSafeFilename(originalName: string, mimeType: AllowedMimeType): string {
  const ext = mimeType === "image/jpeg" ? ".jpg" : mimeType === "image/png" ? ".png" : ".webp";
  const id = crypto.randomUUID();
  return `${id}${ext}`;
}

export function containsPathTraversal(filename: string): boolean {
  return filename.includes("..") || filename.includes("/") || filename.includes("\\") || filename.includes("\0");
}

export async function validateMagicBytes(filePath: string, declaredMime: AllowedMimeType): Promise<boolean> {
  const buffer = await readFile(filePath);
  const signatures = MAGIC_BYTES[declaredMime];
  if (!signatures) return false;

  return signatures.some(sig =>
    sig.every((byte, i) => buffer[i] === byte)
  );
}

export function validateMagicBytesFromBuffer(buffer: Buffer, declaredMime: AllowedMimeType): boolean {
  const signatures = MAGIC_BYTES[declaredMime];
  if (!signatures) return false;

  if (declaredMime === "image/webp") {
    // Also check for "WEBP" at offset 8
    const riffMatch = signatures[0].every((byte, i) => buffer[i] === byte);
    const webpMatch = buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
    return riffMatch && webpMatch;
  }

  return signatures.some(sig =>
    sig.every((byte, i) => buffer[i] === byte)
  );
}

export type ImageValidationResult =
  | { valid: true }
  | { valid: false; error: string };

export function validateImageUpload(
  file: { name: string; size: number; type: string },
): ImageValidationResult {
  if (!file.name || !file.size || !file.type) {
    return { valid: false, error: "Missing file information" };
  }

  if (!isAllowedMimeType(file.type)) {
    return { valid: false, error: `File type '${file.type}' is not allowed. Only JPEG, PNG, and WEBP are accepted.` };
  }

  if (!validateFileSize(file.size)) {
    return { valid: false, error: `File size exceeds maximum allowed (5MB). Got ${(file.size / 1024 / 1024).toFixed(1)}MB.` };
  }

  if (containsPathTraversal(file.name)) {
    return { valid: false, error: "Invalid filename" };
  }

  // Reject dangerous extensions regardless of declared MIME
  const lowerName = file.name.toLowerCase();
  const dangerousExts = [".svg", ".html", ".htm", ".js", ".ts", ".exe", ".bat", ".cmd", ".sh", ".php", ".py"];
  if (dangerousExts.some(ext => lowerName.endsWith(ext))) {
    return { valid: false, error: "File extension is not allowed" };
  }

  return { valid: true };
}

export { ALLOWED_MIME_TYPES, MAX_FILE_SIZE };
