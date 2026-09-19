"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export function CatalogSort({ currentSort }: { currentSort?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      const value = e.target.value;

      if (value === "default") {
        params.delete("sort");
      } else {
        params.set("sort", value);
      }

      // Reset page when sorting changes
      params.delete("page");

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap">
        Urutkan:
      </label>
      <select
        id="sort"
        className="h-9 px-3 py-1 rounded-md border border-border/80 text-xs sm:text-sm font-medium text-foreground bg-card focus:outline-hidden focus:ring-2 focus:ring-brand/30 transition-all cursor-pointer"
        defaultValue={currentSort || "default"}
        onChange={handleSortChange}
      >
        <option value="default">Relevansi & Pilihan</option>
        <option value="newest">Produk Terbaru</option>
        <option value="name-az">Nama (A-Z)</option>
        <option value="price-low">Harga (Terendah - Tertinggi)</option>
        <option value="price-high">Harga (Tertinggi - Terendah)</option>
      </select>
    </div>
  );
}
