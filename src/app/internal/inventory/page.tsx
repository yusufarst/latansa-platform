import { requireRole } from "@/modules/auth/authorization";

export default async function InventoryProofPage() {
  // Enforce server-side RBAC
  await requireRole(["SUPER_ADMIN", "INVENTORY_ADMIN"]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-muted-foreground text-slate-500">
          This is a proof-of-concept protected route.
        </p>
      </div>

      <div className="p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">Access Granted</h2>
        <p className="text-blue-600 dark:text-blue-400">
          You are authenticated and hold a role authorized to view inventory (SUPER_ADMIN or INVENTORY_ADMIN).
        </p>
      </div>
    </div>
  );
}
