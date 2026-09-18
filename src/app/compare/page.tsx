import { getProductsForCompare } from "@/modules/products/services/public";
import Link from "next/link";
import { ArrowLeft, Check, Minus, Package, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  
  // Extract slugs from the `items` query parameter (comma-separated)
  const itemsParam = typeof params.items === 'string' ? params.items : "";
  const slugs = itemsParam.split(",").map(s => s.trim()).filter(Boolean);
  
  if (slugs.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Compare Products</h1>
        <p className="text-slate-500 mb-6">No products selected for comparison.</p>
        <Link href="/products" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-blue-600 text-white hover:bg-blue-700">
          Browse Catalog
        </Link>
      </div>
    );
  }

  if (slugs.length > 4) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Too Many Products</h1>
        <p className="text-slate-500 mb-6">You can only compare up to 4 products at a time.</p>
        <Link href={`/compare?items=${slugs.slice(0, 4).join(",")}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-blue-600 text-white hover:bg-blue-700">
          Compare First 4
        </Link>
      </div>
    );
  }

  const products = await getProductsForCompare(slugs);

  // Collect all unique specification keys across all products
  const allSpecKeys = new Set<string>();
  products.forEach(p => {
    p.specifications.forEach(s => allSpecKeys.add(s.key));
  });
  const specKeysArray = Array.from(allSpecKeys).sort();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="container flex h-16 items-center px-4 md:px-8 mx-auto justify-between">
          <Link href="/" className="font-bold text-xl tracking-tight text-blue-600">LATANSA</Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/products" className="text-sm font-medium hover:text-blue-600 transition-colors">Catalog</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl overflow-hidden">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/products" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Catalog
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Compare Products</h1>
          </div>
          <Link href="/products" className={buttonVariants({ variant: "outline" })}>
            Clear Comparison
          </Link>
        </div>

        <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr>
                <th className="w-1/5 p-4 border-b border-r bg-slate-50 font-semibold text-slate-500">
                  Product Overview
                </th>
                {products.map(product => (
                  <th key={product.slug} className="w-1/5 p-6 border-b align-top relative">
                    <div className="flex flex-col h-full">
                      <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center mb-4 p-4 relative">
                        {product.images?.[0] ? (
                          <img src={product.images[0].url} alt={product.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <Package className="w-8 h-8 text-slate-300" />
                        )}
                        <Link 
                          href={`/compare?items=${slugs.filter(s => s !== product.slug).join(",")}`}
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-slate-600 rounded-full p-1 shadow-sm backdrop-blur-sm transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wide">{product.brand.name}</div>
                      <h3 className="font-bold text-lg leading-tight mb-2 flex-1">{product.name}</h3>
                      <div className="text-xl font-bold text-slate-900 mt-auto pt-4">
                        {product.publicPrice ? `Rp ${parseInt(product.publicPrice).toLocaleString('id-ID')}` : 'Ask Price'}
                      </div>
                      <Link href={`/products/${product.slug}`} className={buttonVariants({ variant: "default", className: "w-full mt-4 bg-blue-600 hover:bg-blue-700" })}>
                        View Details
                      </Link>
                    </div>
                  </th>
                ))}
                {/* Fill empty columns up to 4 */}
                {Array.from({ length: 4 - products.length }).map((_, i) => (
                  <th key={`empty-${i}`} className="w-1/5 p-6 border-b align-top bg-slate-50/50 border-dashed">
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                      <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                        <PlusIcon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium">Add another product</span>
                      <Link href="/products" className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4" })}>
                        Browse
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr>
                <th className="p-4 border-b border-r bg-slate-50 font-medium text-slate-600">Category</th>
                {products.map(product => (
                  <td key={product.slug} className="p-4 border-b text-slate-900 font-medium">{product.category.name}</td>
                ))}
                {Array.from({ length: 4 - products.length }).map((_, i) => <td key={`empty-cat-${i}`} className="p-4 border-b bg-slate-50/50"></td>)}
              </tr>
              <tr>
                <th className="p-4 border-b border-r bg-slate-50 font-medium text-slate-600">SKU</th>
                {products.map(product => (
                  <td key={product.slug} className="p-4 border-b text-slate-600">{product.sku}</td>
                ))}
                {Array.from({ length: 4 - products.length }).map((_, i) => <td key={`empty-sku-${i}`} className="p-4 border-b bg-slate-50/50"></td>)}
              </tr>
              <tr>
                <th className="p-4 border-b border-r bg-slate-50 font-medium text-slate-600 align-top">Description</th>
                {products.map(product => (
                  <td key={product.slug} className="p-4 border-b text-slate-600 align-top">
                    <p className="line-clamp-4">{product.shortDescription || "No description"}</p>
                  </td>
                ))}
                {Array.from({ length: 4 - products.length }).map((_, i) => <td key={`empty-desc-${i}`} className="p-4 border-b bg-slate-50/50"></td>)}
              </tr>

              {/* Specifications Header */}
              {specKeysArray.length > 0 && (
                <tr>
                  <th colSpan={5} className="p-4 border-b bg-slate-100 font-bold text-slate-900 uppercase tracking-wider text-xs">
                    Technical Specifications
                  </th>
                </tr>
              )}

              {/* Specification Rows */}
              {specKeysArray.map(specKey => (
                <tr key={specKey} className="hover:bg-slate-50/50 transition-colors">
                  <th className="p-4 border-b border-r bg-slate-50 font-medium text-slate-600">{specKey}</th>
                  {products.map(product => {
                    const spec = product.specifications.find(s => s.key === specKey);
                    return (
                      <td key={product.slug} className="p-4 border-b text-slate-900">
                        {spec ? (
                          spec.value.toLowerCase() === "yes" || spec.value.toLowerCase() === "true" ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : spec.value.toLowerCase() === "no" || spec.value.toLowerCase() === "false" ? (
                            <Minus className="w-5 h-5 text-slate-400" />
                          ) : (
                            spec.value
                          )
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    );
                  })}
                  {Array.from({ length: 4 - products.length }).map((_, i) => <td key={`empty-spec-${specKey}-${i}`} className="p-4 border-b bg-slate-50/50"></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
