import { mkdir, writeFile, unlink } from "fs/promises";
import { join } from "path";
import { db } from "../../../db";
import { productImages } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { requireRole } from "../../auth/authorization";
import { appendAuditLog } from "../../auth/audit";
import {
  validateImageUpload,
  validateMagicBytesFromBuffer,
  generateSafeFilename,
  type AllowedMimeType
} from "./image-validation";

function getUploadDir(): string {
  return process.env.UPLOAD_DIR || "./uploads";
}

function getProductImageDir(productId: string): string {
  return join(getUploadDir(), "products", productId);
}

export async function uploadProductImage(
  productId: string,
  file: File,
  options?: { altText?: string; isPrimary?: boolean }
) {
  const { user } = await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);

  // Validate file metadata
  const validation = validateImageUpload({
    name: file.name,
    size: file.size,
    type: file.type,
  });

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const mimeType = file.type as AllowedMimeType;

  // Read file bytes and validate magic bytes
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (!validateMagicBytesFromBuffer(buffer, mimeType)) {
    throw new Error("File content does not match declared MIME type");
  }

  // Generate safe filename and write to disk
  const safeFilename = generateSafeFilename(file.name, mimeType);
  const productDir = getProductImageDir(productId);
  await mkdir(productDir, { recursive: true });
  const filePath = join(productDir, safeFilename);
  await writeFile(filePath, buffer);

  // Get current max sort order
  const existingImages = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId));
  const nextSortOrder = existingImages.length;

  // If this is primary, unset other primaries
  if (options?.isPrimary) {
    await db
      .update(productImages)
      .set({ isPrimary: false })
      .where(eq(productImages.productId, productId));
  }

  // Persist metadata
  const [image] = await db
    .insert(productImages)
    .values({
      productId,
      storageKey: `products/${productId}/${safeFilename}`,
      altText: options?.altText || null,
      sortOrder: nextSortOrder,
      isPrimary: options?.isPrimary ?? existingImages.length === 0,
      mimeType,
      fileSize: file.size,
    })
    .returning();

  await appendAuditLog("PRODUCT_IMAGE_UPLOADED", {
    actorUserId: user.id,
    entityType: "PRODUCT_IMAGE",
    entityId: image.id,
    metadata: { productId, mimeType, fileSize: file.size },
  });

  return image;
}

export async function deleteProductImage(imageId: string) {
  const { user } = await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);

  const [image] = await db
    .select()
    .from(productImages)
    .where(eq(productImages.id, imageId));

  if (!image) {
    throw new Error("Image not found");
  }

  // Delete file from disk
  const filePath = join(/*turbopackIgnore: true*/ getUploadDir(), image.storageKey);
  try {
    await unlink(filePath);
  } catch {
    // File might already be gone; log but continue
    console.warn(`Could not delete file ${filePath}`);
  }

  // Delete from DB
  await db.delete(productImages).where(eq(productImages.id, imageId));

  await appendAuditLog("PRODUCT_IMAGE_DELETED", {
    actorUserId: user.id,
    entityType: "PRODUCT_IMAGE",
    entityId: imageId,
    metadata: { productId: image.productId, storageKey: image.storageKey },
  });
}

export async function updateImageOrder(
  productId: string,
  imageIds: string[]
) {
  const { user } = await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);

  for (let i = 0; i < imageIds.length; i++) {
    await db
      .update(productImages)
      .set({ sortOrder: i })
      .where(
        and(
          eq(productImages.id, imageIds[i]),
          eq(productImages.productId, productId)
        )
      );
  }

  await appendAuditLog("PRODUCT_IMAGES_REORDERED", {
    actorUserId: user.id,
    entityType: "PRODUCT",
    entityId: productId,
    metadata: { imageCount: imageIds.length },
  });
}

export async function updateImageMetadata(
  imageId: string,
  productId: string,
  data: { altText?: string | null; sortOrder?: number }
) {
  const { user } = await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);

  const [image] = await db
    .update(productImages)
    .set({
      altText: data.altText,
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
    })
    .where(and(eq(productImages.id, imageId), eq(productImages.productId, productId)))
    .returning();

  if (!image) throw new Error("Image not found");

  await appendAuditLog("PRODUCT_IMAGE_METADATA_UPDATED", {
    actorUserId: user.id,
    entityType: "PRODUCT_IMAGE",
    entityId: imageId,
    metadata: { productId, changedKeys: Object.keys(data) },
  });

  return image;
}

export async function setPrimaryImage(imageId: string, productId: string) {
  const { user } = await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);

  // Unset current primary
  await db
    .update(productImages)
    .set({ isPrimary: false })
    .where(eq(productImages.productId, productId));

  // Set new primary
  await db
    .update(productImages)
    .set({ isPrimary: true })
    .where(
      and(eq(productImages.id, imageId), eq(productImages.productId, productId))
    );

  await appendAuditLog("PRODUCT_IMAGE_PRIMARY_SET", {
    actorUserId: user.id,
    entityType: "PRODUCT_IMAGE",
    entityId: imageId,
    metadata: { productId },
  });
}
