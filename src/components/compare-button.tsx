"use client";

import { useCompare } from "./compare-provider";
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompareButtonProps {
  slug: string;
  className?: string;
  minimal?: boolean;
}

export function CompareButton({ slug, className, minimal = false }: CompareButtonProps) {
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
      type="button"
      onClick={toggleCompare}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-all duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40",
        minimal
          ? "p-2 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800"
          : "text-xs px-3.5 py-1.5 border shadow-2xs",
        inCompare
          ? minimal
            ? "text-brand bg-brand/10"
            : "bg-brand/10 text-brand border-brand/30 hover:bg-brand/15"
          : minimal
            ? "text-muted-foreground hover:text-foreground"
            : "bg-card text-muted-foreground border-border/80 hover:text-foreground hover:bg-stone-50 dark:hover:bg-stone-900",
        className
      )}
      title={inCompare ? "Remove from Compare" : "Add to Compare"}
      aria-label={inCompare ? "Hapus dari Perbandingan" : "Tambah ke Perbandingan"}
      aria-pressed={inCompare}
    >
      <Scale className={cn("w-3.5 h-3.5 stroke-[1.75]", !minimal && "mr-1.5")} />
      {!minimal && (inCompare ? "Tersimpan" : "Bandingkan")}
    </button>
  );
}
