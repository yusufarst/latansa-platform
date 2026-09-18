import { NextRequest, NextResponse } from "next/server";
import { recordWhatsAppClickEvent } from "@/modules/products/services/public";
import { env } from "@/config/env";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const productId = formData.get("productId") as string;
  const productName = formData.get("productName") as string;

  if (productId) {
    try {
      await recordWhatsAppClickEvent(productId);
    } catch (e) {
      console.error("Failed to record WA event:", e);
    }
  }

  const number = env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1234567890";
  const message = `Hello, I am interested in ${productName || 'a product'}.`;
  
  const waUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  
  return NextResponse.redirect(waUrl, 303);
}
