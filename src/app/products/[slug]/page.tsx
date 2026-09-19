import { Metadata, ResolvingMetadata } from "next";
import { getPublicProductDetail, getRelatedProducts } from "@/modules/products/services/public";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductGallery from "./product-gallery";
import WhatsAppButton from "./whatsapp-button";
import { CompareButton } from "@/components/compare-button";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { PageContainer } from "@/components/public/page-container";
import { ProductCard } from "@/components/public/product-card";
import { ArrowLeft, ChevronRight, Layers, Tag, ShieldCheck } from "lucide-react";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductDetail(slug);

  if (!product) {
    return { title: "Produk Tidak Ditemukan | LATANSA" };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const productImages = product.images.map((img) => img.url);

  return {
    title: `${product.name} | LATANSA Electronics`,
    description:
      product.shortDescription ||
      product.description?.substring(0, 160) ||
      `Detail spesifikasi ${product.name} di katalog bisnis LATANSA.`,
    openGraph: {
      title: `${product.name} | LATANSA`,
      description: product.shortDescription || "",
      images: [...productImages, ...previousImages],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getPublicProductDetail(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.slug, product.category.slug, 4);

  // Group specs by groupName
  const groupedSpecs = product.specifications.reduce((acc, spec) => {
    const group = spec.groupName || "Spesifikasi Umum";
    if (!acc[group]) acc[group] = [];
    acc[group].push(spec);
    return acc;
  }, {} as Record<string, typeof product.specifications>);

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-brand/15 selection:text-brand">
      {/* Shared Public Header */}
      <PublicHeader />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-border/80 bg-stone-50/50 dark:bg-stone-900/30 py-3.5">
        <PageContainer>
          <nav className="flex items-center text-xs text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap gap-1.5">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </li>
              <li>
                <Link href="/products" className="hover:text-foreground transition-colors">
                  Katalog
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </li>
              <li>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {product.category.name}
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </li>
              <li className="text-foreground font-medium truncate max-w-[240px] sm:max-w-md" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>
        </PageContainer>
      </div>

      {/* Main Product Layout */}
      <main className="flex-1 py-8 md:py-12">
        <PageContainer>
          <div className="mb-6">
            <Link
              href="/products"
              className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Kembali ke Katalog
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-16">
            {/* Gallery Column (5 cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <ProductGallery images={product.images} productName={product.name} />
              </div>
            </div>

            {/* Details Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col">
              {/* Brand & Category badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Link
                  href={`/products?brand=${product.brand.slug}`}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-xs font-semibold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-foreground hover:bg-stone-200 transition-colors"
                >
                  <Tag className="w-3 h-3 text-brand" />
                  {product.brand.name}
                </Link>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-xs font-medium bg-stone-100 dark:bg-stone-800 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Layers className="w-3 h-3 text-stone-400" />
                  {product.category.name}
                </Link>
                {product.isFeatured && (
                  <span className="px-2 py-0.5 rounded-sm text-xs font-semibold uppercase tracking-wider bg-brand text-brand-foreground shadow-2xs">
                    Unggulan
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight mb-2">
                {product.name}
              </h1>

              {/* SKU Identifier */}
              <div className="text-xs font-mono text-muted-foreground mb-6">
                Nomor SKU: <span className="text-foreground font-medium">{product.sku}</span>
              </div>

              {/* Price & Action Box */}
              <div className="p-6 rounded-lg border border-border/80 bg-stone-50/70 dark:bg-stone-900/40 shadow-2xs space-y-4 mb-8">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Estimasi Harga Satuan
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mt-0.5">
                    {product.publicPrice
                      ? `Rp ${parseInt(product.publicPrice, 10).toLocaleString("id-ID")}`
                      : "Hubungi untuk Harga"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Hubungi kami untuk informasi harga dan ketersediaan.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <WhatsAppButton slug={product.slug} />
                  <CompareButton
                    slug={product.slug}
                    className="h-11 px-5 border-border/80 bg-card text-foreground font-medium text-xs shadow-2xs"
                  />
                </div>
              </div>

              {/* Overview / Description */}
              <div className="space-y-3 mb-8">
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Ringkasan Produk
                </h2>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {product.description ||
                    product.shortDescription ||
                    "Informasi deskripsi lengkap untuk unit ini dapat dikonfirmasikan langsung melalui tim layanan pelanggan."}
                </div>
              </div>

              {/* Procurement Assurance badge */}
              <div className="p-4 rounded-md border border-border/70 bg-card flex items-start gap-3 mt-auto">
                <ShieldCheck className="w-5 h-5 text-brand shrink-0 mt-0.5 stroke-[1.75]" />
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground font-semibold block">
                    Standar Pengadaan LATANSA
                  </strong>
                  Unit perangkat melalui proses verifikasi spesifikasi fisik dan penanganan administrasi resmi untuk kebutuhan bisnis.
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Table */}
          {product.specifications.length > 0 && (
            <div className="mb-16 pt-8 border-t border-border/80">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-6">
                Spesifikasi Teknis
              </h2>

              <div className="rounded-lg border border-border/80 bg-card overflow-hidden shadow-2xs">
                <div className="divide-y divide-border/80">
                  {Object.entries(groupedSpecs).map(([group, specs], i) => (
                    <div key={i} className="p-6 md:p-8">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-brand mb-4">
                        {group}
                      </h3>
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5">
                        {specs.map((spec, j) => (
                          <div
                            key={j}
                            className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-border/50 gap-1 sm:gap-4"
                          >
                            <dt className="text-xs font-medium text-muted-foreground shrink-0 sm:w-1/3">
                              {spec.key}
                            </dt>
                            <dd className="text-xs font-semibold text-foreground text-left sm:text-right">
                              {spec.value}
                            </dd>
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
            <div className="pt-8 border-t border-border/80">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Produk Terkait
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Rekomendasi perangkat lain dalam kategori {product.category.name}.
                  </p>
                </div>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="text-xs font-semibold text-brand hover:underline underline-offset-4"
                >
                  Lihat Semua di {product.category.name} &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((rp) => (
                  <ProductCard key={rp.slug} product={rp} />
                ))}
              </div>
            </div>
          )}
        </PageContainer>
      </main>

      {/* Shared Public Footer */}
      <PublicFooter />
    </div>
  );
}
