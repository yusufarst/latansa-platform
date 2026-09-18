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
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="container flex h-16 items-center px-4 md:px-8 mx-auto">
          <Link href="/internal" className="flex items-center gap-2">
            <LatansaLogo width={100} height={32} />
          </Link>

          <div className="ml-auto flex items-center gap-4">
            <div className="text-sm hidden sm:block text-slate-500 dark:text-slate-400">
              {user.email} <span className="text-xs ml-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{roleCode.replace('_', ' ')}</span>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-2">
            <Link 
              href="/internal"
              className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            
            {canAccessInventory && (
              <Link 
                href="/internal/inventory"
                className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Package size={18} />
                Inventory
              </Link>
            )}
            
            {canAccessProducts && (
              <Link 
                href="/internal/products"
                className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ShoppingCart size={18} />
                Products & Catalog
              </Link>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
