import { requireRole } from "@/modules/auth/authorization";

export default async function ProductsProofPage() {
  // Enforce server-side RBAC
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Products & Catalog</h1>
        <p className="text-muted-foreground text-slate-500">
          This is a proof-of-concept protected route.
        </p>
      </div>

      <div className="p-6 bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 rounded-lg">
        <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">Access Granted</h2>
        <p className="text-purple-600 dark:text-purple-400">
          You are authenticated and hold a role authorized to manage products (SUPER_ADMIN or PRODUCT_SALES_ADMIN).
        </p>
      </div>
    </div>
  );
}
