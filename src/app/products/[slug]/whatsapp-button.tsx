import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  slug: string;
  className?: string;
}

export default function WhatsAppButton({ slug, className }: WhatsAppButtonProps) {
  return (
    <Link
      href={`/api/go/whatsapp/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ size: "lg" }),
        "flex-1 sm:flex-none h-11 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-xs font-semibold text-xs transition-all flex items-center justify-center gap-2",
        className
      )}
    >
      <MessageSquare className="w-4 h-4 fill-current stroke-none" />
      <span>Chat via WhatsApp</span>
    </Link>
  );
}
