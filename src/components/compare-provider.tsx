"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { Scale } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";

interface CompareContextType {
  compareItems: string[];
  addCompareItem: (slug: string) => void;
  removeCompareItem: (slug: string) => void;
  clearCompare: () => void;
  isInCompare: (slug: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareItems, setCompareItems] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const saved = localStorage.getItem("latansa_compare_items");
      if (saved) {
        try {
          setCompareItems(JSON.parse(saved));
        } catch {
          setCompareItems([]);
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("latansa_compare_items", JSON.stringify(compareItems));
    }
  }, [compareItems, mounted]);

  const addCompareItem = (slug: string) => {
    setCompareItems(prev => {
      if (prev.includes(slug)) return prev;
      if (prev.length >= 4) {
        import("sonner").then(({ toast }) => {
          toast.error("Batas Perbandingan", {
            description: "Anda hanya dapat membandingkan maksimal 4 produk sekaligus.",
          });
        });
        return prev;
      }
      return [...prev, slug];
    });
  };

  const removeCompareItem = (slug: string) => {
    setCompareItems(prev => prev.filter(s => s !== slug));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (slug: string) => compareItems.includes(slug);

  return (
    <CompareContext.Provider value={{ compareItems, addCompareItem, removeCompareItem, clearCompare, isInCompare }}>
      {children}
      {mounted && compareItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-stone-900 text-stone-50 shadow-xl border-t border-stone-800 animate-in slide-in-from-bottom-5 duration-200">
          <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-stone-800 p-2 rounded-md hidden sm:flex items-center justify-center text-stone-300">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm text-stone-100">
                  {compareItems.length} Produk Dipilih
                </div>
                <div className="text-xs text-stone-400">
                  Bandingkan spesifikasi hingga 4 produk
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCompare}
                className="text-stone-300 hover:text-stone-100 hover:bg-stone-800 text-xs h-9 px-3"
              >
                Hapus
              </Button>
              <Link
                href={`/compare?items=${compareItems.join(",")}`}
                className={buttonVariants({
                  size: "sm",
                  className: "bg-brand hover:bg-brand-hover text-brand-foreground text-xs h-9 px-4 font-medium shadow-xs",
                })}
              >
                Bandingkan Produk
              </Link>
            </div>
          </div>
        </div>
      )}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    return {
      compareItems: [],
      addCompareItem: () => {},
      removeCompareItem: () => {},
      clearCompare: () => {},
      isInCompare: () => false,
    };
  }
  return context;
}
