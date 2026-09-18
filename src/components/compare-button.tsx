"use client";

import { useCompare } from "./compare-provider";
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

export function CompareButton({ slug, className, minimal = false }: { slug: string; className?: string; minimal?: boolean }) {
  const { isInCompare, addCompareItem, removeCompareItem } = useCompare();
  
  const inCompare = isInCompare(slug);
  
  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inCompare) {
      removeCompareItem(slug);
    } else {
      addCompareItem(slug);
    }
  };

  return (
    <button 
      onClick={toggleCompare}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors",
        minimal 
          ? "p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          : "text-xs font-medium px-3 py-1.5 border shadow-sm",
        inCompare 
          ? (minimal ? "text-blue-600 bg-blue-50" : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100") 
          : (minimal ? "text-slate-400" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"),
        className
      )}
      title={inCompare ? "Remove from Compare" : "Add to Compare"}
    >
      <Scale className={cn("w-4 h-4", !minimal && "mr-1.5")} />
      {!minimal && (inCompare ? "Added" : "Compare")}
    </button>
  );
}
