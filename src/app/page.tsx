import { Metadata } from "next";
import Link from "next/link";
import { getPublicProducts, getPublicCategories } from "@/modules/products/services/public";
import { PublicProductDTO } from "@/modules/products/validations";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { PageContainer } from "@/components/public/page-container";
import { SectionHeading } from "@/components/public/section-heading";
import { ProductCard } from "@/components/public/product-card";
import { buttonVariants } from "@/components/ui/button";
import { MessageSquare, ShieldCheck, Cpu, ArrowRight, Layers, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "LATANSA | Platform Pengadaan Perangkat Elektronik & Solusi IT Bisnis",
  description: "Katalog perangkat elektronik, perlengkapan komputer, dan teknologi informasi profesional untuk kebutuhan operasional bisnis dan institusi.",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ products }, categories] = await Promise.all([
    getPublicProducts(),
    getPublicCategories(),
  ]);

  const featured = products.filter((p: PublicProductDTO) => p.isFeatured).slice(0, 4);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, "") || "628111111111";

  const b2bValues = [
    {
      icon: <Layers className="w-6 h-6 text-brand stroke-[1.75]" />,
      title: "Katalog Spesifikasi Terverifikasi",
      description:
        "Data teknis, spesifikasi detail, dan nomor model produk disajikan secara transparan dan akurat untuk memudahkan evaluasi pengadaan.",
    },
    {
      icon: <Cpu className="w-6 h-6 text-brand stroke-[1.75]" />,
      title: "Konsultasi Teknis & Kebutuhan Khusus",
      description:
        "Bantuan teknis langsung untuk menyesuaikan spesifikasi perangkat keras dengan beban kerja operasional perusahaan Anda.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand stroke-[1.75]" />,
      title: "Alur Permintaan Penawaran Terstruktur",
      description:
        "Dukungan dokumentasi pengadaan B2B, penawaran resmi (RFQ), dan koordinasi pengiriman terjadwal untuk instansi dan korporasi.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-brand/15 selection:text-brand">
      {/* Shared Premium Public Header */}
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-border/80 overflow-hidden bg-radial from-stone-100/60 to-background dark:from-stone-900/40 dark:to-background">
        <PageContainer>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-card text-foreground text-xs font-medium shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
              Platform Pengadaan Elektronik & Komputer Terpercaya
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.12]">
              Solusi Perangkat Elektronik & IT untuk Kebutuhan Bisnis
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
              Katalog terstruktur untuk perangkat keras, perlengkapan jaringan, dan sistem komputasi profesional. Didesain untuk efisiensi pengadaan B2B dan institusi.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/products"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full sm:w-auto h-11 px-7 bg-brand hover:bg-brand-hover text-brand-foreground font-semibold text-sm shadow-xs transition-all"
                )}
              >
                Lihat Katalog
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto h-11 px-7 border-border/80 text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-medium"
                )}
              >
                <MessageSquare className="w-4 h-4 mr-2 text-brand stroke-[2]" />
                Hubungi Penjualan
              </a>
            </div>

            {/* Micro value badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-muted-foreground border-t border-border/60">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
                <span>Spesifikasi Teknis Detail</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
                <span>Dukungan Penawaran Resmi (RFQ)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
                <span>Layanan Berbasis Yogyakarta</span>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Featured Categories */}
      {categories.length > 0 && (
        <section className="py-14 border-b border-border/80 bg-stone-50/50 dark:bg-stone-900/20">
          <PageContainer>
            <SectionHeading
              badge="Kategori"
              title="Eksplorasi Berdasarkan Kategori"
              description="Pilih kategori perangkat yang sesuai dengan kebutuhan operasional kantor atau infrastruktur Anda."
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="group flex flex-col items-center text-center p-4 rounded-lg border border-border/80 bg-card hover:border-brand/40 hover:shadow-xs transition-all duration-150"
                >
                  <div className="w-10 h-10 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 group-hover:text-brand group-hover:bg-brand/10 transition-colors mb-2.5">
                    <Cpu className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <span className="font-medium text-xs sm:text-sm text-foreground group-hover:text-brand transition-colors line-clamp-1">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">
                    Lihat Produk
                  </span>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 md:py-20 border-b border-border/80">
        <PageContainer>
          <SectionHeading
            badge="Produk Pilihan"
            title="Perangkat Unggulan untuk Bisnis"
            description="Pilihan produk terkini dengan spesifikasi lengkap untuk operasional kantor dan industri."
            action={
              <Link
                href="/products"
                className="hidden sm:inline-flex items-center text-xs font-semibold text-brand hover:underline underline-offset-4"
              >
                Lihat Semua Produk &rarr;
              </Link>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}

            {featured.length === 0 && (
              <div className="col-span-full py-16 text-center border border-dashed border-border rounded-lg bg-stone-50/50">
                <p className="text-sm text-muted-foreground">
                  Belum ada produk unggulan yang dipilih.
                </p>
                <Link
                  href="/products"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-3")}
                >
                  Buka Seluruh Katalog
                </Link>
              </div>
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/products"
              className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center text-xs")}
            >
              Lihat Semua Produk di Katalog
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* B2B Value / Capabilities Section */}
      <section className="py-16 md:py-24 border-b border-border/80 bg-stone-50/50 dark:bg-stone-900/30">
        <PageContainer>
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">
              Standar Operasional
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Mengapa LATANSA untuk Pengadaan Perusahaan?
            </h2>
            <p className="text-sm text-muted-foreground">
              Alur pengadaan dirancang khusus untuk kenyamanan akurasi teknis dan proses administrasi bisnis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {b2bValues.map((val, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg border border-border/80 bg-card shadow-2xs space-y-3"
              >
                <div className="w-12 h-12 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4">
                  {val.icon}
                </div>
                <h3 className="font-semibold text-base text-foreground tracking-tight">
                  {val.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Conversion Consultation CTA */}
      <section className="py-16 bg-background">
        <PageContainer size="narrow">
          <div className="border border-border/80 rounded-xl p-8 sm:p-12 text-center bg-stone-50/60 dark:bg-stone-900/40 space-y-5">
            <span className="text-xs font-semibold text-brand tracking-wider uppercase">
              Konsultasi Langsung
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Perlu Bantuan Menentukan Spesifikasi Perangkat?
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Hubungi tim kami untuk konsultasi spesifikasi teknis, ketersediaan unit, atau penjadwalan penawaran harga resmi (RFQ) untuk perusahaan Anda.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full sm:w-auto h-11 px-6 bg-brand hover:bg-brand-hover text-brand-foreground text-xs font-semibold shadow-xs"
                )}
              >
                <MessageSquare className="w-4 h-4 mr-2 stroke-[2]" />
                Chat Tim Penjualan di WhatsApp
              </a>
              <Link
                href="/products"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto h-11 px-6 text-xs font-medium border-border/80"
                )}
              >
                Buka Katalog Lengkap
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Shared Premium Public Footer */}
      <PublicFooter />
    </div>
  );
}
