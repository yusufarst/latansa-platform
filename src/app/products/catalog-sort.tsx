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
      <label htmlFor="sort" className="font-medium text-slate-600">Sort by:</label>
      <select 
        id="sort"
        className="h-10 px-3 py-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        defaultValue={currentSort || "default"}
        onChange={handleSortChange}
      >
        <option value="default">Relevance & Featured</option>
        <option value="newest">Newest Arrivals</option>
        <option value="name-az">Name (A-Z)</option>
        <option value="price-low">Price (Low to High)</option>
        <option value="price-high">Price (High to Low)</option>
      </select>
    </div>
  );
}
