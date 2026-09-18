import { NextRequest, NextResponse } from "next/server";
import { isProductPublished, recordWhatsAppClickEvent } from "@/modules/products/services/public";
import { env } from "@/config/env";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const productInfo = await isProductPublished(slug);

  if (!productInfo.published || !productInfo.productId) {
    return new NextResponse("Product not found or not published", { status: 404 });
  }

  const rawNumber = env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!rawNumber) {
    return new NextResponse("WhatsApp contact not configured", { status: 503 });
  }
  
  const number = rawNumber.replace(/\D/g, "");
  if (!number) {
    return new NextResponse("WhatsApp contact invalid", { status: 503 });
  }

  try {
    await recordWhatsAppClickEvent(productInfo.productId, { source: "whatsapp_redirect_route" });
  } catch (e) {
    console.error("Failed to record WA event:", e);
  }

  const message = `Halo LATANSA JOGJAKARTA,\nsaya tertarik dengan ${productInfo.productName} (${productInfo.sku}).\nMohon informasi harga dan ketersediaannya.`;

  const waUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  
  return NextResponse.redirect(waUrl, 303);
}
