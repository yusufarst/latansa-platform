import { Metadata } from "next";
import {
  getPublicProducts,
  getPublicCategories,
  getPublicBrands,
  getPublicSpecificationFilters,
} from "@/modules/products/services/public";
import Link from "next/link";
import { CatalogFilters } from "@/modules/products/validations";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { PageContainer } from "@/components/public/page-container";
import { ProductCard } from "@/components/public/product-card";
import { EmptyState } from "@/components/public/empty-state";
import { CatalogSort } from "./catalog-sort";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Katalog Produk & Perangkat Elektronik | LATANSA",
  description: "Jelajahi katalog lengkap perangkat keras komputer, peralatan jaringan, dan sistem komputasi bisnis berkualitas tinggi di LATANSA.",
};

export const dynamic = "force-dynamic";

export default async function PublicCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const specs: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(params)) {
    if (["q", "category", "brand", "sort", "page"].includes(key)) continue;
    if (value) {
      specs[key] = Array.isArray(value) ? value : [value];
    }
  }

  const filters: CatalogFilters = {
    search: typeof params.q === "string" ? params.q : undefined,
    categorySlug: typeof params.category === "string" ? params.category : undefined,
    brandSlug: typeof params.brand === "string" ? params.brand : undefined,
    sort: (typeof params.sort === "string" ? params.sort : "default") as CatalogFilters["sort"],
    page: typeof params.page === "string" ? parseInt(params.page, 10) : 1,
    pageSize: 12,
    specs: Object.keys(specs).length > 0 ? specs : undefined,
  };

  const [productsData, categories, brands, specFilters] = await Promise.all([
    getPublicProducts(filters),
    getPublicCategories(),
    getPublicBrands(),
    getPublicSpecificationFilters(filters.categorySlug),
  ]);

  const { products, total, page, totalPages } = productsData;

  const buildUrl = (updates: Record<string, string | string[] | null>) => {
    const search = new URLSearchParams();
    if (filters.search) search.set("q", filters.search);
    if (filters.categorySlug) search.set("category", filters.categorySlug);
    if (filters.brandSlug) search.set("brand", filters.brandSlug);
    if (filters.sort && filters.sort !== "default") search.set("sort", filters.sort);
    if (page > 1) search.set("page", page.toString());

    for (const [key, values] of Object.entries(specs)) {
      for (const v of values) {
        search.append(key, v);
      }
    }

    for (const [key, val] of Object.entries(updates)) {
      search.delete(key);
      if (val !== null) {
        const vals = Array.isArray(val) ? val : [val];
        for (const v of vals) search.append(key, v);
      }
    }

    if (
      !updates.page &&
      (updates.category !== undefined ||
        updates.brand !== undefined ||
        updates.q !== undefined ||
        Object.keys(updates).some((k) => !["page", "sort"].includes(k)))
    ) {
      search.delete("page");
    }

    const qs = search.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  };

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.categorySlug ||
      filters.brandSlug ||
      Object.keys(specs).length > 0
  );

  const filterContent = (
    <div className="space-y-6">
      {/* Search Input */}
      <form action="/products" method="GET" className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          name="q"
          placeholder="Cari nama atau SKU produk..."
          defaultValue={filters.search}
          className="pl-9 h-9 text-xs bg-card border-border/80 focus-visible:ring-brand/30"
        />
        {filters.categorySlug && <input type="hidden" name="category" value={filters.categorySlug} />}
        {filters.brandSlug && <input type="hidden" name="brand" value={filters.brandSlug} />}
        {filters.sort && filters.sort !== "default" && <input type="hidden" name="sort" value={filters.sort} />}
      </form>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="pt-1 pb-3 border-b border-border/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">Filter Aktif</span>
            <Link
              href="/products"
              className="text-[11px] text-brand hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Reset Semua
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filters.categorySlug && (
              <Link
                href={buildUrl({ category: null })}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-stone-100 dark:bg-stone-800 text-xs font-medium text-foreground hover:bg-stone-200"
              >
                <span>{categories.find((c) => c.slug === filters.categorySlug)?.name || filters.categorySlug}</span>
                <X className="w-3 h-3 text-muted-foreground" />
              </Link>
            )}
            {filters.brandSlug && (
              <Link
                href={buildUrl({ brand: null })}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-stone-100 dark:bg-stone-800 text-xs font-medium text-foreground hover:bg-stone-200"
              >
                <span>{brands.find((b) => b.slug === filters.brandSlug)?.name || filters.brandSlug}</span>
                <X className="w-3 h-3 text-muted-foreground" />
              </Link>
            )}
            {filters.search && (
              <Link
                href={buildUrl({ q: null })}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-stone-100 dark:bg-stone-800 text-xs font-medium text-foreground hover:bg-stone-200"
              >
                <span>&quot;{filters.search}&quot;</span>
                <X className="w-3 h-3 text-muted-foreground" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center">
          <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-brand" /> Kategori
        </h3>
        <ul className="space-y-1">
          <li>
            <Link
              href={buildUrl({ category: null })}
              className={cn(
                "block px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                !filters.categorySlug
                  ? "bg-stone-100 dark:bg-stone-800 text-brand font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-stone-100/60 dark:hover:bg-stone-800/60"
              )}
            >
              Semua Kategori
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={buildUrl({ category: c.slug })}
                className={cn(
                  "block px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                  filters.categorySlug === c.slug
                    ? "bg-stone-100 dark:bg-stone-800 text-brand font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-stone-100/60 dark:hover:bg-stone-800/60"
                )}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Brands */}
      <div className="pt-3 border-t border-border/60">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center">
          <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-brand" /> Merek (Brand)
        </h3>
        <ul className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <li>
            <Link
              href={buildUrl({ brand: null })}
              className={cn(
                "block px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                !filters.brandSlug
                  ? "bg-stone-100 dark:bg-stone-800 text-brand font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-stone-100/60 dark:hover:bg-stone-800/60"
              )}
            >
              Semua Merek
            </Link>
          </li>
          {brands.map((b) => (
            <li key={b.slug}>
              <Link
                href={buildUrl({ brand: b.slug })}
                className={cn(
                  "block px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                  filters.brandSlug === b.slug
                    ? "bg-stone-100 dark:bg-stone-800 text-brand font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-stone-100/60 dark:hover:bg-stone-800/60"
                )}
              >
                {b.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Dynamic Spec Filters */}
      {Object.entries(specFilters).map(([specKey, values]) => (
        <div key={specKey} className="pt-3 border-t border-border/60">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-brand" /> {specKey}
          </h3>
          <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {values.map((val) => {
              const currentVals = specs[specKey] || [];
              const isActive = currentVals.includes(val);
              const nextVals = isActive
                ? currentVals.filter((v) => v !== val)
                : [...currentVals, val];
              return (
                <li key={val}>
                  <Link
                    href={buildUrl({ [specKey]: nextVals.length > 0 ? nextVals : null })}
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors",
                      isActive
                        ? "bg-stone-100 dark:bg-stone-800 text-brand font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-stone-100/60"
                    )}
                  >
                    <input
                      type="checkbox"
                      readOnly
                      checked={isActive}
                      className="w-3.5 h-3.5 rounded-xs border-border/80 text-brand focus:ring-brand cursor-pointer"
                    />
                    <span className="truncate">{val}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-brand/15 selection:text-brand">
      {/* Shared Public Header */}
      <PublicHeader />

      {/* Catalog Title Banner */}
      <div className="border-b border-border/80 bg-stone-50/50 dark:bg-stone-900/30 py-8 md:py-10">
        <PageContainer>
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand">
              Katalog Bisnis Terverifikasi
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Katalog Produk & Perangkat Elektronik
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Jelajahi seluruh perangkat keras, perlengkapan IT, dan infrastruktur komputasi untuk operasional profesional.
            </p>
          </div>
        </PageContainer>
      </div>

      {/* Main Catalog Workspace */}
      <main className="flex-1 py-8">
        <PageContainer>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden md:block w-64 shrink-0">
              <div className="sticky top-24 p-5 rounded-lg border border-border/80 bg-card shadow-2xs">
                {filterContent}
              </div>
            </aside>

            {/* Product Area */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* Toolbar: Counter, Mobile Filter Trigger, Sort Select */}
              <div className="p-3.5 sm:p-4 rounded-lg border border-border/80 bg-card shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Menampilkan{" "}
                    <strong className="font-semibold text-foreground">
                      {products.length > 0 ? (page - 1) * filters.pageSize! + 1 : 0}
                    </strong>
                    {" - "}
                    <strong className="font-semibold text-foreground">
                      {Math.min(page * filters.pageSize!, total)}
                    </strong>{" "}
                    dari{" "}
                    <strong className="font-semibold text-foreground">{total}</strong> produk
                  </span>

                  {/* Mobile Filter Button opening Sheet */}
                  <div className="md:hidden">
                    <Sheet>
                      <SheetTrigger
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "h-8 px-3 text-xs border-border/80 flex items-center gap-1.5"
                        )}
                        aria-label="Buka Filter Katalog"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-brand" />
                        <span>Filter</span>
                        {hasActiveFilters && (
                          <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                        )}
                      </SheetTrigger>
                      <SheetContent side="left" className="w-[300px] sm:w-[360px] p-6 overflow-y-auto">
                        <SheetHeader className="p-0 mb-6 text-left">
                          <SheetTitle className="text-base font-bold text-foreground">
                            Filter Katalog Produk
                          </SheetTitle>
                        </SheetHeader>
                        {filterContent}
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <CatalogSort currentSort={filters.sort} />
                </div>
              </div>

              {/* Product Grid or Empty State */}
              {products.length === 0 ? (
                <EmptyState
                  title="Tidak Ada Produk Ditemukan"
                  description="Tidak ada produk yang cocok dengan kombinasi filter dan kata kunci yang Anda pilih. Coba sesuaikan pencarian Anda."
                  action={
                    <Link
                      href="/products"
                      className={buttonVariants({
                        className: "bg-brand hover:bg-brand-hover text-brand-foreground text-xs px-4 h-9 shadow-xs",
                      })}
                    >
                      Reset Semua Filter
                    </Link>
                  }
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                    {products.map((product) => (
                      <ProductCard key={product.slug} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                      <Link
                        href={page > 1 ? buildUrl({ page: (page - 1).toString() }) : "#"}
                        className={cn(
                          "flex items-center justify-center w-9 h-9 rounded-md border border-border/80 text-foreground bg-card text-xs font-medium transition-colors",
                          page <= 1
                            ? "opacity-40 cursor-not-allowed pointer-events-none"
                            : "hover:bg-stone-100 dark:hover:bg-stone-800"
                        )}
                        aria-label="Halaman Sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Link>

                      <div className="flex items-center gap-1 mx-2">
                        <span className="text-xs text-muted-foreground">
                          Halaman <strong className="font-semibold text-foreground">{page}</strong> dari{" "}
                          <strong className="font-semibold text-foreground">{totalPages}</strong>
                        </span>
                      </div>

                      <Link
                        href={page < totalPages ? buildUrl({ page: (page + 1).toString() }) : "#"}
                        className={cn(
                          "flex items-center justify-center w-9 h-9 rounded-md border border-border/80 text-foreground bg-card text-xs font-medium transition-colors",
                          page >= totalPages
                            ? "opacity-40 cursor-not-allowed pointer-events-none"
                            : "hover:bg-stone-100 dark:hover:bg-stone-800"
                        )}
                        aria-label="Halaman Berikutnya"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </PageContainer>
      </main>

      {/* Shared Public Footer */}
      <PublicFooter />
    </div>
  );
}
