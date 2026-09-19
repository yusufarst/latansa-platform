"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductImagePlaceholder } from "@/components/public/product-image-placeholder";

interface ProductGalleryProps {
  images: Array<{ url: string; altText: string | null; isPrimary: boolean }>;
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-card border border-border/80 rounded-lg flex items-center justify-center p-8">
        <ProductImagePlaceholder label={productName} iconSize="lg" />
      </div>
    );
  }

  const activeImage = images[activeIndex] || images[0];

  return (
    <div className="space-y-3">
      {/* Main Image View */}
      <div className="aspect-square bg-card border border-border/80 rounded-lg overflow-hidden flex items-center justify-center relative p-6 shadow-2xs">
        <img
          src={activeImage.url}
          alt={activeImage.altText || `${productName} preview`}
          className="max-w-full max-h-full object-contain transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "aspect-square bg-card border rounded-md overflow-hidden flex items-center justify-center p-2 focus:outline-hidden transition-all cursor-pointer",
                activeIndex === i
                  ? "ring-2 ring-brand/40 border-brand shadow-xs"
                  : "border-border/80 hover:border-stone-400 opacity-70 hover:opacity-100"
              )}
              aria-label={`Lihat gambar produk ke-${i + 1}`}
            >
              <img
                src={img.url}
                alt={img.altText || `Thumbnail ${i + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
