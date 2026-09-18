import { Metadata, ResolvingMetadata } from "next";
import { getPublicProductDetail, getRelatedProducts } from "@/modules/products/services/public";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductGallery from "./product-gallery";
import WhatsAppButton from "./whatsapp-button";
import { CompareButton } from "@/components/compare-button";
import { ArrowLeft, Package, Tag, Layers } from "lucide-react";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductDetail(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const productImages = product.images.map(img => img.url);

  return {
    title: `${product.name} | LATANSA Medical Equipment`,
    description: product.shortDescription || product.description?.substring(0, 160) || `Buy ${product.name} from LATANSA`,
    openGraph: {
      title: product.name,
      description: product.shortDescription || "",
      images: [...productImages, ...previousImages],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription || "",
    }
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getPublicProductDetail(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category.id, 4);

  // Group specs by groupName
  const groupedSpecs = product.specifications.reduce((acc, spec) => {
    const group = spec.groupName || "General";
    if (!acc[group]) acc[group] = [];
    acc[group].push(spec);
    return acc;
  }, {} as Record<string, typeof product.specifications>);

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

      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex text-sm text-slate-500">
            <ol className="flex items-center space-x-2">
              <li><Link href="/products" className="hover:text-blue-600 transition-colors">Catalog</Link></li>
              <li><span className="mx-2">/</span></li>
              <li><Link href={`/products?category=${product.category.slug}`} className="hover:text-blue-600 transition-colors">{product.category.name}</Link></li>
              <li><span className="mx-2">/</span></li>
              <li className="text-slate-900 font-medium truncate" aria-current="page">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href="/products" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Catalog
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          {/* Left Column: Images */}
          <div className="w-full">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <Link href={`/products?brand=${product.brand.slug}`} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                <Tag className="w-3 h-3 mr-1" /> {product.brand.name}
              </Link>
              {product.isFeatured && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                  <Star className="w-3 h-3 mr-1 fill-current" /> Featured
                </span>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-2 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center text-sm text-slate-500 mb-6 gap-4">
              <span className="flex items-center"><Package className="w-4 h-4 mr-1.5" /> SKU: {product.sku}</span>
              <span className="flex items-center"><Layers className="w-4 h-4 mr-1.5" /> {product.category.name}</span>
            </div>
            
            <div className="bg-slate-50 border rounded-xl p-6 mb-8">
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {product.publicPrice ? `Rp ${parseInt(product.publicPrice).toLocaleString('id-ID')}` : 'Contact for Price'}
              </div>
              <p className="text-sm text-slate-500 mb-6">Price excludes VAT and delivery charges. Subject to availability.</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <WhatsAppButton productId={product.id} productName={product.name} />
                <CompareButton slug={product.slug} className="h-12 text-sm px-6 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700" />
              </div>
            </div>

            <div className="prose dark:prose-invert text-slate-600 dark:text-slate-300 mb-10 max-w-none">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Product Overview</h3>
              <p className="leading-relaxed">
                {product.description || product.shortDescription || "No detailed description available."}
              </p>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        {product.specifications.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Technical Specifications</h2>
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-slate-100">
                {Object.entries(groupedSpecs).map(([group, specs], i) => (
                  <div key={i} className="p-6 md:p-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b">{group}</h3>
                    <dl className="space-y-4">
                      {specs.map((spec, j) => (
                        <div key={j} className="flex flex-col">
                          <dt className="text-sm font-medium text-slate-500">{spec.key}</dt>
                          <dd className="text-sm font-semibold text-slate-900 mt-1">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Related Products</h2>
              <Link href={`/products?category=${product.category.slug}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View all in {product.category.name} &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (
                <Link key={rp.id} href={`/products/${rp.slug}`} className="group flex flex-col bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-square bg-slate-50 relative p-4 flex items-center justify-center border-b">
                     <div className="text-slate-300">
                       <span className="text-xs uppercase tracking-wider font-semibold">View Detail</span>
                     </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="text-xs font-semibold text-blue-600 mb-1">{rp.brand.name}</div>
                    <h3 className="font-medium text-slate-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">{rp.name}</h3>
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">
                        {rp.publicPrice ? `Rp ${parseInt(rp.publicPrice).toLocaleString('id-ID')}` : 'Ask Price'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Inline missing icon
function Star(props: React.SVGProps<SVGSVGElement>) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
