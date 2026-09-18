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

  // Use a timeout to avoid synchronous setState inside an effect (hydration mismatch fix)
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
          toast.error("Compare Limit Reached", {
            description: "You can only compare up to 4 products at a time.",
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
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 text-white shadow-2xl animate-in slide-in-from-bottom-full border-t border-slate-700">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 p-2 rounded-full hidden sm:block">
                <Scale className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="font-semibold">{compareItems.length} {compareItems.length === 1 ? 'Product' : 'Products'} Selected</div>
                <div className="text-xs text-slate-400">Add up to 4 products to compare</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCompare}
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                Clear
              </Button>
              <Link 
                href={`/compare?items=${compareItems.join(",")}`}
                className={buttonVariants({ size: "sm", className: "bg-blue-600 hover:bg-blue-500 text-white border-none shadow-sm" })}
              >
                Compare Products
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
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
