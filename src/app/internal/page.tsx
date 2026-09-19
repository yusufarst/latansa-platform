import { requireUser } from "@/modules/auth/authorization";

export const metadata = {
  title: "Dasbor Internal | LATANSA",
};

export default async function InternalDashboardPage() {
  const { user } = await requireUser();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-brand">
          Manajemen Platform
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Dasbor
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Selamat datang di portal manajemen operasional LATANSA Platform.
        </p>
      </div>

      <div className="p-6 bg-card border border-border/80 rounded-lg shadow-2xs space-y-4 max-w-xl">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
          Profil Pengguna
        </h2>
        <div className="space-y-2.5 text-xs text-muted-foreground">
          <div className="flex justify-between py-1 border-b border-border/60">
            <span className="font-medium text-foreground">Alamat Email:</span>
            <span className="font-mono">{user.email}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/60">
            <span className="font-medium text-foreground">Status Akun:</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {user.isActive ? "Aktif" : "Nonaktif"}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-medium text-foreground">Terdaftar:</span>
            <span>{new Date(user.createdAt).toLocaleDateString("id-ID")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
