import { Metadata } from "next";
import { LatansaLogo } from "@/components/brand/latansa-logo";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { getPublicProducts } from "@/modules/products/services/public";
import { PublicProductDTO } from "@/modules/products/validations";

export const metadata: Metadata = {
  title: 'LATANSA JOGJAKARTA | Premium Electronics & IT Equipment',
  description: 'Discover our catalog of high-quality electronics, networking gear, and IT solutions for your business.',
};

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { products } = await getPublicProducts();
  const featured = products.filter((p: PublicProductDTO) => p.isFeatured).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Public Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="container flex h-16 items-center px-4 md:px-8 mx-auto justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LatansaLogo width={120} height={40} />
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-slate-600">Home</Link>
            <Link href="/products" className="text-sm font-medium hover:text-slate-600">Catalog</Link>
            <Link href="/compare" className="text-sm font-medium hover:text-slate-600">Compare</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className={buttonVariants({ variant: "outline" })}>Login</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 opacity-90 z-0"></div>
        <div className="container mx-auto relative z-10 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Premium Electronics for Your Business</h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10">
            Discover our curated catalog of high-quality electronics, networking gear, and hardware solutions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/products" className={buttonVariants({ size: "lg", className: "bg-white text-slate-900 hover:bg-slate-100" })}>Browse Catalog</Link>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, '') || '628111111111'}`} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "lg", variant: "outline", className: "text-slate-900 dark:text-white border-white hover:bg-white/10" })}>Contact Sales</a>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 container mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Products</h2>
            <p className="text-slate-500">Handpicked selections from our catalog.</p>
          </div>
          <Link href="/products" className={buttonVariants({ variant: "link", className: "hidden sm:inline-flex" })}>View All</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product: PublicProductDTO) => (
            <div key={product.slug} className="group relative flex flex-col bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <Link href={`/products/${product.slug}`} className="flex flex-col flex-1 focus:outline-none">
                <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center p-4">
                  {product.images?.[0] ? (
                    <img src={product.images[0].url} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">No Image</div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="text-xs font-medium text-slate-500 mb-1">{product.brand.name}</div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">{product.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
                    {product.shortDescription || product.sku}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold">
                      {product.publicPrice ? `Rp ${parseInt(product.publicPrice).toLocaleString('id-ID')}` : 'Contact for Price'}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}

          {featured.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              No featured products found. Run the seed script to populate data.
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 py-12 border-t">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} LATANSA Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
