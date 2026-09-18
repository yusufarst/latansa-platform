import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="container flex h-16 items-center px-4 md:px-8 mx-auto justify-between">
          <Link href="/" className="font-bold text-lg">LATANSA</Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-slate-600">Home</Link>
            <Link href="/products" className="text-sm font-medium hover:text-slate-600">Catalog</Link>
            <Link href="/compare" className="text-sm font-medium text-blue-600">Compare</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Product Comparison</h1>
        <p className="text-muted-foreground mb-8">
          Select up to 4 products from the catalog to compare their specifications.
        </p>
        
        <div className="p-12 bg-white dark:bg-slate-900 border border-dashed rounded-xl flex flex-col items-center justify-center text-slate-500">
          <p className="mb-4">No products selected for comparison.</p>
          <Link href="/products" className={buttonVariants()}>Browse Catalog</Link>
        </div>
      </main>
    </div>
  );
}
