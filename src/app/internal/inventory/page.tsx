import { requireRole } from "@/modules/auth/authorization";

export const metadata = {
  title: "Inventaris | LATANSA Portal Internal",
};

export default async function InventoryProofPage() {
  await requireRole(["SUPER_ADMIN", "INVENTORY_ADMIN"]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-brand">
          Manajemen Stok & Gudang
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Inventaris
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Modul manajemen inventaris, gudang, dan pergerakan stok.
        </p>
      </div>

      <div className="p-6 bg-stone-50/80 dark:bg-stone-900/40 border border-border/80 rounded-lg max-w-xl space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-brand">
          Akses Terverifikasi
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Anda memiliki hak akses untuk mengelola inventaris dan stok barang (SUPER_ADMIN / INVENTORY_ADMIN).
        </p>
      </div>
    </div>
  );
}
