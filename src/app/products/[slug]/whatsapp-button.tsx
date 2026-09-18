"use client";

import { useTransition } from "react";
import { logWhatsAppClick } from "./whatsapp-action";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WhatsAppButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // Fire and forget server action to log the click
    startTransition(() => {
      logWhatsAppClick(productId);
    });

    // Prepare message and redirect to WhatsApp
    const message = `Hello LATANSA, I am interested in your product: ${productName}. Could you provide more information?`;
    const phoneNumber = "628111111111"; // Placeholder company WA number
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(waUrl, "_blank");
  };

  return (
    <Button 
      size="lg" 
      onClick={handleClick}
      className="flex-1 md:flex-none h-12 px-8 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-sm font-semibold text-base transition-colors"
    >
      <MessageCircle className="w-5 h-5 mr-2" /> 
      {isPending ? "Connecting..." : "Chat on WhatsApp"}
    </Button>
  );
}
