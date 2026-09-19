import Link from "next/link";
import { LatansaLogo } from "@/components/brand/latansa-logo";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border/80 text-foreground pt-14 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border/60">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <LatansaLogo width={110} height={36} />
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Penyedia perangkat elektronik, perangkat keras komputer, dan solusi teknologi terstruktur untuk kebutuhan operasional bisnis, perkantoran, dan institusi.
            </p>
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Lokasi Operasional:</span> Jogjakarta, Indonesia
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-foreground mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-foreground transition-colors">
                  Katalog Produk
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-foreground transition-colors">
                  Perbandingan Produk
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Portal Internal
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Solutions */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-foreground mb-4">
              Layanan B2B
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>Pengadaan Perangkat Keras</li>
              <li>Permintaan Penawaran Resmi (RFQ)</li>
              <li>Konsultasi Kebutuhan IT Perusahaan</li>
              <li>Penyediaan Unit Bisnis Terjadwal</li>
            </ul>
          </div>

          {/* Contact / Inquiries */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-foreground mb-4">
              Kontak & Bantuan
            </h4>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Hubungi tim kami untuk konsultasi spesifikasi teknis atau permintaan penawaran harga.
            </p>
            <div className="space-y-1.5 text-xs">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, "") || "628111111111"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-brand font-medium hover:underline underline-offset-4"
              >
                Hubungi via WhatsApp &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            &copy; {currentYear} LATANSA Platform. Hak cipta dilindungi.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[11px]">Sistem Manajemen Katalog & Pengadaan Bisnis</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
