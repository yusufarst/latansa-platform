import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { db } from "@/db";
import { productImages, products } from "@/modules/products/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const p = await params;
  const pathParts = p.path || [];
  
  if (pathParts.length !== 2) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const [productId, filename] = pathParts;
  const storageKey = `products/${productId}/${filename}`;

  try {
    // Security 1: Verify the image actually belongs to the product in DB
    const [image] = await db
      .select({ id: productImages.id, mimeType: productImages.mimeType })
      .from(productImages)
      .where(eq(productImages.storageKey, storageKey));

    if (!image) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Security 2: Ensure the product is PUBLISHED (don't leak drafts)
    const [product] = await db
      .select({ status: products.status })
      .from(products)
      .where(eq(products.id, productId));

    if (!product || product.status !== "PUBLISHED") {
      // If we are authenticated as SUPER_ADMIN or PRODUCT_SALES_ADMIN, we should probably allow viewing drafts.
      // For simplicity in this secure public endpoint, we deny access unless it's published.
      // (An internal endpoint could be created for previews if needed).
      return new NextResponse("Forbidden - Draft Product", { status: 403 });
    }

    // Security 3: Path traversal protection (preventing '..' in filename)
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
        return new NextResponse("Bad Request", { status: 400 });
    }

    // Serve the file
    const uploadDir = process.env.UPLOAD_DIR || "./uploads";
    const filePath = join(uploadDir, storageKey);
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": image.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving media:", error);
    return new NextResponse("Not Found", { status: 404 });
  }
}
