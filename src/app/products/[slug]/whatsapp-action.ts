"use server";

import { recordWhatsAppClickEvent } from "@/modules/products/services/public";

export async function logWhatsAppClick(productId: string) {
  try {
    await recordWhatsAppClickEvent(productId, { source: "product_detail_page" });
  } catch (error) {
    console.error("Failed to log WhatsApp click:", error);
  }
}
