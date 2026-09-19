import Link from "next/link";
import { PublicProductDTO } from "@/modules/products/validations";
import { CompareButton } from "@/components/compare-button";
import { ProductImagePlaceholder } from "./product-image-placeholder";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: PublicProductDTO;
  className?: string;
  priorityImage?: boolean;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const primaryImage = product.images?.[0];
  const priceDisplay = product.publicPrice
    ? `Rp ${parseInt(product.publicPrice, 10).toLocaleString("id-ID")}`
    : "Hubungi untuk Harga";

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-card border border-border/80 rounded-lg overflow-hidden transition-all duration-200 hover:border-stone-400/80 hover:shadow-xs focus-within:ring-2 focus-within:ring-brand/30",
        className
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col flex-1 focus:outline-hidden"
        tabIndex={0}
      >
        {/* Product Image Frame */}
        <div className="aspect-square bg-stone-50/80 dark:bg-stone-900/40 relative p-4 flex items-center justify-center border-b border-border/60 overflow-hidden">
          {primaryImage?.url ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.altText || product.name}
              className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-103"
              loading="lazy"
            />
          ) : (
            <ProductImagePlaceholder label={product.brand?.name || "LATANSA"} />
          )}
        </div>

        {/* Product Information */}
        <div className="p-4 flex flex-col flex-1">
          {/* Brand & SKU */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-semibold tracking-wider text-stone-600 dark:text-stone-400 uppercase truncate">
              {product.brand?.name}
            </span>
            <span className="text-[11px] font-mono text-muted-foreground truncate">
              SKU: {product.sku}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-sm sm:text-base text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-brand transition-colors">
            {product.name}
          </h3>

          {/* Short Description or Spec summary */}
          <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed flex-1">
            {product.shortDescription || "Perangkat berkualitas dengan spesifikasi teknis lengkap untuk operasional profesional."}
          </p>

          {/* Price Area */}
          <div className="mt-auto pt-3 border-t border-border/60 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-medium text-muted-foreground tracking-wide">
                Estimasi Harga
              </span>
              <span className="font-bold text-sm sm:text-base text-foreground tracking-tight">
                {priceDisplay}
              </span>
            </div>
            <span className="text-xs font-medium text-brand group-hover:underline underline-offset-4">
              Lihat Detail &rarr;
            </span>
          </div>
        </div>
      </Link>

      {/* Floating Badges & Compare Button */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
        {product.isFeatured && (
          <span className="bg-brand text-brand-foreground text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-sm shadow-xs">
            Unggulan
          </span>
        )}
        <div className="pointer-events-auto">
          <CompareButton
            slug={product.slug}
            minimal
            className="bg-white/90 dark:bg-stone-900/90 hover:bg-white dark:hover:bg-stone-900 border border-border/80 shadow-xs"
          />
        </div>
      </div>
    </div>
  );
}
