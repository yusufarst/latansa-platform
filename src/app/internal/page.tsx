import { requireUser } from "@/modules/auth/authorization";

export default async function InternalDashboardPage() {
  const { user } = await requireUser();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-slate-500">
          Welcome to the LATANSA Platform internal portal.
        </p>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Status:</strong> {user.isActive ? "Active" : "Inactive"}</p>
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
