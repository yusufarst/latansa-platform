import { requireUser } from "@/modules/auth/authorization";
import { LatansaLogo } from "@/components/brand/latansa-logo";
import { logoutAction } from "@/modules/auth/actions";
import Link from "next/link";
import { LogOut, LayoutDashboard, Package, ShoppingCart } from "lucide-react";
import { db } from "@/db";
import { roles } from "@/modules/auth/db/schema";
import { eq } from "drizzle-orm";

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireUser();

  const userRole = await db.query.roles.findFirst({
    where: eq(roles.id, user.roleId),
  });

  const roleCode = userRole?.code || "";

  const canAccessInventory = ["SUPER_ADMIN", "INVENTORY_ADMIN"].includes(roleCode);
  const canAccessProducts = ["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"].includes(roleCode);

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-brand/15 selection:text-brand">
      {/* Internal Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-card/95 backdrop-blur-xs">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Link href="/internal" className="flex items-center gap-2 group">
              <LatansaLogo width={100} height={32} />
            </Link>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-sm bg-stone-100 dark:bg-stone-800 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground border border-border/60">
              Portal Internal
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="text-xs text-right hidden sm:block">
              <div className="font-medium text-foreground">{user.email}</div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase">
                {roleCode}
              </div>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                title="Logout"
                aria-label="Logout"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
              >
                <LogOut size={14} />
                <span>Keluar</span>
                <span className="sr-only">Logout</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <div className="flex-1 container mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-60 shrink-0">
          <div className="p-3 rounded-lg border border-border/80 bg-card shadow-2xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 py-2">
              Menu Navigasi
            </div>
            <nav className="flex flex-col gap-1">
              <Link
                href="/internal"
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <LayoutDashboard size={16} className="text-brand" />
                <span>Dasbor</span>
              </Link>

              {canAccessInventory && (
                <Link
                  href="/internal/inventory"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <Package size={16} className="text-brand" />
                  <span>Inventaris</span>
                </Link>
              )}

              {canAccessProducts && (
                <Link
                  href="/internal/products"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <ShoppingCart size={16} className="text-brand" />
                  <span>Produk & Katalog</span>
                </Link>
              )}
            </nav>
          </div>
        </aside>

        {/* Workspace Body */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
