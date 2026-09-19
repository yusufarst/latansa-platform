import { getProductsForCompare } from "@/modules/products/services/public";
import Link from "next/link";
import { ArrowLeft, Check, Minus, Plus, X, Trash2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { PageContainer } from "@/components/public/page-container";
import { EmptyState } from "@/components/public/empty-state";
import { ProductImagePlaceholder } from "@/components/public/product-image-placeholder";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Bandingkan Produk | LATANSA",
  description: "Perbandingan fitur teknis dan spesifikasi detail hingga 4 perangkat elektronik sekaligus.",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // Extract slugs from the `items` query parameter
  const itemsParam = typeof params.items === "string" ? params.items : "";
  const slugs = itemsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (slugs.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col selection:bg-brand/15 selection:text-brand">
        <PublicHeader />
        <main className="flex-1 py-16">
          <PageContainer size="narrow">
            <EmptyState
              title="Belum Ada Produk yang Dipilih"
              description="Pilih hingga 4 produk dari katalog kami untuk membandingkan spesifikasi teknis dan harga secara berdampingan."
              action={
                <Link
                  href="/products"
                  className={cn(
                    buttonVariants(),
                    "bg-brand hover:bg-brand-hover text-brand-foreground text-xs font-semibold px-5 h-9 shadow-xs"
                  )}
                >
                  Lihat Katalog Produk
                </Link>
              }
            />
          </PageContainer>
        </main>
        <PublicFooter />
      </div>
    );
  }

  if (slugs.length > 4) {
    return (
      <div className="min-h-screen bg-background flex flex-col selection:bg-brand/15 selection:text-brand">
        <PublicHeader />
        <main className="flex-1 py-16">
          <PageContainer size="narrow">
            <EmptyState
              title="Maksimal 4 Produk"
              description="Untuk menjaga kenyamanan dan keterbacaan spesifikasi teknis, Anda hanya dapat membandingkan maksimal 4 produk sekaligus."
              action={
                <Link
                  href={`/compare?items=${slugs.slice(0, 4).join(",")}`}
                  className={cn(
                    buttonVariants(),
                    "bg-brand hover:bg-brand-hover text-brand-foreground text-xs font-semibold px-5 h-9 shadow-xs"
                  )}
                >
                  Bandingkan 4 Produk Pertama
                </Link>
              }
            />
          </PageContainer>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const products = await getProductsForCompare(slugs);

  // Collect all unique specification keys across all products
  const allSpecKeys = new Set<string>();
  products.forEach((p) => {
    p.specifications.forEach((s) => allSpecKeys.add(s.key));
  });
  const specKeysArray = Array.from(allSpecKeys).sort();

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-brand/15 selection:text-brand">
      {/* Shared Public Header */}
      <PublicHeader />

      {/* Title & Action Bar */}
      <div className="border-b border-border/80 bg-stone-50/50 dark:bg-stone-900/30 py-6 md:py-8">
        <PageContainer>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link
                href="/products"
                className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Kembali ke Katalog
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Bandingkan Produk
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Evaluasi spesifikasi teknis dan estimasi harga berdampingan.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/products"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "text-xs h-9 px-3.5 border-border/80 text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                )}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Perbandingan</span>
              </Link>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Comparison Grid Table */}
      <main className="flex-1 py-8 md:py-12">
        <PageContainer>
          <div className="border border-border/80 rounded-lg bg-card shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr>
                    {/* Fixed Spec Label Column Header */}
                    <th className="w-1/5 p-4 sm:p-5 border-b border-r border-border/80 bg-stone-50/70 dark:bg-stone-900/50 text-xs font-bold uppercase tracking-wider text-muted-foreground align-bottom sticky left-0 z-20">
                      Spesifikasi & Fitur
                    </th>

                    {/* Product Cards Header */}
                    {products.map((product) => (
                      <th
                        key={product.slug}
                        className="w-1/5 p-4 sm:p-5 border-b border-border/80 align-top relative bg-card"
                      >
                        <div className="flex flex-col h-full">
                          {/* Image Container */}
                          <div className="aspect-square bg-stone-50 dark:bg-stone-900/40 rounded-md border border-border/60 overflow-hidden flex items-center justify-center mb-3 p-3 relative">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain"
                              />
                            ) : (
                              <ProductImagePlaceholder label={product.brand.name} iconSize="sm" />
                            )}
                            <Link
                              href={`/compare?items=${slugs.filter((s) => s !== product.slug).join(",")}`}
                              className="absolute top-2 right-2 bg-card/90 hover:bg-card text-muted-foreground hover:text-foreground rounded-full p-1 border border-border/80 shadow-2xs transition-colors"
                              title="Hapus dari perbandingan"
                              aria-label={`Hapus ${product.name} dari perbandingan`}
                            >
                              <X className="w-3.5 h-3.5" />
                            </Link>
                          </div>

                          {/* Brand & Name */}
                          <div className="text-[10px] font-semibold text-brand mb-1 uppercase tracking-wider">
                            {product.brand.name}
                          </div>
                          <h3 className="font-semibold text-xs sm:text-sm text-foreground leading-snug mb-2 line-clamp-2">
                            {product.name}
                          </h3>

                          {/* Price */}
                          <div className="text-sm sm:text-base font-bold text-foreground mt-auto pt-2">
                            {product.publicPrice
                              ? `Rp ${parseInt(product.publicPrice, 10).toLocaleString("id-ID")}`
                              : "Hubungi untuk Harga"}
                          </div>

                          {/* View Detail CTA */}
                          <Link
                            href={`/products/${product.slug}`}
                            className={cn(
                              buttonVariants({ size: "sm" }),
                              "w-full mt-3 h-8 text-xs font-semibold bg-brand hover:bg-brand-hover text-brand-foreground shadow-2xs"
                            )}
                          >
                            Lihat Detail
                          </Link>
                        </div>
                      </th>
                    ))}

                    {/* Empty Slots up to 4 */}
                    {Array.from({ length: 4 - products.length }).map((_, i) => (
                      <th
                        key={`empty-${i}`}
                        className="w-1/5 p-4 sm:p-5 border-b border-dashed border-border/70 align-middle bg-stone-50/30 dark:bg-stone-900/10"
                      >
                        <div className="flex flex-col items-center justify-center text-center p-4">
                          <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-2.5 text-stone-400">
                            <Plus className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground mb-3">
                            Slot Kosong
                          </span>
                          <Link
                            href="/products"
                            className={cn(
                              buttonVariants({ variant: "outline", size: "sm" }),
                              "h-7 px-3 text-[11px] border-border/80"
                            )}
                          >
                            Pilih Produk
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="text-xs divide-y divide-border/60">
                  {/* Category Row */}
                  <tr>
                    <th className="p-3.5 sm:p-4 border-r border-border/80 bg-stone-50/70 dark:bg-stone-900/50 font-semibold text-muted-foreground sticky left-0 z-10">
                      Kategori
                    </th>
                    {products.map((product) => (
                      <td key={product.slug} className="p-3.5 sm:p-4 text-foreground font-medium">
                        {product.category.name}
                      </td>
                    ))}
                    {Array.from({ length: 4 - products.length }).map((_, i) => (
                      <td key={`empty-cat-${i}`} className="p-3.5 sm:p-4 bg-stone-50/20"></td>
                    ))}
                  </tr>

                  {/* SKU Row */}
                  <tr>
                    <th className="p-3.5 sm:p-4 border-r border-border/80 bg-stone-50/70 dark:bg-stone-900/50 font-semibold text-muted-foreground sticky left-0 z-10">
                      Nomor SKU
                    </th>
                    {products.map((product) => (
                      <td key={product.slug} className="p-3.5 sm:p-4 font-mono text-muted-foreground">
                        {product.sku}
                      </td>
                    ))}
                    {Array.from({ length: 4 - products.length }).map((_, i) => (
                      <td key={`empty-sku-${i}`} className="p-3.5 sm:p-4 bg-stone-50/20"></td>
                    ))}
                  </tr>

                  {/* Description / Summary Row */}
                  <tr>
                    <th className="p-3.5 sm:p-4 border-r border-border/80 bg-stone-50/70 dark:bg-stone-900/50 font-semibold text-muted-foreground align-top sticky left-0 z-10">
                      Ringkasan
                    </th>
                    {products.map((product) => (
                      <td key={product.slug} className="p-3.5 sm:p-4 text-muted-foreground align-top">
                        <p className="line-clamp-3 leading-relaxed">
                          {product.shortDescription || "Tidak ada ringkasan deskripsi."}
                        </p>
                      </td>
                    ))}
                    {Array.from({ length: 4 - products.length }).map((_, i) => (
                      <td key={`empty-desc-${i}`} className="p-3.5 sm:p-4 bg-stone-50/20"></td>
                    ))}
                  </tr>

                  {/* Technical Specifications Group Header */}
                  {specKeysArray.length > 0 && (
                    <tr>
                      <th
                        colSpan={5}
                        className="p-3 border-y border-border/80 bg-stone-100/70 dark:bg-stone-800/60 font-bold text-foreground text-[11px] uppercase tracking-wider"
                      >
                        Spesifikasi Teknis
                      </th>
                    </tr>
                  )}

                  {/* Specification Rows */}
                  {specKeysArray.map((specKey) => (
                    <tr key={specKey} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors">
                      <th className="p-3.5 sm:p-4 border-r border-border/80 bg-stone-50/70 dark:bg-stone-900/50 font-medium text-foreground sticky left-0 z-10">
                        {specKey}
                      </th>
                      {products.map((product) => {
                        const spec = product.specifications.find((s) => s.key === specKey);
                        return (
                          <td key={product.slug} className="p-3.5 sm:p-4 text-foreground">
                            {spec ? (
                              spec.value.toLowerCase() === "yes" ||
                              spec.value.toLowerCase() === "true" ||
                              spec.value.toLowerCase() === "ya" ? (
                                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                              ) : spec.value.toLowerCase() === "no" ||
                                spec.value.toLowerCase() === "false" ||
                                spec.value.toLowerCase() === "tidak" ? (
                                <Minus className="w-4 h-4 text-stone-400" />
                              ) : (
                                <span className="font-medium">{spec.value}</span>
                              )
                            ) : (
                              <span className="text-stone-300 dark:text-stone-600">-</span>
                            )}
                          </td>
                        );
                      })}
                      {Array.from({ length: 4 - products.length }).map((_, i) => (
                        <td key={`empty-spec-${specKey}-${i}`} className="p-3.5 sm:p-4 bg-stone-50/20"></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </PageContainer>
      </main>

      {/* Shared Public Footer */}
      <PublicFooter />
    </div>
  );
}
