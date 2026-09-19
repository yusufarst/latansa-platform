import { getProductsAdmin } from "@/modules/products/services/internal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Data Master Produk | LATANSA Portal Internal",
};

export default async function ProductsPage() {
  const productsList = await getProductsAdmin();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand">
            Manajemen Master Data
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Produk & Katalog
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Kelola katalog, spesifikasi teknis, dan status publikasi produk.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/internal/products/categories"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs border-border/80")}
          >
            Kategori
          </Link>
          <Link
            href="/internal/products/brands"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs border-border/80")}
          >
            Merek
          </Link>
          <Link
            href="/internal/products/new"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-brand hover:bg-brand-hover text-brand-foreground text-xs font-semibold shadow-xs flex items-center gap-1.5"
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Produk</span>
            <span className="sr-only">Add Product</span>
          </Link>
        </div>
      </div>

      {/* Product List Table */}
      <Card className="border-border/80 shadow-2xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-bold text-foreground">
            Semua Produk
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Daftar master produk yang tersimpan dalam sistem.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-stone-50/70 dark:bg-stone-900/50">
              <TableRow className="border-border/80 hover:bg-transparent">
                <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-3">
                  Nomor SKU
                </TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-3">
                  Nama Produk
                </TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-3">
                  Status
                </TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-3">
                  Pelacakan
                </TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-right py-3 pr-6">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs divide-y divide-border/60">
              {productsList.map((prod) => (
                <TableRow key={prod.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/30">
                  <TableCell className="font-mono font-medium text-foreground py-3">
                    {prod.sku}
                  </TableCell>
                  <TableCell className="font-medium text-foreground py-3">
                    {prod.name}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      variant={
                        prod.status === "PUBLISHED"
                          ? "default"
                          : prod.status === "DRAFT"
                            ? "secondary"
                            : "destructive"
                      }
                      className={cn(
                        "text-[10px] uppercase font-semibold",
                        prod.status === "PUBLISHED" && "bg-emerald-700 hover:bg-emerald-800 text-white"
                      )}
                    >
                      {prod.status === "PUBLISHED"
                        ? "Terbit"
                        : prod.status === "DRAFT"
                          ? "Draf"
                          : "Diarsipkan"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-[11px] font-mono text-muted-foreground bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-sm border border-border/60">
                      {prod.trackingMode}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-3 pr-6">
                    <Link
                      href={`/internal/products/${prod.id}`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "h-7 px-2.5 text-xs text-brand hover:text-brand hover:bg-brand/10 font-medium"
                      )}
                    >
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {productsList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    Belum ada produk yang tersimpan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
