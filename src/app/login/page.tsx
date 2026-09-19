import { LatansaLogo } from "@/components/brand/latansa-logo";
import { LoginForm } from "./login-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Masuk Portal Internal | LATANSA",
  description: "Otentikasi staf dan manajemen platform internal LATANSA.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 selection:bg-brand/15 selection:text-brand">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-2">
          <Link
            href="/"
            className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Kembali ke Beranda Publik
          </Link>
        </div>

        <div className="bg-card p-8 sm:p-10 rounded-lg border border-border/80 shadow-xs space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <LatansaLogo width={120} height={40} priority />
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Masuk ke Sistem
              </h1>
              <p className="text-xs text-muted-foreground">
                Masukkan akun terdaftar Anda untuk mengakses portal manajemen internal.
              </p>
            </div>
          </div>

          <LoginForm />
        </div>

        <div className="text-center text-[11px] text-muted-foreground">
          &copy; {new Date().getFullYear()} LATANSA Platform. Hak akses dibatasi untuk staf berwenang.
        </div>
      </div>
    </div>
  );
}
