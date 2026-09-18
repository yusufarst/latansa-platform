"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ProductGallery({
  images,
  productName
}: {
  images: Array<{ url: string; altText: string | null; isPrimary: boolean }>;
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-slate-100 dark:bg-slate-800 border rounded-xl flex flex-col items-center justify-center text-slate-400 p-8 text-center">
        <span className="font-medium text-lg mb-2">No Image Available</span>
        <span className="text-sm">Images for {productName} will be uploaded soon.</span>
      </div>
    );
  }

  const activeImage = images[activeIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-white border rounded-xl overflow-hidden flex items-center justify-center relative p-4">
        <img
          src={activeImage.url}
          alt={activeImage.altText || `${productName} view`}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "aspect-square bg-white border rounded-lg overflow-hidden flex items-center justify-center p-2 focus:outline-none transition-all",
                activeIndex === i 
                  ? "ring-2 ring-blue-600 border-transparent shadow-sm" 
                  : "hover:border-slate-300 opacity-70 hover:opacity-100"
              )}
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
