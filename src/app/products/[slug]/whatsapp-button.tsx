import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function WhatsAppButton({
  slug,
}: {
  slug: string;
}) {
  return (
    <Link 
      href={`/api/go/whatsapp/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonVariants({ 
        size: "lg", 
        className: "flex-1 md:flex-none h-12 px-8 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-sm font-semibold text-base transition-colors" 
      })}
    >
      <MessageCircle className="w-5 h-5 mr-2" /> 
      Chat on WhatsApp
    </Link>
  );
}
