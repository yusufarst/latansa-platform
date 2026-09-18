import { NextRequest, NextResponse } from "next/server";
import { isProductPublished, recordWhatsAppClickEvent } from "@/modules/products/services/public";
import { env } from "@/config/env";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const productInfo = await isProductPublished(slug);

  if (productInfo.published && productInfo.productId) {
    try {
      await recordWhatsAppClickEvent(productInfo.productId, { source: "whatsapp_redirect_route" });
    } catch (e) {
      console.error("Failed to record WA event:", e);
    }
  }

  const number = env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1234567890";
  let message = `Hello, I am interested in ${productInfo.productName || slug}.`;
  
  if (productInfo.published) {
     message = `Hello, I am interested in your product: ${productInfo.productName} (https://${request.headers.get('host')}/products/${slug})`;
  }

  const waUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  
  return NextResponse.redirect(waUrl, 303);
}
