import { Metadata } from "next";
import { getPublicProducts, getPublicCategories, getPublicBrands } from "@/modules/products/services/public";
import Link from "next/link";
import { CatalogFilters } from "@/modules/products/validations";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompareButton } from "@/components/compare-button";
import { CatalogSort } from "./catalog-sort";

export const metadata: Metadata = {
  title: 'Catalog | LATANSA Medical Equipment',
  description: 'Browse our extensive catalog of premium medical devices, hospital furniture, and clinical supplies.',
};

export default async function PublicCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  
  const filters: CatalogFilters = {
    search: typeof params.q === 'string' ? params.q : undefined,
    categorySlug: typeof params.category === 'string' ? params.category : undefined,
    brandSlug: typeof params.brand === 'string' ? params.brand : undefined,
    sort: (typeof params.sort === 'string' ? params.sort : "default") as CatalogFilters["sort"],
    page: typeof params.page === 'string' ? parseInt(params.page) : 1,
    pageSize: 12,
  };

  const [productsData, categories, brands] = await Promise.all([
    getPublicProducts(filters),
    getPublicCategories(),
    getPublicBrands(),
  ]);

  const { products, total, page, totalPages } = productsData;

  const buildUrl = (updates: Record<string, string | null>) => {
    const search = new URLSearchParams();
    if (filters.search) search.set("q", filters.search);
    if (filters.categorySlug) search.set("category", filters.categorySlug);
    if (filters.brandSlug) search.set("brand", filters.brandSlug);
    if (filters.sort && filters.sort !== "default") search.set("sort", filters.sort);
    if (page > 1) search.set("page", page.toString());

    for (const [key, val] of Object.entries(updates)) {
      if (val === null) search.delete(key);
      else search.set(key, val);
    }
    
    // Reset to page 1 if changing filters
    if (!updates.page && (updates.category !== undefined || updates.brand !== undefined || updates.q !== undefined)) {
      search.delete("page");
    }

    const qs = search.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="container flex h-16 items-center px-4 md:px-8 mx-auto justify-between">
          <Link href="/" className="font-bold text-xl tracking-tight text-blue-600">LATANSA</Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/products" className="text-sm font-medium text-blue-600">Catalog</Link>
          </nav>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Medical Equipment Catalog</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">Browse our complete selection of premium medical devices, hospital furniture, and clinical supplies.</p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <form action="/products" method="GET" className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              type="search" 
              name="q" 
              placeholder="Search products..." 
              defaultValue={filters.search}
              className="pl-9 bg-white"
            />
            {filters.categorySlug && <input type="hidden" name="category" value={filters.categorySlug} />}
            {filters.brandSlug && <input type="hidden" name="brand" value={filters.brandSlug} />}
            {filters.sort && filters.sort !== 'default' && <input type="hidden" name="sort" value={filters.sort} />}
          </form>

          <div>
            <h3 className="font-semibold mb-3 flex items-center"><SlidersHorizontal className="w-4 h-4 mr-2"/> Categories</h3>
            <ul className="space-y-1.5">
              <li>
                <Link 
                  href={buildUrl({ category: null })} 
                  className={`block px-3 py-2 rounded-md text-sm transition-colors ${!filters.categorySlug ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  All Categories
                </Link>
              </li>
              {categories.map(c => (
                <li key={c.id}>
                  <Link 
                    href={buildUrl({ category: c.slug })} 
                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${filters.categorySlug === c.slug ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-100 text-slate-600'}`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 flex items-center"><SlidersHorizontal className="w-4 h-4 mr-2"/> Brands</h3>
            <ul className="space-y-1.5">
              <li>
                <Link 
                  href={buildUrl({ brand: null })} 
                  className={`block px-3 py-2 rounded-md text-sm transition-colors ${!filters.brandSlug ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  All Brands
                </Link>
              </li>
              {brands.map(b => (
                <li key={b.id}>
                  <Link 
                    href={buildUrl({ brand: b.slug })} 
                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${filters.brandSlug === b.slug ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-100 text-slate-600'}`}
                  >
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border shadow-sm">
            <span className="text-sm font-medium text-slate-600">
              Showing {products.length > 0 ? (page - 1) * filters.pageSize! + 1 : 0} - {Math.min(page * filters.pageSize!, total)} of {total} products
            </span>
            
            <CatalogSort currentSort={filters.sort} />
          </div>

          {products.length === 0 ? (
            <div className="py-20 text-center border rounded-xl bg-white shadow-sm">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                We couldn&apos;t find any products matching your current filters. 
                Try adjusting your search or clearing filters.
              </p>
              <Link href="/products" className={buttonVariants({ variant: "default" })}>
                Clear All Filters
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <Link key={product.id} href={`/products/${product.slug}`} className="group flex flex-col bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="aspect-square bg-white relative p-4 flex items-center justify-center border-b">
                      {product.images?.[0] ? (
                        <img 
                          src={product.images[0].url} 
                          alt={product.images[0].altText || product.name}
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-slate-300 flex flex-col items-center">
                          <span className="text-xs mt-2 uppercase tracking-wider font-semibold">No Image</span>
                        </div>
                      )}
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      {product.isFeatured && (
                        <div className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm shadow-sm">
                          Featured
                        </div>
                      )}
                      <div className="flex justify-end">
                        <CompareButton slug={product.slug} minimal className="bg-white/90 backdrop-blur shadow-sm" />
                      </div>
                    </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="text-xs font-semibold text-blue-600 mb-1.5 uppercase tracking-wide">{product.brand.name}</div>
                      <h3 className="font-semibold text-slate-900 leading-tight mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">{product.name}</h3>
                      <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">
                        {product.shortDescription || product.sku}
                      </p>
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {product.publicPrice ? `Rp ${parseInt(product.publicPrice).toLocaleString('id-ID')}` : 'Contact for Price'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Link 
                    href={page > 1 ? buildUrl({ page: (page - 1).toString() }) : '#'}
                    className={`flex items-center justify-center w-10 h-10 rounded-md border ${page <= 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:bg-slate-50'}`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                  
                  <div className="flex items-center gap-1 mx-4">
                    <span className="text-sm font-medium">Page {page} of {totalPages}</span>
                  </div>

                  <Link 
                    href={page < totalPages ? buildUrl({ page: (page + 1).toString() }) : '#'}
                    className={`flex items-center justify-center w-10 h-10 rounded-md border ${page >= totalPages ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:bg-slate-50'}`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
